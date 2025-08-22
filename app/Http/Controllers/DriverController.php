<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DriverController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        
        // Create a driver object with online status
        $driver = (object) [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'status' => 'online', // Default to online for demo
            'is_online' => true
        ];
        
        // Basic stats for the driver
        $stats = [
            'total_earnings' => 0,
            'total_rides' => 0,
            'rating' => $user->rating ?? 4.5,
            'wallet_balance' => 0,
            'status' => 'online'
        ];
        
        // Mock pending ride requests
        $pendingRides = [
            ['id' => 1, 'passenger' => 'Amit Sharma', 'pickup' => 'Kolkata Central', 'dropoff' => 'Howrah Station', 'fare' => 120, 'distance' => '8.5 km'],
            ['id' => 2, 'passenger' => 'Priya Das', 'pickup' => 'Salt Lake', 'dropoff' => 'Park Street', 'fare' => 95, 'distance' => '6.2 km']
        ];
        
        // Mock recent rides data
        $recentRides = [
            ['id' => 3, 'passenger' => 'Raj Kumar', 'pickup' => 'Esplanade', 'dropoff' => 'Garia', 'status' => 'completed', 'fare' => 150, 'date' => '2025-08-22'],
            ['id' => 4, 'passenger' => 'Sneha Roy', 'pickup' => 'Howrah', 'dropoff' => 'Sealdah', 'status' => 'completed', 'fare' => 110, 'date' => '2025-08-21'],
            ['id' => 5, 'passenger' => 'Arjun Das', 'pickup' => 'Park Street', 'dropoff' => 'New Market', 'status' => 'completed', 'fare' => 80, 'date' => '2025-08-21']
        ];
        
        return view('driver.dashboard', compact('stats', 'driver', 'pendingRides', 'recentRides'));
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
        
        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'status' => $request->status === 'online' ? 'online' : 'offline'
        ]);
    }
    
    public function updateLocation(Request $request)
    {
        $user = Auth::user();
        
        // In a real app, you would update the driver's location in the database
        // For demo purposes, we'll just return a success response
        
        return response()->json([
            'success' => true,
            'message' => 'Location updated successfully',
            'latitude' => $request->latitude,
            'longitude' => $request->longitude
        ]);
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
}