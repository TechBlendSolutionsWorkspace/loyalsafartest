<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\RiderController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get('/', function () {
    return view('welcome');
})->name('home');

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected Routes
Route::middleware(['auth'])->group(function () {
    
    // General Dashboard Route - redirects based on role
    Route::get('/dashboard', function () {
        $user = Auth::user();
        switch ($user->role) {
            case 'admin':
                return redirect('admin/dashboard');
            case 'driver':
                return redirect('driver/dashboard');
            case 'passenger':
                return redirect('rider/dashboard');
            default:
                return redirect('/');
        }
    })->name('dashboard');
    
    // Rider Routes
    Route::middleware(['role:passenger'])->prefix('rider')->name('rider.')->group(function () {
        Route::get('/dashboard', [RiderController::class, 'dashboard'])->name('dashboard');
        Route::get('/book-ride', [RiderController::class, 'bookRide'])->name('book-ride');
        Route::post('/calculate-fare', [RiderController::class, 'calculateFare'])->name('calculate-fare');
        Route::post('/store-ride', [RiderController::class, 'storeRide'])->name('store-ride');
        Route::get('/ride-status/{ride}', [RiderController::class, 'rideStatus'])->name('ride-status');
        Route::post('/verify-otp/{ride}', [RiderController::class, 'verifyOtp'])->name('verify-otp');
        Route::get('/track-ride/{ride}', [RiderController::class, 'trackRide'])->name('track-ride');
        Route::post('/share-ride/{ride}', [RiderController::class, 'shareRide'])->name('share-ride');
        Route::post('/emergency-alert/{ride}', [RiderController::class, 'emergencyAlert'])->name('emergency-alert');
    });
    
    // Driver Routes
    Route::middleware(['role:driver'])->prefix('driver')->name('driver.')->group(function () {
        Route::get('/dashboard', [DriverController::class, 'dashboard'])->name('dashboard');
        Route::get('/rides', [DriverController::class, 'rides'])->name('rides');
        Route::get('/wallet', [DriverController::class, 'wallet'])->name('wallet');
        Route::post('/toggle-status', [DriverController::class, 'toggleStatus'])->name('toggle-status');
        Route::post('/accept-ride/{ride}', [DriverController::class, 'acceptRide'])->name('accept-ride');
        Route::post('/start-ride/{ride}', [DriverController::class, 'startRide'])->name('start-ride');
        Route::post('/complete-ride/{ride}', [DriverController::class, 'completeRide'])->name('complete-ride');
        Route::post('/instant-payout', [DriverController::class, 'instantPayout'])->name('instant-payout');
        Route::get('/leaderboard', [DriverController::class, 'leaderboard'])->name('leaderboard');
    });
    
    // Admin Routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/users', [AdminController::class, 'users'])->name('users.index');
        Route::get('/users/{user}', [AdminController::class, 'showUser'])->name('users.show');
        Route::get('/rides', [AdminController::class, 'rides'])->name('rides.index');
        Route::get('/rides/{ride}', [AdminController::class, 'showRide'])->name('rides.show');
        Route::get('/drivers', [AdminController::class, 'drivers'])->name('drivers');
        Route::get('/areas', [AdminController::class, 'areas'])->name('areas');
        Route::get('/commission-slabs', [AdminController::class, 'commissionSlabs'])->name('commission-slabs');
        Route::post('/commission-slabs', [AdminController::class, 'createCommissionSlab'])->name('commission-slabs.store');
        Route::put('/commission-slabs/{slab}', [AdminController::class, 'updateCommissionSlab'])->name('commission-slabs.update');
        Route::get('/coupons', [AdminController::class, 'coupons'])->name('coupons');
        Route::get('/reports', [AdminController::class, 'reports'])->name('reports');
        Route::get('/reports/driver-wallet', [AdminController::class, 'driverWalletReport'])->name('reports.driver-wallet');
        Route::get('/reports/company-wallet', [AdminController::class, 'companyWalletReport'])->name('reports.company-wallet');
        Route::get('/reports/coupon-usage', [AdminController::class, 'couponUsageReport'])->name('reports.coupon-usage');
        Route::get('/reports/ride-shares', [AdminController::class, 'rideSharesReport'])->name('reports.ride-shares');
        Route::post('/verify-driver/{driver}', [AdminController::class, 'verifyDriver'])->name('verify-driver');
        Route::post('/block-driver/{driver}', [AdminController::class, 'blockDriver'])->name('block-driver');
    });
});

// Public ride tracking (no auth required)
Route::get('/track/{token}', function ($token) {
    // Mock ride tracking for demo
    $ride = (object) [
        'id' => 1,
        'share_token' => $token,
        'status' => 'in_progress',
        'pickup_location' => 'Kolkata',
        'dropoff_location' => 'Howrah'
    ];
    return view('public.track-ride', compact('ride'));
})->name('public.track-ride');