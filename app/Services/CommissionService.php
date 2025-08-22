<?php

namespace App\Services;

use App\Models\Area;
use App\Models\CommissionSlab;
use App\Models\DriverWallet;
use App\Models\CompanyWallet;
use App\Models\Coupon;
use App\Models\CouponRedemption;
use App\Models\Ride;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;

class CommissionService
{
    /**
     * Calculate transparent commission for a ride
     */
    public function calculateCommission(Ride $ride): array
    {
        $area = $ride->area;
        $fare = $ride->total_fare ?? $ride->estimated_fare;
        
        // Find applicable commission slab
        $commissionSlab = $this->findCommissionSlab($area->id, $fare);
        
        if (!$commissionSlab) {
            throw new \Exception("No commission slab found for area {$area->name} and fare {$fare}");
        }
        
        $commissionAmount = 0;
        $commissionType = $commissionSlab->commission_type;
        
        if ($commissionType === 'fixed') {
            $commissionAmount = $commissionSlab->commission_value;
        } else {
            $commissionAmount = ($fare * $commissionSlab->commission_value) / 100;
        }
        
        // Ensure commission doesn't exceed fare
        $commissionAmount = min($commissionAmount, $fare);
        
        $driverPayout = $fare - $commissionAmount;
        
        return [
            'total_fare' => $fare,
            'commission_amount' => round($commissionAmount, 2),
            'commission_type' => $commissionType,
            'commission_rate' => $commissionSlab->commission_value,
            'driver_payout' => round($driverPayout, 2),
            'area_name' => $area->name,
            'slab_details' => [
                'min_fare' => $commissionSlab->min_fare,
                'max_fare' => $commissionSlab->max_fare,
                'rate' => $commissionSlab->commission_value,
                'type' => $commissionSlab->commission_type
            ]
        ];
    }
    
    /**
     * Process coupon discount with company covering the cost
     */
    public function processCouponDiscount(Ride $ride, string $couponCode): array
    {
        $coupon = Coupon::query()->where('code', $couponCode)
            ->where('active', true)
            ->first();
            
        if (!$coupon) {
            throw new \Exception("Invalid or inactive coupon: {$couponCode}");
        }
        
        if (!$coupon->isValid()) {
            throw new \Exception("Coupon {$couponCode} has expired or reached usage limit");
        }
        
        if (!$coupon->isApplicableForArea($ride->area_id)) {
            throw new \Exception("Coupon {$couponCode} is not applicable for this area");
        }
        
        $originalFare = $ride->total_fare ?? $ride->estimated_fare;
        $discountAmount = $coupon->calculateDiscount($originalFare);
        $finalFare = $originalFare - $discountAmount;
        
        return [
            'original_fare' => $originalFare,
            'discount_amount' => round($discountAmount, 2),
            'final_fare' => round($finalFare, 2),
            'coupon_code' => $couponCode,
            'coupon_name' => $coupon->name,
            'covered_by' => 'company' // Driver gets full fare, company absorbs discount
        ];
    }
    
