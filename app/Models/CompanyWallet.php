<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyWallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'ride_id',
        'driver_id',
        'amount',
        'transaction_type',
        'reason',
        'source',
        'reference_id',
        'metadata'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'metadata' => 'array'
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