<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommissionSlab extends Model
{
    protected $fillable = [
        'area_id',
        'min_fare',
        'max_fare',
        'commission_type',
        'commission_value',
        'is_default',
        'active'
    ];

    protected $casts = [
        'min_fare' => 'decimal:2',
        'max_fare' => 'decimal:2',
        'commission_value' => 'decimal:2',
        'is_default' => 'boolean',
        'active' => 'boolean',
    ];

    public function area()
    {
        return $this->belongsTo(Area::class);
    }
}