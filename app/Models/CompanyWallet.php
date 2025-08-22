<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyWallet extends Model
{
    protected $fillable = [
        'ride_id',
        'driver_id',
        'amount',
        'transaction_type',
        'reason'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function ride()
    {
        return $this->belongsTo(Ride::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}