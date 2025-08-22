<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Driver\DriverController;
use App\Http\Controllers\Driver\RideController as DriverRideController;
use App\Http\Controllers\Driver\EarningsController;
use App\Http\Controllers\Passenger\PassengerController;
use App\Http\Controllers\Passenger\RideController as PassengerRideController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\RideController as AdminRideController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::get('/', function () {
    return view('welcome');
})->name('home');

// Authentication Routes
require __DIR__.'/auth.php';

// Protected Routes
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard Route - redirects based on user role
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Driver Routes
    Route::middleware(['role:driver'])->prefix('driver')->name('driver.')->group(function () {
        Route::get('/dashboard', [DriverController::class, 'dashboard'])->name('dashboard');
        Route::get('/profile', [DriverController::class, 'profile'])->name('profile');
        Route::post('/toggle-status', [DriverController::class, 'toggleStatus'])->name('toggle-status');
        Route::post('/update-location', [DriverController::class, 'updateLocation'])->name('update-location');
        
        // Driver Ride Management
        Route::get('/rides', [DriverRideController::class, 'index'])->name('rides');
        Route::get('/rides/{ride}', [DriverRideController::class, 'show'])->name('rides.show');
        Route::post('/rides/{ride}/accept', [DriverRideController::class, 'accept'])->name('rides.accept');
        Route::post('/rides/{ride}/decline', [DriverRideController::class, 'decline'])->name('rides.decline');
        Route::post('/rides/{ride}/start', [DriverRideController::class, 'start'])->name('rides.start');
        Route::post('/rides/{ride}/complete', [DriverRideController::class, 'complete'])->name('rides.complete');
        Route::post('/rides/{ride}/cancel', [DriverRideController::class, 'cancel'])->name('rides.cancel');
        
        // Driver Earnings
        Route::get('/earnings', [EarningsController::class, 'index'])->name('earnings');
        Route::get('/earnings/export', [EarningsController::class, 'export'])->name('earnings.export');
    });
    
    // Passenger Routes
    Route::middleware(['role:passenger'])->prefix('passenger')->name('passenger.')->group(function () {
        Route::get('/dashboard', [PassengerController::class, 'dashboard'])->name('dashboard');
        Route::get('/book-ride', [PassengerController::class, 'bookRide'])->name('book-ride');
        Route::post('/book-ride', [PassengerController::class, 'storeRide'])->name('store-ride');
        
        // Passenger Ride Management
        Route::get('/rides', [PassengerRideController::class, 'index'])->name('rides');
        Route::get('/rides/{ride}', [PassengerRideController::class, 'show'])->name('rides.show');
        Route::post('/rides/{ride}/cancel', [PassengerRideController::class, 'cancel'])->name('rides.cancel');
        Route::post('/rides/{ride}/rate', [PassengerRideController::class, 'rate'])->name('rides.rate');
    });
    
    // Admin Routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        
        // User Management
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::get('/users/{user}', [AdminUserController::class, 'show'])->name('users.show');
        Route::post('/users/{user}/verify', [AdminUserController::class, 'verify'])->name('users.verify');
        Route::post('/users/{user}/block', [AdminUserController::class, 'block'])->name('users.block');
        
        // Driver Management
        Route::get('/drivers', [AdminController::class, 'drivers'])->name('drivers');
        Route::post('/drivers/{driver}/approve', [AdminController::class, 'approveDriver'])->name('drivers.approve');
        Route::post('/drivers/{driver}/reject', [AdminController::class, 'rejectDriver'])->name('drivers.reject');
        
        // Ride Management
        Route::get('/rides', [AdminRideController::class, 'index'])->name('rides.index');
        Route::get('/rides/{ride}', [AdminRideController::class, 'show'])->name('rides.show');
        
        // Reports
        Route::get('/reports', [AdminController::class, 'reports'])->name('reports');
        Route::get('/reports/earnings', [AdminController::class, 'earningsReport'])->name('reports.earnings');
        Route::get('/reports/rides', [AdminController::class, 'ridesReport'])->name('reports.rides');
    });
});

// API Routes for real-time updates
Route::middleware(['auth:sanctum'])->prefix('api')->group(function () {
    Route::get('/driver/nearby-rides', [DriverController::class, 'getNearbyRides'])->name('api.driver.nearby-rides');
    Route::get('/ride/{ride}/status', [DriverRideController::class, 'getStatus'])->name('api.ride.status');
    Route::post('/ride/{ride}/update-location', [DriverRideController::class, 'updateRideLocation'])->name('api.ride.update-location');
});