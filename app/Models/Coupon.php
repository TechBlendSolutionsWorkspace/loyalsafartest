<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
        'discount_type',
        'discount_value',
        'min_fare',
        'max_discount',
        'usage_limit',
        'usage_limit_per_user',
        'used_count',
        'valid_from',
        'valid_until',
        'applicable_areas',
        'user_type',
        'active',
        'created_by'
    ];

    protected $casts = [
        'applicable_areas' => 'array',
        'valid_from' => 'date',
        'valid_until' => 'date',
        'active' => 'boolean',
        'discount_value' => 'decimal:2',
        'min_fare' => 'decimal:2',
        'max_discount' => 'decimal:2'
    ];

    /**
     * Get coupon redemptions
     */
    public function redemptions(): HasMany
    {
        return $this->hasMany(CouponRedemption::class, 'coupon_code', 'code');
    }

    /**
     * Get rides that used this coupon
     */
    public function rides(): HasMany
    {
        return $this->hasMany(Ride::class, 'coupon_code', 'code');
    }

    /**
     * Check if coupon is valid for use
     */
    public function isValid(): bool
    {
        return $this->active 
            && $this->valid_from <= now()->toDateString()
            && $this->valid_until >= now()->toDateString()
            && (!$this->usage_limit || $this->used_count < $this->usage_limit);
    }

    /**
     * Check if coupon is applicable for a specific area
     */
    public function isApplicableForArea($areaId): bool
    {
        if (!$this->applicable_areas) {
            return true; // If no specific areas, applicable everywhere
        }
        
        return in_array($areaId, $this->applicable_areas);
    }

    /**
     * Calculate discount amount for a given fare
     */
    public function calculateDiscount($fare): float
    {
        if ($fare < $this->min_fare) {
            return 0;
        }

        $discount = 0;
        if ($this->discount_type === 'fixed') {
            $discount = $this->discount_value;
        } else {
            $discount = ($fare * $this->discount_value) / 100;
        }

        // Apply max discount limit if set
        if ($this->max_discount && $discount > $this->max_discount) {
            $discount = $this->max_discount;
        }

        return min($discount, $fare); // Discount cannot exceed fare
    }
}
