<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommissionSlab extends Model
{
    use HasFactory;

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

    public function calculateCommission(float $fare): float
    {
        if ($this->commission_type === 'fixed') {
            return $this->commission_value;
        } else {
            return ($this->commission_value / 100) * $fare;
        }
    }

    public function isApplicableForFare(float $fare): bool
    {
        return $fare >= $this->min_fare && $fare <= $this->max_fare;
    }
}