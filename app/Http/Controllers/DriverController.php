<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DriverController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        
        // Basic stats for the driver
        $stats = [
            'total_earnings' => 0,
            'total_rides' => 0,
            'rating' => $user->rating ?? 4.5,
            'wallet_balance' => 0
        ];
        
        return view('driver.dashboard', compact('stats'));
    }
    
    public function wallet()
    {
        $user = Auth::user();
        
        $walletData = [
            'balance' => 0,
            'pending_earnings' => 0,
            'total_earnings' => 0,
            'transactions' => []
        ];
        
        return view('driver.wallet', compact('walletData'));
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
        return response()->json([
            'success' => true,
            'message' => 'Ride accepted successfully!'
        ]);
    }
    
    public function startRide(Request $request, $rideId)
    {
        $request->validate([
            'otp' => 'required|digits:4'
        ]);
        
        // Mock ride start
        return response()->json([
            'success' => true,
            'message' => 'Ride started successfully!'
        ]);
    }
    
    public function completeRide(Request $request, $rideId)
    {
        // Mock ride completion
        return response()->json([
            'success' => true,
            'message' => 'Ride completed successfully!'
        ]);
    }
    
    public function instantPayout(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:100'
        ]);
        
        // Mock instant payout
        return response()->json([
            'success' => true,
            'message' => 'Payout request processed successfully!'
        ]);
    }
}