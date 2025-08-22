<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CouponRedemption extends Model
{
    protected $fillable = [
        'user_id',
        'ride_id',
        'coupon_code',
        'discount_amount',
        'covered_by',
        'original_fare',
        'final_fare',
        'status'
    ];

    protected $casts = [
        'discount_amount' => 'decimal:2',
        'original_fare' => 'decimal:2',
        'final_fare' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ride()
    {
        return $this->belongsTo(Ride::class);
    }
}