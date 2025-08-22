<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Ride extends Model
{
    use HasFactory;

    protected $fillable = [
        'ride_id',
        'passenger_id',
        'driver_id',
        'area_id',
        'pickup_address',
        'pickup_latitude',
        'pickup_longitude',
        'destination_address',
        'destination_latitude',
        'destination_longitude',
        'estimated_fare',
        'actual_fare',
        'total_fare',
        'final_fare',
        'distance',
        'estimated_distance',
        'actual_distance',
        'estimated_duration',
        'actual_duration',
        'status',
        'ride_status',
        'requested_at',
        'accepted_at',
        'pickup_time',
        'completed_at',
        'cancellation_reason',
        'coupon_code',
        'coupon_discount',
        'commission_amount',
        'commission_type',
        'driver_payout',
        'payment_status',
        'share_token',
        'otp',
        'otp_verified_at',
        'tracking_session_id',
        'tracking_started_at',
        'tracking_ended_at',
        'share_count',
        'shared_via',
        'tracking_viewers',
        'route_coordinates'
    ];

    protected $casts = [
        'pickup_latitude' => 'decimal:8',
        'pickup_longitude' => 'decimal:8',
        'destination_latitude' => 'decimal:8',
        'destination_longitude' => 'decimal:8',
        'estimated_fare' => 'decimal:2',
        'actual_fare' => 'decimal:2',
        'total_fare' => 'decimal:2',
        'final_fare' => 'decimal:2',
        'distance' => 'decimal:2',
        'estimated_distance' => 'decimal:2',
        'actual_distance' => 'decimal:2',
        'coupon_discount' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'driver_payout' => 'decimal:2',
        'requested_at' => 'datetime',
        'accepted_at' => 'datetime',
        'pickup_time' => 'datetime',
        'completed_at' => 'datetime',
        'otp_verified_at' => 'datetime',
        'tracking_started_at' => 'datetime',
        'tracking_ended_at' => 'datetime',
        'shared_via' => 'array',
        'tracking_viewers' => 'array',
        'route_coordinates' => 'array'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($ride) {
            $ride->ride_id = 'RIDE' . strtoupper(Str::random(8));
        });
    }

    public function passenger(): BelongsTo
    {
        return $this->belongsTo(User::class, 'passenger_id');
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    public function rideRequests(): HasMany
    {
        return $this->hasMany(RideRequest::class);
    }

    public function driverEarning(): HasOne
    {
        return $this->hasOne(DriverEarning::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class, 'coupon_code', 'code');
    }

    public function driverWalletTransactions(): HasMany
    {
        return $this->hasMany(DriverWallet::class);
    }

    public function companyWalletTransactions(): HasMany
    {
        return $this->hasMany(CompanyWallet::class);
    }

    public function couponRedemption(): HasOne
    {
        return $this->hasOne(CouponRedemption::class);
    }

    public function trackingSession(): HasOne
    {
        return $this->hasOne(RideTrackingSession::class);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isAccepted(): bool
    {
        return $this->status === 'accepted';
    }

    public function isInProgress(): bool
    {
        return $this->status === 'in_progress';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isCancelled(): bool
    {
        return in_array($this->status, ['cancelled_by_passenger', 'cancelled_by_driver']);
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending', 'accepted', 'driver_arriving']);
    }

    public function accept(int $driverId): void
    {
        $this->update([
            'driver_id' => $driverId,
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);
    }

    public function startRide(): void
    {
        $this->update([
            'status' => 'in_progress',
            'pickup_time' => now(),
        ]);
    }

    public function complete(float $actualFare, int $actualDuration): void
    {
        $this->update([
            'status' => 'completed',
            'actual_fare' => $actualFare,
            'actual_duration' => $actualDuration,
            'completed_at' => now(),
        ]);
    }

    public function cancel(string $reason, string $cancelledBy): void
    {
        $status = $cancelledBy === 'passenger' ? 'cancelled_by_passenger' : 'cancelled_by_driver';
        
        $this->update([
            'status' => $status,
            'cancellation_reason' => $reason,
        ]);
    }
}