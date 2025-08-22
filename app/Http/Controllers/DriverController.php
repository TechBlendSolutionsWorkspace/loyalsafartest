<?php

namespace App\Http\Controllers;

use App\Models\Ride;
use App\Models\DriverWallet;
use App\Models\CompanyWallet;
use App\Models\CommissionSlab;
use App\Models\Area;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DriverController extends Controller
{
    public function dashboard()
    {
        $driver = Auth::user();
        
        // Get wallet balance
        $walletBalance = DriverWallet::where('driver_id', $driver->id)
            ->sum('amount');
            
        // Get today's earnings
        $todayEarnings = DriverWallet::where('driver_id', $driver->id)
            ->whereDate('created_at', today())
            ->where('transaction_type', 'credit')
            ->sum('amount');
            
        // Get monthly earnings
        $monthlyEarnings = DriverWallet::where('driver_id', $driver->id)
            ->whereMonth('created_at', now()->month)
            ->where('transaction_type', 'credit')
            ->sum('amount');
            
        // Get total rides
        $totalRides = Ride::where('driver_id', $driver->id)
            ->where('status', 'completed')
            ->count();
            
        // Get pending rides
        $pendingRides = Ride::where('status', 'pending')
            ->with(['passenger', 'area'])
            ->limit(10)
            ->get();
            
        // Get recent completed rides
        $recentRides = Ride::where('driver_id', $driver->id)
            ->with(['passenger', 'area'])
            ->orderBy('completed_at', 'desc')
            ->limit(5)
            ->get();

        return view('driver.dashboard', compact(
            'walletBalance', 'todayEarnings', 'monthlyEarnings', 
            'totalRides', 'pendingRides', 'recentRides'
        ));
    }

    public function wallet()
    {
        $driver = Auth::user();
        
        // Get wallet balance
        $walletBalance = DriverWallet::where('driver_id', $driver->id)
            ->sum('amount');
            
        // Get monthly earnings
        $totalEarnings = DriverWallet::where('driver_id', $driver->id)
            ->whereMonth('created_at', now()->month)
            ->where('transaction_type', 'credit')
            ->sum('amount');
            
        // Get total payouts
        $totalPayouts = DriverWallet::where('driver_id', $driver->id)
            ->where('transaction_type', 'debit')
            ->where('reason', 'payout')
            ->count();
            
        // Get average commission
        $avgCommission = Ride::where('driver_id', $driver->id)
            ->where('status', 'completed')
            ->whereDate('completed_at', '>=', now()->subDays(30))
            ->avg('commission_amount') ?? 0;
            
        // Get recent transactions
        $transactions = DriverWallet::where('driver_id', $driver->id)
            ->with('ride')
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return view('driver.wallet', compact(
            'walletBalance', 'totalEarnings', 'totalPayouts', 
            'avgCommission', 'transactions'
        ));
    }

    public function acceptRide(Request $request, $rideId)
    {
        $ride = Ride::findOrFail($rideId);
        
        if ($ride->status !== 'pending') {
            return response()->json(['error' => 'Ride is no longer available'], 400);
        }

        $ride->update([
            'driver_id' => Auth::id(),
            'status' => 'accepted',
            'accepted_at' => now()
        ]);

        return response()->json(['message' => 'Ride accepted successfully!']);
    }

    public function startRide(Request $request, $rideId)
    {
        $ride = Ride::findOrFail($rideId);
        
        if ($ride->driver_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($ride->status !== 'otp_verified') {
            return response()->json(['error' => 'OTP not verified'], 400);
        }

        $ride->update([
            'status' => 'in_progress',
            'pickup_time' => now()
        ]);

        return response()->json(['message' => 'Ride started successfully!']);
    }

    public function completeRide(Request $request, $rideId)
    {
        $request->validate([
            'actual_fare' => 'required|numeric|min:0'
        ]);

        $ride = Ride::findOrFail($rideId);
        
        if ($ride->driver_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($ride->status !== 'in_progress') {
            return response()->json(['error' => 'Ride is not in progress'], 400);
        }

        DB::transaction(function () use ($ride, $request) {
            // Update ride status
            $ride->update([
                'status' => 'completed',
                'actual_fare' => $request->actual_fare,
                'completed_at' => now()
            ]);

            // Calculate commission
            $this->processCommissionAndPayout($ride, $request->actual_fare);
        });

        return response()->json(['message' => 'Ride completed successfully!']);
    }

    public function instantPayout(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'upi_id' => 'required|string'
        ]);

        $driver = Auth::user();
        $walletBalance = DriverWallet::where('driver_id', $driver->id)->sum('amount');

        if ($request->amount > $walletBalance) {
            return response()->json(['error' => 'Insufficient balance'], 400);
        }

        // Create payout transaction
        DriverWallet::create([
            'driver_id' => $driver->id,
            'amount' => -$request->amount,
            'transaction_type' => 'debit',
            'reason' => 'payout',
            'source' => 'upi_payout',
            'reference_id' => 'UPI_' . time()
        ]);

        // Here you would integrate with payment gateway for actual UPI transfer
        // For now, we simulate successful payout

        return response()->json([
            'message' => 'Payout initiated successfully! Amount will be credited to your UPI ID within 5 minutes.',
            'reference_id' => 'UPI_' . time()
        ]);
    }

    public function leaderboard()
    {
        $topDrivers = User::where('role', 'driver')
            ->withSum('driverEarnings', 'amount')
            ->orderBy('driver_earnings_sum_amount', 'desc')
            ->limit(10)
            ->get();

        $currentDriverRank = User::where('role', 'driver')
            ->withSum('driverEarnings', 'amount')
            ->orderBy('driver_earnings_sum_amount', 'desc')
            ->pluck('id')
            ->search(Auth::id()) + 1;

        return view('driver.leaderboard', compact('topDrivers', 'currentDriverRank'));
    }

    private function processCommissionAndPayout($ride, $actualFare)
    {
        // Find appropriate commission slab
        $area = Area::find($ride->area_id);
        $commissionSlab = CommissionSlab::where('area_id', $area->id)
            ->where('min_fare', '<=', $actualFare)
            ->where(function($query) use ($actualFare) {
                $query->where('max_fare', '>=', $actualFare)
                      ->orWhereNull('max_fare');
            })
            ->first();

        if (!$commissionSlab) {
            // Use default slab if no specific slab found
            $commissionSlab = CommissionSlab::where('area_id', $area->id)
                ->where('is_default', true)
                ->first();
        }

        $commissionAmount = 0;
        if ($commissionSlab) {
            if ($commissionSlab->commission_type === 'percentage') {
                $commissionAmount = ($actualFare * $commissionSlab->commission_value) / 100;
            } else {
                $commissionAmount = $commissionSlab->commission_value;
            }
        }

        $driverPayout = $actualFare - $commissionAmount;

        // Handle coupon discount - company covers it
        if ($ride->coupon_discount > 0) {
            $driverPayout = $actualFare; // Driver gets full amount
            
            // Company covers the coupon discount
            CompanyWallet::create([
                'ride_id' => $ride->id,
                'driver_id' => $ride->driver_id,
                'amount' => -$ride->coupon_discount,
                'transaction_type' => 'debit',
                'reason' => 'coupon_coverage'
            ]);
        }

        // Update ride with commission details
        $ride->update([
            'commission_amount' => $commissionAmount,
            'commission_type' => $commissionSlab->commission_type ?? 'fixed',
            'driver_payout' => $driverPayout,
            'payment_status' => 'completed'
        ]);

        // Credit driver wallet
        DriverWallet::create([
            'driver_id' => $ride->driver_id,
            'ride_id' => $ride->id,
            'amount' => $driverPayout,
            'transaction_type' => 'credit',
            'reason' => 'ride_earning',
            'source' => 'ride_completion'
        ]);

        // Record coupon redemption if applicable
        if ($ride->coupon_code) {
            CouponRedemption::create([
                'user_id' => $ride->passenger_id,
                'ride_id' => $ride->id,
                'coupon_code' => $ride->coupon_code,
                'discount_amount' => $ride->coupon_discount,
                'covered_by' => 'company'
            ]);
        }
    }
}