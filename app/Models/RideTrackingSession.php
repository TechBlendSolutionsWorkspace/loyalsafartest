<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RideTrackingSession extends Model
{
    protected $fillable = [
        'session_id',
        'ride_id',
        'jwt_token',
        'token_expires_at',
        'status',
        'viewer_logs',
        'view_count',
        'last_accessed_at',
        'share_methods',
        'last_known_location',
        'location_updated_at',
        'metadata'
    ];

    protected $casts = [
        'token_expires_at' => 'datetime',
        'last_accessed_at' => 'datetime',
        'location_updated_at' => 'datetime',
        'viewer_logs' => 'array',
        'share_methods' => 'array',
        'metadata' => 'array'
    ];

    /**
     * Get the ride this session belongs to
     */
    public function ride(): BelongsTo
    {
        return $this->belongsTo(Ride::class);
    }

    /**
     * Check if the session is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && $this->token_expires_at > now();
    }

    /**
     * Check if the session has expired
     */
    public function isExpired(): bool
    {
        return $this->token_expires_at <= now() || $this->status === 'expired';
    }

    /**
     * Mark session as accessed
     */
    public function markAccessed($viewerInfo = null): void
    {
        $this->increment('view_count');
        $this->update(['last_accessed_at' => now()]);
        
        if ($viewerInfo) {
            $logs = $this->viewer_logs ?? [];
            $logs[] = array_merge($viewerInfo, ['accessed_at' => now()->toISOString()]);
            $this->update(['viewer_logs' => $logs]);
        }
    }

    /**
     * Update driver location
     */
    public function updateLocation($coordinates): void
    {
        $this->update([
            'last_known_location' => $coordinates,
            'location_updated_at' => now()
        ]);
    }

    /**
     * End the tracking session
     */
    public function endSession(): void
    {
        $this->update(['status' => 'ended']);
    }
}
