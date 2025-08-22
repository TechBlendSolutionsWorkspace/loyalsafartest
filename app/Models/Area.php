<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    protected $fillable = [
        'name',
        'base_fare',
        'per_km_rate',
        'waiting_charge',
        'night_charges',
        'boundary_coordinates',
        'is_active'
    ];

    protected $casts = [
        'boundary_coordinates' => 'array',
        'is_active' => 'boolean',
        'base_fare' => 'decimal:2',
        'per_km_rate' => 'decimal:2',
        'waiting_charge' => 'decimal:2',
        'night_charges' => 'decimal:2',
    ];

    public function commission_slabs()
    {
        return $this->hasMany(CommissionSlab::class);
    }
}
