<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ride;
use App\Models\RideSession;
use App\Services\RideTrackingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Exception;

class RideTrackingController extends Controller
{
    protected RideTrackingService $trackingService;

    public function __construct(RideTrackingService $trackingService)
    {
        $this->trackingService = $trackingService;
    }

    /**
     * Start tracking after OTP verification
     */
    public function startTracking(string $rideId): JsonResponse
    {
        $ride = Ride::find($rideId);

        if (!$ride) {
            return response()->json([
                'success' => false,
                'message' => 'Ride not found'
            ], 404);
        }

        if (!$ride->otp_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'OTP must be verified before starting tracking'
            ], 400);
        }

        try {
            $token = $this->trackingService->startTracking($ride);

            return response()->json([
                'success' => true,
                'message' => 'Tracking started successfully',
                'data' => [
                    'tracking_token' => $token,
                    'tracking_url' => config('app.url') . "/track/{$token}",
                    'expires_at' => now()->addHours(2)->toISOString()
                ]
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to start tracking: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update driver's current location
     */
    public function updateLocation(Request $request, string $token): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'eta' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid location data',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $this->trackingService->updateLocation(
                $token,
                $request->latitude,
                $request->longitude,
                $request->eta
            );

            return response()->json([
                'success' => true,
                'message' => 'Location updated successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update location: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Share ride tracking with emergency contacts
     */
    public function shareRide(Request $request, string $rideId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'contact_info' => 'required|string',
            'share_method' => 'required|in:whatsapp,sms,email,copy_link'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid sharing data',
                'errors' => $validator->errors()
            ], 422);
        }

        $ride = Ride::find($rideId);

        if (!$ride) {
            return response()->json([
                'success' => false,
                'message' => 'Ride not found'
            ], 404);
        }

        try {
            $shareData = $this->trackingService->shareRide(
                $ride,
                $request->contact_info,
                $request->share_method
            );

            return response()->json([
                'success' => true,
                'message' => 'Ride shared successfully',
                'data' => $shareData
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to share ride: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get ride tracking status (public endpoint for share recipients)
     */
    public function getTrackingStatus(string $token, Request $request): JsonResponse
    {
        try {
            $viewerIp = $request->ip();
            $status = $this->trackingService->getRideStatus($token, $viewerIp);

            return response()->json([
                'success' => true,
                'data' => $status
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * End ride tracking
     */
    public function endTracking(string $rideId): JsonResponse
    {
        $ride = Ride::find($rideId);

        if (!$ride) {
            return response()->json([
                'success' => false,
                'message' => 'Ride not found'
            ], 404);
        }

        try {
            $this->trackingService->endTracking($ride);

            return response()->json([
                'success' => true,
                'message' => 'Tracking ended successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to end tracking: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get active tracking sessions for a ride
     */
    public function getActiveSessions(string $rideId): JsonResponse
    {
        $ride = Ride::find($rideId);

        if (!$ride) {
            return response()->json([
                'success' => false,
                'message' => 'Ride not found'
            ], 404);
        }

        $sessions = RideSession::where('ride_id', $rideId)
            ->where('active', true)
            ->where('expires_at', '>', now())
            ->with('ride')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $sessions
        ]);
    }

    /**
     * Get sharing history for a ride
     */
    public function getSharingHistory(string $rideId): JsonResponse
    {
        $ride = Ride::with(['shares'])->find($rideId);

        if (!$ride) {
            return response()->json([
                'success' => false,
                'message' => 'Ride not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'ride_id' => $ride->id,
                'shares' => $ride->shares
            ]
        ]);
    }

    /**
     * Cleanup expired tracking sessions (for cron job)
     */
    public function cleanupExpired(): JsonResponse
    {
        try {
            $cleaned = $this->trackingService->cleanupExpiredSessions();

            return response()->json([
                'success' => true,
                'message' => "Cleaned up {$cleaned} expired sessions",
                'data' => ['cleaned_count' => $cleaned]
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cleanup sessions: ' . $e->getMessage()
            ], 500);
        }
    }
}
