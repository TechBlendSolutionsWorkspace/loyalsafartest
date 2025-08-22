<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RideShare extends Model
{
    use HasFactory;

    protected $fillable = [
        'ride_id',
        'shared_with',
        'share_method',
        'share_time',
        'status',
        'viewed_at',
        'viewer_ip',
    ];

    protected $casts = [
        'share_time' => 'datetime',
        'viewed_at' => 'datetime',
    ];

    public function ride(): BelongsTo
    {
        return $this->belongsTo(Ride::class);
    }

    /**
     * Mark the share as viewed
     */
    public function markAsViewed(string $ipAddress = null): void
    {
        $this->update([
            'status' => 'viewed',
            'viewed_at' => now(),
            'viewer_ip' => $ipAddress,
        ]);
    }

    /**
     * Check if share has expired
     */
    public function hasExpired(): bool
    {
        return $this->status === 'expired' || 
               $this->ride->ride_status === 'completed' && 
               $this->created_at->addHours(1)->isPast();
    }

    /**
     * Auto-expire share if ride is completed and time limit passed
     */
    public function autoExpireIfNeeded(): void
    {
        if ($this->hasExpired() && $this->status !== 'expired') {
            $this->update(['status' => 'expired']);
        }
    }
}
