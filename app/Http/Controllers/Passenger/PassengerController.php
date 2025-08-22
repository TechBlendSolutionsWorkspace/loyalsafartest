<?php

namespace App\Http\Controllers\Passenger;

use App\Http\Controllers\Controller;
use App\Models\Ride;
use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PassengerController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        
        // Get dashboard statistics
        $stats = [
            'total_rides' => $user->passengerRides->count(),
            'completed_rides' => $user->passengerRides()->where('status', 'completed')->count(),
            'cancelled_rides' => $user->passengerRides()->where('status', 'like', 'cancelled_%')->count(),
            'total_spent' => $user->passengerRides()->where('status', 'completed')->sum('actual_fare'),
        ];
        
        // Get recent rides
        $recentRides = $user->passengerRides()
            ->with(['driver', 'payment'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        // Get current active ride
        $activeRide = $user->passengerRides()
            ->whereIn('status', ['pending', 'accepted', 'driver_arriving', 'driver_arrived', 'in_progress'])
            ->with(['driver'])
            ->first();
        
        return view('passenger.dashboard', compact('stats', 'recentRides', 'activeRide'));
    }
    
    public function bookRide()
    {
        return view('passenger.book-ride');
    }
    
    public function storeRide(Request $request)
    {
        $request->validate([
            'pickup_address' => 'required|string|max:255',
            'pickup_latitude' => 'required|numeric|between:-90,90',
            'pickup_longitude' => 'required|numeric|between:-180,180',
            'destination_address' => 'required|string|max:255',
            'destination_latitude' => 'required|numeric|between:-90,90',
            'destination_longitude' => 'required|numeric|between:-180,180',
        ]);
        
        $user = Auth::user();
        
        // Check if user has any active rides
        $activeRide = $user->passengerRides()
            ->whereIn('status', ['pending', 'accepted', 'driver_arriving', 'driver_arrived', 'in_progress'])
            ->first();
        
        if ($activeRide) {
            return redirect()->route('passenger.rides.show', $activeRide)
                ->with('error', 'You already have an active ride');
        }
        
        // Calculate estimated fare and duration
        $distance = $this->calculateDistance(
            $request->pickup_latitude, 
            $request->pickup_longitude,
            $request->destination_latitude, 
            $request->destination_longitude
        );
        
        $estimatedFare = $this->calculateFare($distance);
        $estimatedDuration = $this->calculateDuration($distance);
        
        // Create ride
        $ride = Ride::create([
            'passenger_id' => $user->id,
            'pickup_address' => $request->pickup_address,
            'pickup_latitude' => $request->pickup_latitude,
            'pickup_longitude' => $request->pickup_longitude,
            'destination_address' => $request->destination_address,
            'destination_latitude' => $request->destination_latitude,
            'destination_longitude' => $request->destination_longitude,
            'estimated_fare' => $estimatedFare,
            'distance' => $distance,
            'estimated_duration' => $estimatedDuration,
            'requested_at' => now(),
        ]);
        
        return redirect()->route('passenger.rides.show', $ride)
            ->with('success', 'Ride requested successfully! Looking for drivers...');
    }
    
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        // Haversine formula to calculate distance between two points
        $earthRadius = 6371; // Earth radius in kilometers
        
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        
        $a = sin($dLat/2) * sin($dLat/2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon/2) * sin($dLon/2);
        
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        $distance = $earthRadius * $c;
        
        return round($distance, 2);
    }
    
    private function calculateFare($distance)
    {
        // Base fare + distance-based fare
        $baseFare = 50; // ₹50 base fare
        $perKmRate = 15; // ₹15 per km
        
        return $baseFare + ($distance * $perKmRate);
    }
    
    private function calculateDuration($distance)
    {
        // Estimate 30 km/h average speed in city traffic
        $averageSpeed = 30; // km/h
        $duration = ($distance / $averageSpeed) * 60; // Convert to minutes
        
        return round($duration);
    }
}
