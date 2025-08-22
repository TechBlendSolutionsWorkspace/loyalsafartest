<?php

use App\Http\Controllers\Api\RideController;
use App\Http\Controllers\Api\RideTrackingController;
use App\Http\Controllers\Api\DriverWalletController;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\CommissionSlabController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public tracking routes (no auth required)
Route::get('track/{token}', [RideTrackingController::class, 'getTrackingStatus']);

// Authenticated API routes
Route::middleware(['auth:api'])->group(function () {
    
    // Ride Management Routes
    Route::apiResource('rides', RideController::class);
    Route::post('rides/{id}/verify-otp', [RideController::class, 'verifyOtp']);
    Route::post('rides/{id}/complete', [RideController::class, 'complete']);
    Route::post('rides/{id}/cancel', [RideController::class, 'cancel']);
    Route::post('rides/calculate-commission', [RideController::class, 'calculateCommission']);
    Route::get('rides-stats', [RideController::class, 'stats']);

    // Ride Tracking Routes
    Route::prefix('tracking')->group(function () {
        Route::post('rides/{rideId}/start', [RideTrackingController::class, 'startTracking']);
        Route::post('sessions/{token}/location', [RideTrackingController::class, 'updateLocation']);
        Route::post('rides/{rideId}/share', [RideTrackingController::class, 'shareRide']);
        Route::post('rides/{rideId}/end', [RideTrackingController::class, 'endTracking']);
        Route::get('rides/{rideId}/sessions', [RideTrackingController::class, 'getActiveSessions']);
        Route::get('rides/{rideId}/shares', [RideTrackingController::class, 'getSharingHistory']);
        Route::post('cleanup-expired', [RideTrackingController::class, 'cleanupExpired']);
    });

    // Driver Wallet Routes
    Route::prefix('wallets')->group(function () {
        Route::get('driver/{driverId}', [DriverWalletController::class, 'getDriverWallet']);
        Route::get('driver/{driverId}/transactions', [DriverWalletController::class, 'getTransactions']);
        Route::get('driver/{driverId}/summary', [DriverWalletController::class, 'getSummary']);
        Route::post('driver/{driverId}/payout', [DriverWalletController::class, 'processPayoutRequest']);
        Route::get('company/summary', [DriverWalletController::class, 'getCompanySummary']);
    });

    // Area Management Routes
    Route::apiResource('areas', AreaController::class);
    Route::get('areas/{areaId}/commission-slabs', [AreaController::class, 'getCommissionSlabs']);

    // Commission Slab Management Routes
    Route::apiResource('commission-slabs', CommissionSlabController::class);
    Route::post('commission-slabs/validate-range', [CommissionSlabController::class, 'validateRange']);
    Route::get('commission-slabs/area/{areaId}', [CommissionSlabController::class, 'getByArea']);

    // Admin Routes
    Route::prefix('admin')->group(function () {
        Route::get('dashboard/stats', [RideController::class, 'stats']);
        Route::get('dashboard/wallet-summary', [DriverWalletController::class, 'getCompanySummary']);
        Route::get('rides/commission-report', [RideController::class, 'commissionReport']);
    });
});

// Cron/System routes (can be protected with middleware as needed)
Route::prefix('system')->group(function () {
    Route::post('cleanup-expired-sessions', [RideTrackingController::class, 'cleanupExpired']);
});