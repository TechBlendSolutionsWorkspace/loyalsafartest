<?php

namespace App\Services;

use App\Models\Ride;
use App\Models\RideSession;
use App\Models\RideShare;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

class RideTrackingService
{
    /**
     * Start ride tracking after OTP verification
     * Implements Tab 2 tracking workflow from PDF
     */
    public function startTracking(Ride $ride): string
    {
        if (!$ride->otp_verified_at) {
            throw new Exception("OTP must be verified before starting tracking");
        }

        return DB::transaction(function () use ($ride) {
            // Generate secure tracking token
            $token = $this->generateTrackingToken($ride);

            // Create ride session
            $session = RideSession::create([
                'ride_id' => $ride->id,
                'token' => $token,
                'start_time' => now(),
                'active' => true,
                'expires_at' => now()->addHours(2) // Auto-expire after 2 hours
            ]);

            // Update ride status
            $ride->update(['ride_status' => 'started']);

            return $token;
        });
    }

    /**
     * Update driver's current location during ride
     */
    public function updateLocation(string $token, float $latitude, float $longitude, ?string $eta = null): void
    {
        $session = RideSession::where('token', $token)
            ->where('active', true)
            ->first();

        if (!$session) {
            throw new Exception("Invalid or expired tracking session");
        }

        $session->update([
            'current_latitude' => $latitude,
            'current_longitude' => $longitude,
            'eta' => $eta,
            'current_location' => json_encode([
                'lat' => $latitude,
                'lng' => $longitude,
                'timestamp' => now()->toISOString()
            ])
        ]);
    }

    /**
     * Share ride tracking with emergency contacts
     * Implements sharing workflow from PDF
     */
    public function shareRide(Ride $ride, string $contactInfo, string $shareMethod = 'whatsapp'): array
    {
        $session = $this->getActiveSession($ride);
        
        if (!$session) {
            throw new Exception("No active tracking session found for this ride");
        }

        $shareRecord = RideShare::create([
            'ride_id' => $ride->id,
            'shared_with' => $contactInfo,
            'share_method' => $shareMethod,
            'share_time' => now(),
            'status' => 'sent'
        ]);

        $shareUrl = $this->generateShareUrl($session->token);

        return [
            'share_id' => $shareRecord->id,
            'share_url' => $shareUrl,
            'message' => $this->generateShareMessage($ride, $shareUrl),
            'share_method' => $shareMethod
        ];
    }

    /**
     * Get current ride status for tracking page
     */
    public function getRideStatus(string $token, ?string $viewerIp = null): array
    {
        $session = RideSession::where('token', $token)->first();

        if (!$session) {
            throw new Exception("Invalid tracking token");
        }

        if (!$session->active || $session->expires_at < now()) {
            return [
                'status' => 'expired',
                'message' => 'This ride tracking has expired'
            ];
        }

        $ride = $session->ride;

        // Mark as viewed if viewer IP provided
        if ($viewerIp) {
            $this->markTrackingViewed($ride, $viewerIp);
        }

        return [
            'status' => 'active',
            'ride' => [
                'pickup_location' => $ride->pickup_location,
                'destination' => $ride->destination,
                'ride_status' => $ride->ride_status,
                'driver_name' => $this->maskDriverName($ride->driver->name ?? 'Driver'),
                'vehicle_number' => $this->maskVehicleNumber($ride->vehicle_number ?? 'Unknown'),
                'estimated_arrival' => $session->eta,
                'current_location' => json_decode($session->current_location),
                'distance_remaining' => $session->distance_remaining
            ],
            'session' => [
                'start_time' => $session->start_time,
                'expires_at' => $session->expires_at
            ]
        ];
    }

    /**
     * End ride tracking session
     */
    public function endTracking(Ride $ride): void
    {
        $session = $this->getActiveSession($ride);

        if ($session) {
            $session->update([
                'end_time' => now(),
                'active' => false
            ]);

            // Mark all shares as expired
            RideShare::where('ride_id', $ride->id)
                ->where('status', '!=', 'expired')
                ->update(['status' => 'expired']);
        }
    }

    /**
     * Generate secure tracking token
     */
    private function generateTrackingToken(Ride $ride): string
    {
        $payload = [
            'ride_id' => $ride->id,
            'timestamp' => now()->timestamp,
            'random' => Str::random(16)
        ];

        return hash('sha256', json_encode($payload));
    }

    /**
     * Get active tracking session for ride
     */
    private function getActiveSession(Ride $ride): ?RideSession
    {
        return RideSession::where('ride_id', $ride->id)
            ->where('active', true)
            ->where('expires_at', '>', now())
            ->first();
    }

    /**
     * Generate shareable URL for tracking
     */
    private function generateShareUrl(string $token): string
    {
        $baseUrl = config('app.url');
        return "{$baseUrl}/track/{$token}";
    }

    /**
     * Generate share message for WhatsApp/SMS
     */
    private function generateShareMessage(Ride $ride, string $shareUrl): string
    {
        return "🚖 *Loyal Safar - Live Ride Tracking*\n\n" .
               "📍 From: {$ride->pickup_location}\n" .
               "📍 To: {$ride->destination}\n" .
               "🕐 Started: " . now()->format('h:i A') . "\n\n" .
               "Track live location: {$shareUrl}\n\n" .
               "Stay safe! 🛡️";
    }

    /**
     * Mark tracking as viewed by someone
     */
    private function markTrackingViewed(Ride $ride, string $viewerIp): void
    {
        RideShare::where('ride_id', $ride->id)
            ->where('status', 'sent')
            ->update([
                'status' => 'viewed',
                'viewed_at' => now(),
                'viewer_ip' => $viewerIp
            ]);
    }

    /**
     * Mask driver name for privacy (only show first name + initial)
     */
    private function maskDriverName(string $fullName): string
    {
        $parts = explode(' ', $fullName);
        if (count($parts) > 1) {
            return $parts[0] . ' ' . substr($parts[1], 0, 1) . '.';
        }
        return $parts[0];
    }

    /**
     * Mask vehicle number for privacy
     */
    private function maskVehicleNumber(string $vehicleNumber): string
    {
        if (strlen($vehicleNumber) > 4) {
            $visible = substr($vehicleNumber, -4);
            $masked = str_repeat('*', strlen($vehicleNumber) - 4);
            return $masked . $visible;
        }
        return $vehicleNumber;
    }

    /**
     * Auto-expire old sessions (run via cron)
     */
    public function cleanupExpiredSessions(): int
    {
        $expired = RideSession::where('active', true)
            ->where('expires_at', '<', now())
            ->update(['active' => false]);

        // Also expire related shares
        RideShare::where('status', '!=', 'expired')
            ->whereHas('ride', function ($query) {
                $query->where('ride_status', 'completed');
            })
            ->where('created_at', '<', now()->subHour())
            ->update(['status' => 'expired']);

        return $expired;
    }
}