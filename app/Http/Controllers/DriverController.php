<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Ride;
use App\Models\User;
use App\Models\DriverEarning;
use App\Models\DriverWallet;
use App\Models\Area;
use App\Models\Coupon;
use App\Services\CommissionService;
use Carbon\Carbon;

class DriverController extends Controller
{
    protected $commissionService;

    public function __construct(CommissionService $commissionService)
    {
        $this->commissionService = $commissionService;
    }

    public function dashboard()
    {
        $driver = Auth::user();
        
        // Enhanced stats with transparent commission breakdown
        $totalRides = Ride::where('driver_id', $driver->id)->count();
        $completedRides = Ride::where('driver_id', $driver->id)
            ->where('payment_status', 'completed')
            ->count();
        
        $todayRides = Ride::where('driver_id', $driver->id)
            ->whereDate('created_at', today())
            ->count();
        
        // Wallet and earnings transparency
        $walletBalance = $driver->getWalletBalance();
        $pendingBalance = $driver->getPendingWalletBalance();
        
        $todayEarnings = DriverWallet::where('driver_id', $driver->id)
            ->where('transaction_type', 'credit')
            ->whereDate('created_at', today())
            ->sum('amount');
            
        $weeklyEarnings = DriverWallet::where('driver_id', $driver->id)
            ->where('transaction_type', 'credit')
            ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->sum('amount');
            
        $monthlyEarnings = DriverWallet::where('driver_id', $driver->id)
            ->where('transaction_type', 'credit')
            ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->sum('amount');
        
        // Commission breakdown with transparency
        $commissionBreakdown = $this->commissionService->getDriverCommissionBreakdown($driver);
        
        // Recent rides with commission details
        $recentRides = Ride::where('driver_id', $driver->id)
            ->with(['passenger', 'area', 'coupon'])
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();
            
        // Recent wallet transactions for transparency
        $recentTransactions = DriverWallet::where('driver_id', $driver->id)
            ->with('ride')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
            
        // Performance metrics
        $performanceMetrics = [
            'avg_rating' => $driver->rating ?? 0,
            'completion_rate' => $totalRides > 0 ? ($completedRides / $totalRides) * 100 : 0,
            'coupon_rides_count' => Ride::where('driver_id', $driver->id)
                ->whereNotNull('coupon_code')
                ->count(),
            'green_rides_count' => Ride::where('driver_id', $driver->id)
                ->where('is_green_ride', true)
                ->count() ?? 0
        ];
        
        // Areas performance
        $areasPerformance = Ride::where('driver_id', $driver->id)
            ->where('payment_status', 'completed')
            ->with('area')
            ->get()
            ->groupBy('area_id')
            ->map(function ($rides, $areaId) {
                $area = $rides->first()->area;
                return [
                    'area_name' => $area->name ?? 'Unknown',
                    'ride_count' => $rides->count(),
                    'total_earnings' => $rides->sum('driver_payout'),
                    'avg_commission_rate' => $rides->avg('commission_amount') / $rides->avg('total_fare') * 100
                ];
            })
            ->values();
            
        // For backward compatibility, keep the old structure
        $stats = [
            'total_earnings' => $walletBalance,
            'total_rides' => $totalRides,
            'rating' => $driver->rating ?? 4.5,
            'wallet_balance' => $walletBalance,
            'status' => 'online'
        ];
        
        // Mock pending ride requests (until real-time system is implemented)
        $pendingRides = [
            ['id' => 1, 'passenger' => 'Amit Sharma', 'pickup' => 'Kolkata Central', 'dropoff' => 'Howrah Station', 'fare' => 120, 'distance' => '8.5 km'],
            ['id' => 2, 'passenger' => 'Priya Das', 'pickup' => 'Salt Lake', 'dropoff' => 'Park Street', 'fare' => 95, 'distance' => '6.2 km']
        ];
        
        return view('driver.dashboard', compact(
            'stats', 
            'driver',
            'pendingRides',
            'totalRides', 
            'completedRides',
            'todayRides', 
            'walletBalance',
            'pendingBalance',
            'todayEarnings',
            'weeklyEarnings', 
            'monthlyEarnings',
            'recentRides',
            'recentTransactions',
            'commissionBreakdown',
            'performanceMetrics',
            'areasPerformance'
        ));
    }
    
