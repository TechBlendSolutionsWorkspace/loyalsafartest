<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DriverEarning extends Model
{
    use HasFactory;

    protected $fillable = [
        'driver_id',
        'ride_id',
        'fare_amount',
        'commission',
        'driver_earnings',
        'earning_date',
    ];

    protected $casts = [
        'fare_amount' => 'decimal:2',
        'commission' => 'decimal:2',
        'driver_earnings' => 'decimal:2',
        'earning_date' => 'date',
    ];

    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function ride(): BelongsTo
    {
        return $this->belongsTo(Ride::class);
    }
}