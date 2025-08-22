<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'city',
        'state',
        'active',
        'base_fare',
        'per_km_rate',
        'waiting_charge',
        'night_charges',
        'boundary_coordinates'
    ];

    protected $casts = [
        'boundary_coordinates' => 'array',
        'active' => 'boolean',
        'base_fare' => 'decimal:2',
        'per_km_rate' => 'decimal:2',
        'waiting_charge' => 'decimal:2',
        'night_charges' => 'decimal:2',
    ];

    public function commissionSlabs()
    {
        return $this->hasMany(CommissionSlab::class);
    }

    public function rides()
    {
        return $this->hasMany(Ride::class);
    }

    public function activeCommissionSlabs()
    {
        return $this->hasMany(CommissionSlab::class)->where('active', true);
    }

    public function defaultCommissionSlab()
    {
        return $this->hasMany(CommissionSlab::class)
            ->where('active', true)
            ->where('is_default', true)
            ->first();
    }
}
