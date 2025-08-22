<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Ride;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DriverController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        $driver = $user->driver;
        
        if (!$driver) {
            return redirect()->route('driver.profile')->with('warning', 'Please complete your driver profile first.');
        }
        
        // Get dashboard statistics
        $stats = [
            'total_rides' => $driver->total_rides,
            'total_earnings' => $driver->total_earnings,
            'rating' => $user->rating,
            'status' => $driver->status,
        ];
        
        // Get recent rides
        $recentRides = Ride::where('driver_id', $user->id)
            ->with(['passenger', 'payment'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        // Get pending ride requests
        $pendingRides = Ride::where('status', 'pending')
            ->whereNull('driver_id')
            ->limit(10)
            ->get();
        
        return view('driver.dashboard', compact('stats', 'recentRides', 'pendingRides', 'driver'));
    }
    
    public function profile()
    {
        $user = Auth::user();
        $driver = $user->driver;
        
        return view('driver.profile', compact('user', 'driver'));
    }
    
    public function toggleStatus(Request $request)
    {
        $user = Auth::user();
        $driver = $user->driver;
        
        if (!$driver) {
            return response()->json(['error' => 'Driver profile not found'], 404);
        }
        
        $newStatus = $driver->status === 'online' ? 'offline' : 'online';
        $driver->update(['status' => $newStatus]);
        
        return response()->json([
            'success' => true,
            'status' => $newStatus,
            'message' => 'Status updated to ' . $newStatus
        ]);
    }
    
    public function updateLocation(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);
        
        $user = Auth::user();
        $driver = $user->driver;
        
        if (!$driver) {
            return response()->json(['error' => 'Driver profile not found'], 404);
        }
        
        $driver->updateLocation($request->latitude, $request->longitude);
        
        return response()->json([
            'success' => true,
            'message' => 'Location updated successfully'
        ]);
    }
    
    public function getNearbyRides(Request $request)
    {
        $user = Auth::user();
        $driver = $user->driver;
        
        if (!$driver || !$driver->isOnline()) {
            return response()->json(['rides' => []]);
        }
        
        // Get rides within 10km radius
        $latitude = $driver->current_latitude;
        $longitude = $driver->current_longitude;
        
        if (!$latitude || !$longitude) {
            return response()->json(['rides' => []]);
        }
        
        $rides = Ride::where('status', 'pending')
            ->whereNull('driver_id')
            ->selectRaw("
                *, 
                (6371 * acos(cos(radians(?)) * cos(radians(pickup_latitude)) * 
                cos(radians(pickup_longitude) - radians(?)) + 
                sin(radians(?)) * sin(radians(pickup_latitude)))) AS distance
            ", [$latitude, $longitude, $latitude])
            ->having('distance', '<', 10)
            ->orderBy('distance')
            ->with(['passenger'])
            ->limit(5)
            ->get();
        
        return response()->json(['rides' => $rides]);
    }
}