<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ride;
use App\Models\Area;
use App\Models\User;
use App\Services\CommissionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Exception;

class RideController extends Controller
{
    protected CommissionService $commissionService;

    public function __construct(CommissionService $commissionService)
    {
        $this->commissionService = $commissionService;
    }

    /**
     * Display a listing of rides
     */
    public function index(Request $request): JsonResponse
    {
        $query = Ride::with(['passenger', 'driver', 'area']);

        // Filter by driver if specified
        if ($request->has('driver_id')) {
            $query->where('driver_id', $request->driver_id);
        }

        // Filter by passenger if specified
        if ($request->has('passenger_id')) {
            $query->where('passenger_id', $request->passenger_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('ride_status', $request->status);
        }

        // Filter by area
        if ($request->has('area_id')) {
            $query->where('area_id', $request->area_id);
        }

        $rides = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $rides
        ]);
    }

    /**
     * Store a newly created ride
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'passenger_id' => 'required|exists:users,id',
            'driver_id' => 'required|exists:users,id',
            'area_id' => 'required|exists:areas,id',
            'pickup_location' => 'required|string',
            'destination' => 'required|string',
            'pickup_latitude' => 'required|numeric',
            'pickup_longitude' => 'required|numeric',
            'destination_latitude' => 'required|numeric',
            'destination_longitude' => 'required|numeric',
            'total_fare' => 'required|numeric|min:0',
            'distance' => 'required|numeric|min:0',
            'coupon_code' => 'nullable|string|exists:coupons,code'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $ride = Ride::create([
                'passenger_id' => $request->passenger_id,
                'driver_id' => $request->driver_id,
                'area_id' => $request->area_id,
                'pickup_location' => $request->pickup_location,
                'destination' => $request->destination,
                'pickup_latitude' => $request->pickup_latitude,
                'pickup_longitude' => $request->pickup_longitude,
                'destination_latitude' => $request->destination_latitude,
                'destination_longitude' => $request->destination_longitude,
                'total_fare' => $request->total_fare,
                'distance' => $request->distance,
                'otp' => rand(1000, 9999),
                'ride_status' => 'pending'
            ]);

            // Process coupon if provided
            if ($request->has('coupon_code') && $request->coupon_code) {
                $this->commissionService->processCouponRide($ride, $request->coupon_code);
            }

            $ride->load(['passenger', 'driver', 'area']);

            return response()->json([
                'success' => true,
                'message' => 'Ride created successfully',
                'data' => $ride
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create ride: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified ride
     */
    public function show(string $id): JsonResponse
    {
        $ride = Ride::with(['passenger', 'driver', 'area', 'session', 'shares', 'couponRedemption'])
            ->find($id);

        if (!$ride) {
            return response()->json([
                'success' => false,
                'message' => 'Ride not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $ride
        ]);
    }

    /**
     * Update ride status
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $ride = Ride::find($id);

        if (!$ride) {
            return response()->json([
                'success' => false,
                'message' => 'Ride not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'ride_status' => 'sometimes|in:pending,accepted,started,completed,cancelled',
            'payment_status' => 'sometimes|in:pending,completed,failed,refunded'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $ride->update($request->only(['ride_status', 'payment_status']));

            return response()->json([
                'success' => true,
                'message' => 'Ride updated successfully',
                'data' => $ride
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update ride: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify OTP and start ride
     */
    public function verifyOtp(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'otp' => 'required|string|size:4'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'OTP is required',
                'errors' => $validator->errors()
            ], 422);
        }

        $ride = Ride::find($id);

        if (!$ride) {
            return response()->json([
                'success' => false,
                'message' => 'Ride not found'
            ], 404);
        }

        if ($ride->otp !== $request->otp) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP'
            ], 400);
        }

        try {
            $ride->update([
                'otp_verified_at' => now(),
                'ride_status' => 'accepted'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'OTP verified successfully. Ride can now be started.',
                'data' => $ride
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify OTP: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Complete ride with commission calculation
     */
    public function complete(string $id): JsonResponse
    {
        $ride = Ride::find($id);

        if (!$ride) {
            return response()->json([
                'success' => false,
                'message' => 'Ride not found'
            ], 404);
        }

        if ($ride->ride_status === 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Ride already completed'
            ], 400);
        }

        try {
            $result = $this->commissionService->completeRide($ride);
            $ride->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Ride completed successfully',
                'data' => [
                    'ride' => $ride,
                    'commission_breakdown' => $result
                ]
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete ride: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate commission preview for a ride
     */
    public function calculateCommission(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'area_id' => 'required|exists:areas,id',
            'total_fare' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Create a temporary ride object for calculation
            $tempRide = new Ride([
                'area_id' => $request->area_id,
                'total_fare' => $request->total_fare
            ]);

            $commissionData = $this->commissionService->calculateCommission($tempRide);

            return response()->json([
                'success' => true,
                'data' => $commissionData
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to calculate commission: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel a ride
     */
    public function cancel(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'cancellation_reason' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Cancellation reason is required',
                'errors' => $validator->errors()
            ], 422);
        }

        $ride = Ride::find($id);

        if (!$ride) {
            return response()->json([
                'success' => false,
                'message' => 'Ride not found'
            ], 404);
        }

        if (in_array($ride->ride_status, ['completed', 'cancelled'])) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel a ' . $ride->ride_status . ' ride'
            ], 400);
        }

        try {
            $ride->update([
                'ride_status' => 'cancelled',
                'cancellation_reason' => $request->cancellation_reason,
                'cancelled_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Ride cancelled successfully',
                'data' => $ride
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel ride: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get ride statistics for dashboard
     */
    public function stats(Request $request): JsonResponse
    {
        $stats = [
            'total_rides' => Ride::count(),
            'completed_rides' => Ride::where('ride_status', 'completed')->count(),
            'active_rides' => Ride::whereIn('ride_status', ['accepted', 'started'])->count(),
            'cancelled_rides' => Ride::where('ride_status', 'cancelled')->count(),
            'total_revenue' => Ride::where('ride_status', 'completed')->sum('total_fare'),
            'total_commission' => Ride::where('ride_status', 'completed')->sum('commission_amount'),
        ];

        if ($request->has('driver_id')) {
            $driverId = $request->driver_id;
            $stats = [
                'total_rides' => Ride::where('driver_id', $driverId)->count(),
                'completed_rides' => Ride::where('driver_id', $driverId)->where('ride_status', 'completed')->count(),
                'active_rides' => Ride::where('driver_id', $driverId)->whereIn('ride_status', ['accepted', 'started'])->count(),
                'cancelled_rides' => Ride::where('driver_id', $driverId)->where('ride_status', 'cancelled')->count(),
                'total_earnings' => Ride::where('driver_id', $driverId)->where('ride_status', 'completed')->sum('driver_payout'),
                'commission_paid' => Ride::where('driver_id', $driverId)->where('ride_status', 'completed')->sum('commission_amount'),
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
