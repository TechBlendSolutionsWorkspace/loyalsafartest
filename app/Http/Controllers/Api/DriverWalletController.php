<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DriverWallet;
use App\Models\User;
use App\Services\CommissionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Exception;

class DriverWalletController extends Controller
{
    protected CommissionService $commissionService;

    public function __construct(CommissionService $commissionService)
    {
        $this->commissionService = $commissionService;
    }

    /**
     * Get driver wallet information
     */
    public function getDriverWallet(string $driverId): JsonResponse
    {
        $driver = User::find($driverId);

        if (!$driver) {
            return response()->json([
                'success' => false,
                'message' => 'Driver not found'
            ], 404);
        }

        try {
            $walletSummary = $this->commissionService->getDriverWalletSummary($driverId);

            return response()->json([
                'success' => true,
                'data' => [
                    'driver' => $driver->only(['id', 'name', 'email']),
                    'wallet' => $walletSummary
                ]
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get wallet information: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get driver transaction history
     */
    public function getTransactions(Request $request, string $driverId): JsonResponse
    {
        $driver = User::find($driverId);

        if (!$driver) {
            return response()->json([
                'success' => false,
                'message' => 'Driver not found'
            ], 404);
        }

        $query = DriverWallet::where('driver_id', $driverId)
            ->with(['ride']);

        // Filter by transaction type
        if ($request->has('type')) {
            $query->where('transaction_type', $request->type);
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $transactions = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    /**
     * Get driver wallet summary
     */
    public function getSummary(string $driverId): JsonResponse
    {
        $driver = User::find($driverId);

        if (!$driver) {
            return response()->json([
                'success' => false,
                'message' => 'Driver not found'
            ], 404);
        }

        try {
            $summary = $this->commissionService->getDriverWalletSummary($driverId);

            return response()->json([
                'success' => true,
                'data' => $summary
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get summary: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process payout request for driver
     */
    public function processPayoutRequest(Request $request, string $driverId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|in:upi,bank_transfer,cash',
            'payment_details' => 'required|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $driver = User::find($driverId);

        if (!$driver) {
            return response()->json([
                'success' => false,
                'message' => 'Driver not found'
            ], 404);
        }

        try {
            $walletSummary = $this->commissionService->getDriverWalletSummary($driverId);

            if ($request->amount > $walletSummary['balance']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient balance for payout'
                ], 400);
            }

            // Create payout transaction
            $payoutTransaction = DriverWallet::create([
                'driver_id' => $driverId,
                'amount' => $request->amount,
                'transaction_type' => 'debit',
                'reason' => 'Payout Request',
                'source' => 'payout_' . $request->payment_method,
                'status' => 'pending',
                'reference_id' => 'PO' . time() . $driverId
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payout request created successfully',
                'data' => [
                    'transaction' => $payoutTransaction,
                    'remaining_balance' => $walletSummary['balance'] - $request->amount
                ]
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process payout: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get company wallet summary (admin only)
     */
    public function getCompanySummary(): JsonResponse
    {
        try {
            $summary = $this->commissionService->getCompanyWalletSummary();

            return response()->json([
                'success' => true,
                'data' => $summary
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get company summary: ' . $e->getMessage()
            ], 500);
        }
    }
}