    /**
     * Complete ride transaction with transparent wallet management
     */
    public function completeRideTransaction(Ride $ride): array
    {
        return DB::transaction(function () use ($ride) {
            $transactionLog = [];
            
            // Calculate commission
            $commissionData = $this->calculateCommission($ride);
            
            // Handle coupon if applied
            $couponData = null;
            if ($ride->coupon_code) {
                $couponData = $this->processCouponDiscount($ride, $ride->coupon_code);
                
                // Update ride with coupon data
                $ride->update([
                    'coupon_discount' => $couponData['discount_amount'],
                    'final_fare' => $couponData['final_fare']
                ]);
                
                // Record coupon redemption
                CouponRedemption::query()->create([
                    'user_id' => $ride->passenger_id,
                    'ride_id' => $ride->id,
                    'coupon_code' => $ride->coupon_code,
                    'discount_amount' => $couponData['discount_amount'],
                    'original_fare' => $couponData['original_fare'],
                    'final_fare' => $couponData['final_fare'],
                    'covered_by' => 'company'
                ]);
                
                // Update coupon usage count
                Coupon::query()->where('code', $ride->coupon_code)->increment('used_count');
                
                $transactionLog[] = "Coupon {$ride->coupon_code} applied: -{$couponData['discount_amount']}";
            }
            
            // Update ride with commission data
            $ride->update([
                'commission_amount' => $commissionData['commission_amount'],
                'commission_type' => $commissionData['commission_type'],
                'driver_payout' => $commissionData['driver_payout'],
                'payment_status' => 'completed'
            ]);
            
            // Credit driver wallet - Full amount for coupon rides, payout amount for regular rides
            $driverCreditAmount = $ride->coupon_code ? 
                $commissionData['total_fare'] : $commissionData['driver_payout'];
                
            DriverWallet::query()->create([
                'driver_id' => $ride->driver_id,
                'ride_id' => $ride->id,
                'amount' => $driverCreditAmount,
                'transaction_type' => 'credit',
                'reason' => $ride->coupon_code ? 
                    'Ride earning (full fare - coupon covered by company)' : 'Ride earning',
                'source' => 'ride_earning'
            ]);
            
            $transactionLog[] = "Driver credited: +{$driverCreditAmount}";
            
            // Company wallet transactions
            if ($ride->coupon_code) {
                // Company absorbs coupon discount
                CompanyWallet::query()->create([
                    'ride_id' => $ride->id,
                    'driver_id' => $ride->driver_id,
                    'amount' => $couponData['discount_amount'],
                    'transaction_type' => 'debit',
                    'reason' => 'Coupon discount covered for driver',
                    'source' => 'coupon_discount'
                ]);
                
                $transactionLog[] = "Company absorbed coupon discount: -{$couponData['discount_amount']}";
            }
            
            // Company earns commission
            CompanyWallet::query()->create([
                'ride_id' => $ride->id,
                'driver_id' => $ride->driver_id,
                'amount' => $commissionData['commission_amount'],
                'transaction_type' => 'credit',
                'reason' => 'Commission from ride',
                'source' => 'commission'
            ]);
            
            $transactionLog[] = "Company commission: +{$commissionData['commission_amount']}";
            
            return [
                'commission_data' => $commissionData,
                'coupon_data' => $couponData,
                'transaction_log' => $transactionLog,
                'driver_net_earning' => $driverCreditAmount,
                'company_net_earning' => $commissionData['commission_amount'] - ($couponData['discount_amount'] ?? 0)
            ];
        });
    }
    
    /**
     * Get transparent commission breakdown for driver
     */
    public function getDriverCommissionBreakdown(User $driver, $startDate = null, $endDate = null): array
    {
        $query = $driver->driverRides()
            ->where('payment_status', 'completed');
            
        if ($startDate) {
            $query->where('completed_at', '>=', $startDate);
        }
        
        if ($endDate) {
            $query->where('completed_at', '<=', $endDate);
        }
        
        $rides = $query->with(['area', 'coupon'])->get();
        
        $breakdown = [
            'total_rides' => $rides->count(),
            'total_fare' => $rides->sum('total_fare'),
            'total_commission' => $rides->sum('commission_amount'),
            'total_payout' => $rides->sum('driver_payout'),
            'coupon_rides' => $rides->where('coupon_code', '!=', null)->count(),
            'coupon_benefits' => $rides->where('coupon_code', '!=', null)->sum('coupon_discount'),
            'wallet_balance' => $driver->getWalletBalance(),
            'pending_balance' => $driver->getPendingWalletBalance(),
            'rides_by_area' => []
        ];
        
        // Group by area for transparency
        foreach ($rides->groupBy('area_id') as $areaId => $areaRides) {
            $area = $areaRides->first()->area;
            $breakdown['rides_by_area'][] = [
                'area_name' => $area->name,
                'ride_count' => $areaRides->count(),
                'total_fare' => $areaRides->sum('total_fare'),
                'commission_amount' => $areaRides->sum('commission_amount'),
                'driver_payout' => $areaRides->sum('driver_payout'),
                'avg_commission_rate' => $areaRides->avg('commission_amount') / $areaRides->avg('total_fare') * 100
            ];
        }
        
        return $breakdown;
    }
    
    /**
     * Find applicable commission slab
     */
    private function findCommissionSlab(int $areaId, float $fare): ?CommissionSlab
    {
        return CommissionSlab::query()->where('area_id', $areaId)
            ->where('active', true)
            ->where('min_fare', '<=', $fare)
            ->where('max_fare', '>=', $fare)
            ->first() 
            ?? CommissionSlab::query()->where('area_id', $areaId)
                ->where('active', true)
                ->where('is_default', true)
                ->first();
    }
}