<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Ride;
use App\Models\RideRequest;
use App\Models\DriverEarning;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RideController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $rides = Ride::where('driver_id', $user->id)
            ->with(['passenger', 'payment'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return view('driver.rides.index', compact('rides'));
    }
    
    public function show(Ride $ride)
    {
        $user = Auth::user();
        
        if ($ride->driver_id !== $user->id) {
            abort(403, 'Unauthorized access to this ride.');
        }
        
        $ride->load(['passenger', 'payment', 'ratings']);
        
        return view('driver.rides.show', compact('ride'));
    }
    
    public function accept(Request $request, Ride $ride)
    {
        $user = Auth::user();
        $driver = $user->driver;
        
        if (!$driver || !$driver->isOnline()) {
            return response()->json(['error' => 'Driver must be online to accept rides'], 400);
        }
        
        if ($ride->status !== 'pending' || $ride->driver_id !== null) {
            return response()->json(['error' => 'Ride is no longer available'], 400);
        }
        
        // Accept the ride
        $ride->accept($user->id);
        
        // Mark driver as busy
        $driver->setBusy();
        
        // Create/update ride request record
        RideRequest::updateOrCreate(
            ['ride_id' => $ride->id, 'driver_id' => $user->id],
            ['status' => 'accepted', 'responded_at' => now()]
        );
        
        return response()->json([
            'success' => true,
            'message' => 'Ride accepted successfully',
            'ride' => $ride->load(['passenger'])
        ]);
    }
    
    public function decline(Request $request, Ride $ride)
    {
        $user = Auth::user();
        
        RideRequest::updateOrCreate(
            ['ride_id' => $ride->id, 'driver_id' => $user->id],
            ['status' => 'declined', 'responded_at' => now()]
        );
        
        return response()->json([
            'success' => true,
            'message' => 'Ride declined'
        ]);
    }
    
    public function start(Request $request, Ride $ride)
    {
        $user = Auth::user();
        
        if ($ride->driver_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        if ($ride->status !== 'accepted') {
            return response()->json(['error' => 'Ride cannot be started'], 400);
        }
        
        $ride->startRide();
        
        return response()->json([
            'success' => true,
            'message' => 'Ride started successfully',
            'ride' => $ride
        ]);
    }
    
    public function complete(Request $request, Ride $ride)
    {
        $request->validate([
            'actual_fare' => 'required|numeric|min:0',
            'actual_duration' => 'required|integer|min:1',
        ]);
        
        $user = Auth::user();
        $driver = $user->driver;
        
        if ($ride->driver_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        if ($ride->status !== 'in_progress') {
            return response()->json(['error' => 'Ride cannot be completed'], 400);
        }
        
        // Complete the ride
        $ride->complete($request->actual_fare, $request->actual_duration);
        
        // Calculate earnings
        $commission = $request->actual_fare * 0.15; // 15% commission
        $driverEarnings = $request->actual_fare - $commission;
        
        // Record driver earnings
        DriverEarning::create([
            'driver_id' => $user->id,
            'ride_id' => $ride->id,
            'fare_amount' => $request->actual_fare,
            'commission' => $commission,
            'driver_earnings' => $driverEarnings,
            'earning_date' => now()->toDateString(),
        ]);
        
        // Update driver totals
        $driver->increment('total_rides');
        $driver->increment('total_earnings', $driverEarnings);
        
        // Set driver back to online
        $driver->setOnline();
        
        return response()->json([
            'success' => true,
            'message' => 'Ride completed successfully',
            'earnings' => $driverEarnings
        ]);
    }
    
    public function cancel(Request $request, Ride $ride)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);
        
        $user = Auth::user();
        
        if ($ride->driver_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        if (!$ride->canBeCancelled()) {
            return response()->json(['error' => 'Ride cannot be cancelled'], 400);
        }
        
        $ride->cancel($request->reason, 'driver');
        
        // Set driver back to online
        $user->driver->setOnline();
        
        return response()->json([
            'success' => true,
            'message' => 'Ride cancelled successfully'
        ]);
    }
    
    public function getStatus(Ride $ride)
    {
        return response()->json([
            'status' => $ride->status,
            'ride' => $ride->load(['passenger', 'driver'])
        ]);
    }
    
    public function updateRideLocation(Request $request, Ride $ride)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);
        
        $user = Auth::user();
        
        if ($ride->driver_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        // Update driver location
        $user->driver->updateLocation($request->latitude, $request->longitude);
        
        return response()->json([
            'success' => true,
            'message' => 'Location updated successfully'
        ]);
    }
}