    public function wallet()
    {
        $driver = Auth::user();
        
        // Real wallet data with commission transparency
        $walletBalance = $driver->getWalletBalance();
        $pendingBalance = $driver->getPendingWalletBalance();
        
        // Detailed transaction history
        $transactions = DriverWallet::where('driver_id', $driver->id)
            ->with(['ride.area', 'ride.passenger'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
            
        // Earnings summary by source
        $earningsSummary = DriverWallet::where('driver_id', $driver->id)
            ->where('transaction_type', 'credit')
            ->selectRaw('source, COUNT(*) as count, SUM(amount) as total')
            ->groupBy('source')
            ->get()
            ->pluck('total', 'source');
            
        // Weekly earnings chart data
        $weeklyEarnings = DriverWallet::where('driver_id', $driver->id)
            ->where('transaction_type', 'credit')
            ->whereBetween('created_at', [now()->subWeeks(4), now()])
            ->selectRaw('DATE(created_at) as date, SUM(amount) as daily_earnings')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
            
        $walletData = [
            'balance' => $walletBalance,
            'pending_earnings' => $pendingBalance,
            'total_earnings' => $earningsSummary->sum(),
            'transactions' => $transactions,
            'earnings_by_source' => $earningsSummary,
            'weekly_chart_data' => $weeklyEarnings
        ];
        
        return view('driver.wallet', compact('walletData'));
    }
    
    public function rides()
    {
        // Mock rides data for the driver
        $rides = [
            ['id' => 1, 'passenger' => 'Amit Sharma', 'pickup' => 'Kolkata Central', 'dropoff' => 'Howrah Station', 'status' => 'completed', 'fare' => 120],
            ['id' => 2, 'passenger' => 'Priya Das', 'pickup' => 'Salt Lake', 'dropoff' => 'Park Street', 'status' => 'completed', 'fare' => 95],
            ['id' => 3, 'passenger' => 'Raj Kumar', 'pickup' => 'Esplanade', 'dropoff' => 'Garia', 'status' => 'pending', 'fare' => 150]
        ];
        
        return view('driver.rides', compact('rides'));
    }
    
    public function toggleStatus(Request $request)
    {
        $user = Auth::user();
        
        // In a real app, you would update the driver's online status in the database
        // For demo purposes, we'll just return a success response
        
        return response([
            'success' => true,
            'message' => 'Status updated successfully',
            'status' => $request->status === 'online' ? 'online' : 'offline'
        ])->header('Content-Type', 'application/json');
    }
    
    public function updateLocation(Request $request)
    {
        $user = Auth::user();
        
        // In a real app, you would update the driver's location in the database
        // For demo purposes, we'll just return a success response
        
        return response([
            'success' => true,
            'message' => 'Location updated successfully',
            'latitude' => $request->latitude,
            'longitude' => $request->longitude
        ])->header('Content-Type', 'application/json');
    }
    
    public function leaderboard()
    {
        // Mock leaderboard data
        $leaderboard = [
            ['name' => 'Rajesh Kumar', 'earnings' => 15000, 'rides' => 120],
            ['name' => 'Suresh Sharma', 'earnings' => 12500, 'rides' => 98],
            ['name' => 'You', 'earnings' => 0, 'rides' => 0]
        ];
        
        return view('driver.leaderboard', compact('leaderboard'));
    }
    
    public function acceptRide(Request $request, $rideId)
    {
        // Mock ride acceptance
        return response([
            'success' => true,
            'message' => 'Ride accepted successfully!'
        ])->header('Content-Type', 'application/json');
    }
    
    public function startRide(Request $request, $rideId)
    {
        $request->validate([
            'otp' => 'required|digits:4'
        ]);
        
        // Mock ride start
        return response([
            'success' => true,
            'message' => 'Ride started successfully!'
        ])->header('Content-Type', 'application/json');
    }
    
    public function completeRide(Request $request, $rideId)
    {
        // Mock ride completion
        return response([
            'success' => true,
            'message' => 'Ride completed successfully!'
        ])->header('Content-Type', 'application/json');
    }
    
    public function instantPayout(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:100'
        ]);
        
        // Mock instant payout
        return response([
            'success' => true,
            'message' => 'Payout request processed successfully!'
        ])->header('Content-Type', 'application/json');
    }
    
    public function community()
    {
        // Mock community data for drivers
        $communityData = [
            'announcements' => [
                ['title' => 'New Safety Guidelines', 'content' => 'Please follow the updated safety protocols for Kolkata routes.', 'date' => '2025-08-20'],
                ['title' => 'Peak Hours Bonus', 'content' => 'Extra ₹50 bonus during 8-10 AM and 6-8 PM in Howrah area.', 'date' => '2025-08-18']
            ],
            'tips' => [
                ['title' => 'Best Routes in Kolkata', 'content' => 'Avoid Park Street during lunch hours for faster trips.'],
                ['title' => 'Customer Service', 'content' => 'Greet passengers in Bengali: "Namaskar, kemon achen?"']
            ],
            'forum_posts' => [
                ['author' => 'Rajesh Kumar', 'title' => 'Traffic Update: Howrah Bridge', 'replies' => 12, 'time' => '2 hours ago'],
                ['author' => 'Amit Das', 'title' => 'Best pickup spots in Salt Lake', 'replies' => 8, 'time' => '4 hours ago']
            ]
        ];
        
        return view('driver.community', compact('communityData'));
    }
    
    public function profile()
    {
        $user = Auth::user();
        
        // Mock driver profile data
        $profileData = [
            'driver_license' => 'WB12AB345678',
            'vehicle_registration' => 'WB 02 AB 1234',
            'vehicle_type' => 'SEDAN CAR',
            'vehicle_model' => 'Maruti Suzuki Dzire',
            'vehicle_color' => 'White',
            'joining_date' => '2024-01-15',
            'total_trips' => 0,
            'rating' => $user->rating ?? 4.5,
            'documents' => [
                'license' => ['status' => 'verified', 'expiry' => '2026-12-31'],
                'registration' => ['status' => 'verified', 'expiry' => '2025-06-30'],
                'insurance' => ['status' => 'verified', 'expiry' => '2025-12-31'],
                'pollution' => ['status' => 'verified', 'expiry' => '2025-03-31']
            ]
        ];
        
        return view('driver.profile', compact('user', 'profileData'));
    }
}