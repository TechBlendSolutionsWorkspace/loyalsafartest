<?php

namespace App\Services;

use App\Models\Area;
use App\Models\CommissionSlab;
use App\Models\Ride;
use App\Models\DriverWallet;
use App\Models\CompanyWallet;
use App\Models\CouponRedemption;
use App\Models\Coupon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class CommissionService
{
    /**
     * Calculate commission based on area and fare using dynamic slabs
     * As per PDF: Step 1-6 workflow
     */
    public function calculateCommission(Ride $ride): array
    {
        $areaId = $ride->area_id;
        $totalFare = $ride->total_fare;

        if (!$areaId || !$totalFare) {
            throw new Exception("Area ID and total fare are required for commission calculation");
        }

        // Step 2: Find matching commission slab
        $slab = $this->findMatchingSlab($areaId, $totalFare);

        if (!$slab) {
            throw new Exception("No commission slab found for area {$areaId} and fare {$totalFare}");
        }

        // Step 4: Calculate commission
        $commissionAmount = $this->calculateCommissionAmount($slab, $totalFare);

        // Step 5: Calculate driver payout
        $driverPayout = $totalFare - $commissionAmount;

        return [
            'slab_id' => $slab->id,
            'commission_type' => $slab->commission_type,
            'commission_value' => $slab->commission_value,
            'commission_amount' => round($commissionAmount, 2),
            'driver_payout' => round($driverPayout, 2),
            'total_fare' => $totalFare,
            'area_name' => $slab->area->name ?? 'Unknown'
        ];
    }

    /**
     * Find matching commission slab for area and fare
     * Step 2-3 from PDF workflow
     */
    private function findMatchingSlab(int $areaId, float $fare): ?CommissionSlab
    {
        // Step 2: Look for slab with matching fare range
        $slab = CommissionSlab::where('area_id', $areaId)
            ->where('active', true)
            ->where('min_fare', '<=', $fare)
            ->where('max_fare', '>=', $fare)
            ->first();

        // Step 3: If no match, use default slab for area
        if (!$slab) {
            $slab = CommissionSlab::where('area_id', $areaId)
                ->where('active', true)
                ->where('is_default', true)
                ->first();
        }

        return $slab;
    }

    /**
     * Calculate commission amount based on slab type
     * Step 4 from PDF workflow
     */
    private function calculateCommissionAmount(CommissionSlab $slab, float $fare): float
    {
        if ($slab->commission_type === 'fixed') {
            return $slab->commission_value;
        } else {
            // Percentage calculation
            return ($slab->commission_value / 100) * $fare;
        }
    }

    /**
     * Process coupon and ensure driver gets full fare
     * Implements Tab 3 coupon workflow from PDF
     */
    public function processCouponRide(Ride $ride, string $couponCode): array
    {
        return DB::transaction(function () use ($ride, $couponCode) {
            // Validate coupon
            $coupon = Coupon::where('code', $couponCode)
                ->where('active', true)
                ->first();

            if (!$coupon || !$coupon->isValid()) {
                throw new Exception("Invalid or expired coupon: {$couponCode}");
            }

            $originalFare = $ride->total_fare;
            $discountAmount = $coupon->calculateDiscount($originalFare);
            $finalFare = $originalFare - $discountAmount;

            // Update ride with coupon data
            $ride->update([
                'coupon_code' => $couponCode,
                'coupon_discount' => $discountAmount,
                'final_fare' => $finalFare
            ]);

            // Record coupon redemption
            CouponRedemption::create([
                'user_id' => $ride->passenger_id,
                'ride_id' => $ride->id,
                'coupon_code' => $couponCode,
                'discount_amount' => $discountAmount,
                'original_fare' => $originalFare,
                'final_fare' => $finalFare,
                'covered_by' => 'company'
            ]);

            return [
                'original_fare' => $originalFare,
                'discount_amount' => $discountAmount,
                'final_fare' => $finalFare,
                'coupon_code' => $couponCode
            ];
        });
    }

    /**
     * Complete ride with commission calculation and wallet management
     * Implements full workflow from Steps 1-7 plus coupon handling
     */
    public function completeRide(Ride $ride): array
    {
        return DB::transaction(function () use ($ride) {
            $result = [];

            // Calculate commission
            $commissionData = $this->calculateCommission($ride);

            // Update ride with commission data (Step 6)
            $ride->update([
                'commission_amount' => $commissionData['commission_amount'],
                'commission_type' => $commissionData['commission_type'],
                'driver_payout' => $commissionData['driver_payout'],
                'ride_status' => 'completed',
                'payment_status' => 'completed'
            ]);

            // Determine driver payout amount
            if ($ride->coupon_code) {
                // For coupon rides: Driver gets full original fare
                $driverPayoutAmount = $ride->total_fare;
                $reason = "Ride Fare with Coupon Covered";
                $source = "User Paid + Company Coupon";
            } else {
                // For regular rides: Driver gets fare minus commission
                $driverPayoutAmount = $commissionData['driver_payout'];
                $reason = "Ride Fare after Commission";
                $source = "ride_earning";
            }

            // Step 7: Credit driver wallet
            DriverWallet::create([
                'driver_id' => $ride->driver_id,
                'ride_id' => $ride->id,
                'amount' => $driverPayoutAmount,
                'transaction_type' => 'credit',
                'reason' => $reason,
                'source' => $source
            ]);

            $result['driver_payout'] = $driverPayoutAmount;

            // Company wallet transactions
            if ($ride->coupon_code) {
                // Company absorbs coupon discount
                CompanyWallet::create([
                    'ride_id' => $ride->id,
                    'driver_id' => $ride->driver_id,
                    'amount' => $ride->coupon_discount,
                    'transaction_type' => 'debit',
                    'reason' => "Coupon Redeem for Ride #{$ride->id}",
                    'source' => 'coupon_discount'
                ]);

                $result['company_coupon_cost'] = $ride->coupon_discount;
            }

            // Company earns commission
            CompanyWallet::create([
                'ride_id' => $ride->id,
                'driver_id' => $ride->driver_id,
                'amount' => $commissionData['commission_amount'],
                'transaction_type' => 'credit',
                'reason' => 'Commission from ride',
                'source' => 'commission'
            ]);

            $result['commission_data'] = $commissionData;
            $result['company_commission'] = $commissionData['commission_amount'];

            return $result;
        });
    }

    /**
     * Get driver wallet summary with commission transparency
     */
    public function getDriverWalletSummary(int $driverId): array
    {
        $transactions = DriverWallet::where('driver_id', $driverId)->get();

        $balance = $transactions->sum(function ($transaction) {
            return $transaction->transaction_type === 'credit' 
                ? $transaction->amount 
                : -$transaction->amount;
        });

        $totalEarnings = $transactions->where('transaction_type', 'credit')->sum('amount');
        $totalDeductions = $transactions->where('transaction_type', 'debit')->sum('amount');

        // Earnings breakdown by source
        $earningsBySource = $transactions
            ->where('transaction_type', 'credit')
            ->groupBy('source')
            ->map(function ($group) {
                return [
                    'count' => $group->count(),
                    'total' => $group->sum('amount')
                ];
            });

        return [
            'balance' => round($balance, 2),
            'total_earnings' => round($totalEarnings, 2),
            'total_deductions' => round($totalDeductions, 2),
            'earnings_by_source' => $earningsBySource,
            'recent_transactions' => $transactions->sortByDesc('created_at')->take(10)->values()
        ];
    }

    /**
     * Get company wallet summary for admin dashboard
     */
    public function getCompanyWalletSummary(): array
    {
        $transactions = CompanyWallet::all();

        $balance = $transactions->sum(function ($transaction) {
            return $transaction->transaction_type === 'credit' 
                ? $transaction->amount 
                : -$transaction->amount;
        });

        $totalCommissions = $transactions
            ->where('transaction_type', 'credit')
            ->where('source', 'commission')
            ->sum('amount');

        $totalCouponCosts = $transactions
            ->where('transaction_type', 'debit')
            ->where('source', 'coupon_discount')
            ->sum('amount');

        return [
            'balance' => round($balance, 2),
            'total_commissions' => round($totalCommissions, 2),
            'total_coupon_costs' => round($totalCouponCosts, 2),
            'net_profit' => round($totalCommissions - $totalCouponCosts, 2)
        ];
    }

    /**
     * Validate commission slab ranges to prevent overlaps
     * For admin panel slab management
     */
    public function validateSlabRange(int $areaId, float $minFare, float $maxFare, int $excludeSlabId = null): bool
    {
        $query = CommissionSlab::where('area_id', $areaId)
            ->where('active', true)
            ->where(function ($q) use ($minFare, $maxFare) {
                $q->whereBetween('min_fare', [$minFare, $maxFare])
                  ->orWhereBetween('max_fare', [$minFare, $maxFare])
                  ->orWhere(function ($q) use ($minFare, $maxFare) {
                      $q->where('min_fare', '<=', $minFare)
                        ->where('max_fare', '>=', $maxFare);
                  });
            });

        if ($excludeSlabId) {
            $query->where('id', '!=', $excludeSlabId);
        }

        return $query->count() === 0;
    }
}