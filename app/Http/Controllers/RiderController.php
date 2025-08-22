<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RiderController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        
        // Basic stats for the rider
        $stats = [
            'total_rides' => 0,
            'total_spent' => 0,
            'favorite_driver' => 'None',
            'coupon_savings' => 0
        ];
        
        return view('rider.dashboard', compact('stats'));
    }
    
    public function bookRide()
    {
        return view('rider.book-ride');
    }
    
    public function calculateFare(Request $request)
    {
        $request->validate([
            'pickup_location' => 'required|string',
            'dropoff_location' => 'required|string',
            'ride_type' => 'required|string|in:economy,premium,shared,green'
        ]);
        
        // Simulate fare calculation
        $distance = rand(5, 25); // Random distance between 5-25 km
        $time = $distance * 2.5; // Approximate time
        
        $rates = [
            'economy' => 15,
            'premium' => 25,
            'shared' => 8,
            'green' => 12
        ];
        
        $ratePerKm = $rates[$request->ride_type] ?? 15;
        $baseFare = 30;
        $totalFare = $baseFare + ($distance * $ratePerKm);
        
        return response()->json([
            'success' => true,
            'distance' => $distance,
            'time' => round($time),
            'fare' => $totalFare,
            'base_fare' => $baseFare,
            'rate_per_km' => $ratePerKm
        ]);
    }
    
    public function storeRide(Request $request)
    {
        $request->validate([
            'pickup_location' => 'required|string',
            'dropoff_location' => 'required|string',
            'ride_type' => 'required|string'
        ]);
        
        // In a real app, this would create a ride request and find drivers
        return redirect()->route('rider.dashboard')->with('success', 'Looking for available drivers in your area...');
    }
    
    public function rideStatus($rideId)
    {
        // Mock ride status
        return response()->json([
            'status' => 'searching',
            'message' => 'Looking for nearby drivers...'
        ]);
    }
    
    public function trackRide($rideId)
    {
        return view('rider.track-ride', compact('rideId'));
    }
    
    public function shareRide(Request $request, $rideId)
    {
        // Mock ride sharing functionality
        return response()->json([
            'success' => true,
            'message' => 'Ride shared successfully with your contacts'
        ]);
    }
    
    public function verifyOtp(Request $request, $rideId)
    {
        $request->validate([
            'otp' => 'required|digits:4'
        ]);
        
        // Mock OTP verification
        return response()->json([
            'success' => true,
            'message' => 'OTP verified. Your ride has started!'
        ]);
    }
    
    public function emergencyAlert(Request $request, $rideId)
    {
        // Mock emergency alert functionality
        return response()->json([
            'success' => true,
            'message' => 'Emergency alert sent to your contacts and local authorities'
        ]);
    }
}