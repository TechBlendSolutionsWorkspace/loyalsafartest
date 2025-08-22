<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RideSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'ride_id',
        'token',
        'start_time',
        'end_time',
        'active',
        'current_location',
        'current_latitude',
        'current_longitude',
        'eta',
        'distance_remaining',
        'expires_at',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'expires_at' => 'datetime',
        'active' => 'boolean',
        'current_location' => 'array',
        'current_latitude' => 'decimal:8',
        'current_longitude' => 'decimal:8',
        'distance_remaining' => 'decimal:2',
    ];

    public function ride(): BelongsTo
    {
        return $this->belongsTo(Ride::class);
    }
}
