<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommissionSlab;
use App\Models\Area;
use App\Services\CommissionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Exception;

class CommissionSlabController extends Controller
{
    protected CommissionService $commissionService;

    public function __construct(CommissionService $commissionService)
    {
        $this->commissionService = $commissionService;
    }

    /**
     * Display a listing of commission slabs
     */
    public function index(Request $request): JsonResponse
    {
        $query = CommissionSlab::with(['area']);

        // Filter by area
        if ($request->has('area_id')) {
            $query->where('area_id', $request->area_id);
        }

        // Filter by active status
        if ($request->has('active')) {
            $query->where('active', $request->boolean('active'));
        }

        // Filter by commission type
        if ($request->has('commission_type')) {
            $query->where('commission_type', $request->commission_type);
        }

        $slabs = $query->orderBy('area_id')
            ->orderBy('min_fare')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $slabs
        ]);
    }

    /**
     * Store a newly created commission slab
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'area_id' => 'required|exists:areas,id',
            'min_fare' => 'required|numeric|min:0',
            'max_fare' => 'required|numeric|gt:min_fare',
            'commission_type' => 'required|in:fixed,percentage',
            'commission_value' => 'required|numeric|min:0',
            'is_default' => 'boolean',
            'active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Validate range doesn't overlap with existing slabs
            $isValidRange = $this->commissionService->validateSlabRange(
                $request->area_id,
                $request->min_fare,
                $request->max_fare
            );

            if (!$isValidRange) {
                return response()->json([
                    'success' => false,
                    'message' => 'Fare range overlaps with existing commission slabs'
                ], 400);
            }

            // If setting as default, unset other defaults for this area
            if ($request->boolean('is_default')) {
                CommissionSlab::where('area_id', $request->area_id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }

            $slab = CommissionSlab::create($request->all());
            $slab->load('area');

            return response()->json([
                'success' => true,
                'message' => 'Commission slab created successfully',
                'data' => $slab
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create commission slab: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified commission slab
     */
    public function show(string $id): JsonResponse
    {
        $slab = CommissionSlab::with(['area'])->find($id);

        if (!$slab) {
            return response()->json([
                'success' => false,
                'message' => 'Commission slab not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $slab
        ]);
    }

    /**
     * Update the specified commission slab
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $slab = CommissionSlab::find($id);

        if (!$slab) {
            return response()->json([
                'success' => false,
                'message' => 'Commission slab not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'area_id' => 'sometimes|exists:areas,id',
            'min_fare' => 'sometimes|numeric|min:0',
            'max_fare' => 'sometimes|numeric|gt:min_fare',
            'commission_type' => 'sometimes|in:fixed,percentage',
            'commission_value' => 'sometimes|numeric|min:0',
            'is_default' => 'boolean',
            'active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Validate range if fare values are being updated
            if ($request->has('min_fare') || $request->has('max_fare')) {
                $minFare = $request->get('min_fare', $slab->min_fare);
                $maxFare = $request->get('max_fare', $slab->max_fare);
                $areaId = $request->get('area_id', $slab->area_id);

                $isValidRange = $this->commissionService->validateSlabRange(
                    $areaId,
                    $minFare,
                    $maxFare,
                    $slab->id
                );

                if (!$isValidRange) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Fare range overlaps with existing commission slabs'
                    ], 400);
                }
            }

            // If setting as default, unset other defaults for this area
            if ($request->boolean('is_default')) {
                $areaId = $request->get('area_id', $slab->area_id);
                CommissionSlab::where('area_id', $areaId)
                    ->where('is_default', true)
                    ->where('id', '!=', $slab->id)
                    ->update(['is_default' => false]);
            }

            $slab->update($request->all());
            $slab->load('area');

            return response()->json([
                'success' => true,
                'message' => 'Commission slab updated successfully',
                'data' => $slab
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update commission slab: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified commission slab
     */
    public function destroy(string $id): JsonResponse
    {
        $slab = CommissionSlab::find($id);

        if (!$slab) {
            return response()->json([
                'success' => false,
                'message' => 'Commission slab not found'
            ], 404);
        }

        try {
            $slab->delete();

            return response()->json([
                'success' => true,
                'message' => 'Commission slab deleted successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete commission slab: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validate fare range for overlaps
     */
    public function validateRange(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'area_id' => 'required|exists:areas,id',
            'min_fare' => 'required|numeric|min:0',
            'max_fare' => 'required|numeric|gt:min_fare',
            'exclude_slab_id' => 'nullable|exists:commission_slabs,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $isValid = $this->commissionService->validateSlabRange(
                $request->area_id,
                $request->min_fare,
                $request->max_fare,
                $request->exclude_slab_id
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'is_valid' => $isValid,
                    'message' => $isValid ? 'Range is valid' : 'Range overlaps with existing slabs'
                ]
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to validate range: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get commission slabs for a specific area
     */
    public function getByArea(string $areaId): JsonResponse
    {
        $area = Area::find($areaId);

        if (!$area) {
            return response()->json([
                'success' => false,
                'message' => 'Area not found'
            ], 404);
        }

        $slabs = CommissionSlab::where('area_id', $areaId)
            ->where('active', true)
            ->orderBy('min_fare')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'area' => $area->only(['id', 'name', 'city', 'state']),
                'commission_slabs' => $slabs
            ]
        ]);
    }
}
