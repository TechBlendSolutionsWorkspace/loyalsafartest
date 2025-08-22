<?php

namespace App\Http\Controllers\Passenger;

use App\Http\Controllers\Controller;
use App\Models\Ride;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RideController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $rides = $user->passengerRides()
            ->with(['driver', 'payment'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return view('passenger.rides.index', compact('rides'));
    }
    
    public function show(Ride $ride)
    {
        $user = Auth::user();
        
        if ($ride->passenger_id !== $user->id) {
            abort(403, 'Unauthorized access to this ride.');
        }
        
        $ride->load(['driver', 'payment', 'ratings']);
        
        return view('passenger.rides.show', compact('ride'));
    }
    
    public function cancel(Request $request, Ride $ride)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);
        
        $user = Auth::user();
        
        if ($ride->passenger_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        if (!$ride->canBeCancelled()) {
            return response()->json(['error' => 'Ride cannot be cancelled'], 400);
        }
        
        $ride->cancel($request->reason, 'passenger');
        
        return response()->json([
            'success' => true,
            'message' => 'Ride cancelled successfully'
        ]);
    }
    
    public function rate(Request $request, Ride $ride)
    {
        $request->validate([
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:500',
        ]);
        
        $user = Auth::user();
        
        if ($ride->passenger_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        if ($ride->status !== 'completed') {
            return response()->json(['error' => 'Can only rate completed rides'], 400);
        }
        
        // Check if already rated
        $existingRating = Rating::where('ride_id', $ride->id)
            ->where('rater_id', $user->id)
            ->first();
        
        if ($existingRating) {
            return response()->json(['error' => 'You have already rated this ride'], 400);
        }
        
        // Create rating
        Rating::create([
            'ride_id' => $ride->id,
            'rater_id' => $user->id,
            'rated_id' => $ride->driver_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);
        
        // Update driver's average rating
        $driver = $ride->driver;
        $averageRating = $driver->ratingsReceived()->avg('rating');
        $driver->update(['rating' => round($averageRating, 2)]);
        
        return response()->json([
            'success' => true,
            'message' => 'Rating submitted successfully'
        ]);
    }
}