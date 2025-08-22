<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Driver extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'license_number',
        'license_image',
        'status',
        'current_latitude',
        'current_longitude',
        'total_earnings',
        'total_rides',
        'is_approved',
        'approved_at',
    ];

    protected $casts = [
        'current_latitude' => 'decimal:8',
        'current_longitude' => 'decimal:8',
        'total_earnings' => 'decimal:2',
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle(): HasOne
    {
        return $this->hasOne(Vehicle::class);
    }

    public function rides(): HasMany
    {
        return $this->hasMany(Ride::class, 'driver_id', 'user_id');
    }

    public function earnings(): HasMany
    {
        return $this->hasMany(DriverEarning::class, 'driver_id', 'user_id');
    }

    public function rideRequests(): HasMany
    {
        return $this->hasMany(RideRequest::class, 'driver_id', 'user_id');
    }

    public function isOnline(): bool
    {
        return $this->status === 'online';
    }

    public function isBusy(): bool
    {
        return $this->status === 'busy';
    }

    public function updateLocation(float $latitude, float $longitude): void
    {
        $this->update([
            'current_latitude' => $latitude,
            'current_longitude' => $longitude,
        ]);
    }

    public function setOnline(): void
    {
        $this->update(['status' => 'online']);
    }

    public function setOffline(): void
    {
        $this->update(['status' => 'offline']);
    }

    public function setBusy(): void
    {
        $this->update(['status' => 'busy']);
    }
}