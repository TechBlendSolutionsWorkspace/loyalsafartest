<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Ride;
use App\Models\CommissionSlab;
use App\Models\CouponRedemption;
use App\Models\DriverWallet;
use App\Models\CompanyWallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class RiderController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        $recentRides = Ride::where('passenger_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
            
        return view('rider.dashboard', compact('recentRides'));
    }

    public function bookRide()
    {
        $areas = Area::where('is_active', true)->get();
        return view('rider.book-ride', compact('areas'));
    }

    public function calculateFare(Request $request)
    {
        $request->validate([
            'pickup_lat' => 'required|numeric',
            'pickup_lng' => 'required|numeric', 
            'drop_lat' => 'required|numeric',
            'drop_lng' => 'required|numeric',
            'area_id' => 'required|exists:areas,id'
        ]);

        $area = Area::find($request->area_id);
        
        // Calculate distance using haversine formula
        $distance = $this->calculateDistance(
            $request->pickup_lat, $request->pickup_lng,
            $request->drop_lat, $request->drop_lng
        );

        $baseFare = $area->base_fare;
        $perKmRate = $area->per_km_rate;
        $totalFare = $baseFare + ($distance * $perKmRate);

        return response()->json([
            'distance' => round($distance, 2),
            'base_fare' => $baseFare,
            'per_km_rate' => $perKmRate,
            'total_fare' => round($totalFare, 2)
        ]);
    }

    public function storeRide(Request $request)
    {
        $request->validate([
            'pickup_address' => 'required|string',
            'pickup_lat' => 'required|numeric',
            'pickup_lng' => 'required|numeric',
            'drop_address' => 'required|string',
            'drop_lat' => 'required|numeric',
            'drop_lng' => 'required|numeric',
            'area_id' => 'required|exists:areas,id',
            'total_fare' => 'required|numeric',
            'coupon_code' => 'nullable|string'
        ]);

        $area = Area::find($request->area_id);
        $distance = $this->calculateDistance(
            $request->pickup_lat, $request->pickup_lng,
            $request->drop_lat, $request->drop_lng
        );

        $totalFare = $request->total_fare;
        $couponDiscount = 0;
        $finalFare = $totalFare;

        // Apply coupon if provided
        if ($request->coupon_code) {
            $couponDiscount = $this->applyCoupon($request->coupon_code, $totalFare);
            $finalFare = $totalFare - $couponDiscount;
        }

        // Create ride
        $ride = Ride::create([
            'passenger_id' => Auth::id(),
            'area_id' => $request->area_id,
            'pickup_address' => $request->pickup_address,
            'pickup_latitude' => $request->pickup_lat,
            'pickup_longitude' => $request->pickup_lng,
            'destination_address' => $request->drop_address,
            'destination_latitude' => $request->drop_lat,
            'destination_longitude' => $request->drop_lng,
            'distance' => $distance,
            'total_fare' => $totalFare,
            'coupon_code' => $request->coupon_code,
            'coupon_discount' => $couponDiscount,
            'final_fare' => $finalFare,
            'status' => 'pending',
            'requested_at' => now()
        ]);

        // Generate OTP for ride verification
        $otp = rand(1000, 9999);
        session(['ride_otp_' . $ride->id => $otp]);

        return redirect()->route('rider.ride-status', $ride->id)
            ->with('success', 'Ride booked successfully! OTP: ' . $otp);
    }

    public function rideStatus($rideId)
    {
        $ride = Ride::with(['driver', 'area'])->findOrFail($rideId);
        
        if ($ride->passenger_id !== Auth::id()) {
            abort(403);
        }

        return view('rider.ride-status', compact('ride'));
    }

    public function verifyOtp(Request $request, $rideId)
    {
        $request->validate([
            'otp' => 'required|digits:4'
        ]);

        $ride = Ride::findOrFail($rideId);
        $sessionOtp = session('ride_otp_' . $rideId);

        if ($request->otp != $sessionOtp) {
            return back()->withErrors(['otp' => 'Invalid OTP']);
        }

        $ride->update(['status' => 'otp_verified']);
        session()->forget('ride_otp_' . $rideId);

        return redirect()->route('rider.track-ride', $rideId)
            ->with('success', 'OTP verified! Your ride will start soon.');
    }

    public function trackRide($rideId)
    {
        $ride = Ride::with(['driver', 'area'])->findOrFail($rideId);
        
        if ($ride->passenger_id !== Auth::id()) {
            abort(403);
        }

        // Generate share token if not exists
        if (!$ride->share_token) {
            $ride->update(['share_token' => Str::random(32)]);
        }

        return view('rider.track-ride', compact('ride'));
    }

    public function shareRide($rideId)
    {
        $ride = Ride::findOrFail($rideId);
        
        if ($ride->passenger_id !== Auth::id()) {
            abort(403);
        }

        $shareUrl = route('public.track-ride', ['token' => $ride->share_token]);
        
        return response()->json([
            'share_url' => $shareUrl,
            'message' => 'Share this link with your contacts to let them track your ride.'
        ]);
    }

    public function emergencyAlert(Request $request, $rideId)
    {
        $ride = Ride::findOrFail($rideId);
        
        if ($ride->passenger_id !== Auth::id()) {
            abort(403);
        }

        // Here you would integrate with SMS/WhatsApp API
        // For now, we'll simulate the alert
        $emergencyContacts = $request->input('contacts', []);
        
        // Simulate SMS sending
        foreach ($emergencyContacts as $contact) {
            // This would be replaced with actual SMS API call
            \Log::info("Emergency alert sent to: " . $contact . " for ride: " . $ride->ride_id);
        }

        return response()->json(['message' => 'Emergency alerts sent successfully!']);
    }

    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // Earth's radius in kilometers

        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($lonDelta / 2) * sin($lonDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        
        return $earthRadius * $c;
    }

    private function applyCoupon($couponCode, $totalFare)
    {
        // Simple coupon logic - in real app this would be more sophisticated
        $coupons = [
            'FIRST50' => ['type' => 'fixed', 'value' => 50],
            'LOYAL20' => ['type' => 'percentage', 'value' => 20],
            'GREEN15' => ['type' => 'fixed', 'value' => 15]
        ];

        if (!isset($coupons[$couponCode])) {
            return 0;
        }

        $coupon = $coupons[$couponCode];
        
        if ($coupon['type'] === 'fixed') {
            return min($coupon['value'], $totalFare);
        } else {
            return ($totalFare * $coupon['value']) / 100;
        }
    }
}