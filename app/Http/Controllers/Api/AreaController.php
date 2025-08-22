<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Area;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Exception;

class AreaController extends Controller
{
    /**
     * Display a listing of areas
     */
    public function index(Request $request): JsonResponse
    {
        $query = Area::with(['commissionSlabs']);

        // Filter by active status
        if ($request->has('active')) {
            $query->where('active', $request->boolean('active'));
        }

        // Filter by city
        if ($request->has('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        $areas = $query->orderBy('name')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $areas
        ]);
    }

    /**
     * Store a newly created area
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:areas,name',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
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
            $area = Area::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Area created successfully',
                'data' => $area
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create area: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified area
     */
    public function show(string $id): JsonResponse
    {
        $area = Area::with(['commissionSlabs'])->find($id);

        if (!$area) {
            return response()->json([
                'success' => false,
                'message' => 'Area not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $area
        ]);
    }

    /**
     * Update the specified area
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $area = Area::find($id);

        if (!$area) {
            return response()->json([
                'success' => false,
                'message' => 'Area not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255|unique:areas,name,' . $id,
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
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
            $area->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Area updated successfully',
                'data' => $area
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update area: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified area
     */
    public function destroy(string $id): JsonResponse
    {
        $area = Area::find($id);

        if (!$area) {
            return response()->json([
                'success' => false,
                'message' => 'Area not found'
            ], 404);
        }

        try {
            $area->delete();

            return response()->json([
                'success' => true,
                'message' => 'Area deleted successfully'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete area: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get commission slabs for a specific area
     */
    public function getCommissionSlabs(string $areaId): JsonResponse
    {
        $area = Area::with(['commissionSlabs' => function ($query) {
            $query->where('active', true)->orderBy('min_fare');
        }])->find($areaId);

        if (!$area) {
            return response()->json([
                'success' => false,
                'message' => 'Area not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'area' => $area->only(['id', 'name', 'city', 'state']),
                'commission_slabs' => $area->commissionSlabs
            ]
        ]);
    }
}
