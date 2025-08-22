<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
        'avatar',
        'rating',
        'is_verified',
        'last_active_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'rating' => 'decimal:2',
            'is_verified' => 'boolean',
            'last_active_at' => 'datetime',
        ];
    }

    public function driver(): HasOne
    {
        return $this->hasOne(Driver::class);
    }

    public function passengerRides(): HasMany
    {
        return $this->hasMany(Ride::class, 'passenger_id');
    }

    public function driverRides(): HasMany
    {
        return $this->hasMany(Ride::class, 'driver_id');
    }

    public function ratingsGiven(): HasMany
    {
        return $this->hasMany(Rating::class, 'rater_id');
    }

    public function ratingsReceived(): HasMany
    {
        return $this->hasMany(Rating::class, 'rated_id');
    }

    public function earnings(): HasMany
    {
        return $this->hasMany(DriverEarning::class, 'driver_id');
    }

    public function walletTransactions(): HasMany
    {
        return $this->hasMany(DriverWallet::class, 'driver_id');
    }

    public function couponRedemptions(): HasMany
    {
        return $this->hasMany(CouponRedemption::class);
    }

    /**
     * Get driver's current wallet balance
     */
    public function getWalletBalance(): float
    {
        return $this->walletTransactions()
            ->selectRaw('SUM(CASE WHEN transaction_type = "credit" THEN amount ELSE -amount END) as balance')
            ->value('balance') ?? 0;
    }

    /**
     * Get pending wallet balance (not yet paid out)
     */
    public function getPendingWalletBalance(): float
    {
        return $this->walletTransactions()
            ->where('status', 'pending')
            ->selectRaw('SUM(CASE WHEN transaction_type = "credit" THEN amount ELSE -amount END) as balance')
            ->value('balance') ?? 0;
    }

    public function isDriver(): bool
    {
        return $this->role === 'driver';
    }

    public function isPassenger(): bool
    {
        return $this->role === 'passenger';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function updateLastActive(): void
    {
        $this->update(['last_active_at' => now()]);
    }
}
