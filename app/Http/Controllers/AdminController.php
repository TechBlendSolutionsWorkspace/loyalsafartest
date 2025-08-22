<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\CommissionSlab;
use App\Models\Ride;
use App\Models\User;
use App\Models\DriverWallet;
use App\Models\CompanyWallet;
use App\Models\CouponRedemption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_rides' => Ride::count(),
            'completed_rides' => Ride::where('status', 'completed')->count(),
            'total_drivers' => User::where('role', 'driver')->count(),
            'active_drivers' => User::where('role', 'driver')->where('is_verified', true)->count(),
            'total_passengers' => User::where('role', 'passenger')->count(),
            'total_revenue' => Ride::where('status', 'completed')->sum('commission_amount'),
            'total_payouts' => DriverWallet::where('transaction_type', 'debit')->where('reason', 'payout')->sum('amount'),
            'coupon_discounts' => CouponRedemption::sum('discount_amount')
        ];

        $recentRides = Ride::with(['passenger', 'driver', 'area'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return view('admin.dashboard', compact('stats', 'recentRides'));
    }

    public function areas()
    {
        $areas = Area::withCount('commission_slabs')->get();
        return view('admin.areas', compact('areas'));
    }

    public function commissionSlabs()
    {
        $areas = Area::with('commission_slabs')->get();
        return view('admin.commission-slabs', compact('areas'));
    }

    public function createCommissionSlab(Request $request)
    {
        $request->validate([
            'area_id' => 'required|exists:areas,id',
            'min_fare' => 'required|numeric|min:0',
            'max_fare' => 'nullable|numeric|gt:min_fare',
            'commission_type' => 'required|in:percentage,fixed',
            'commission_value' => 'required|numeric|min:0',
            'is_default' => 'boolean'
        ]);

        // If this is set as default, remove default from other slabs in the same area
        if ($request->is_default) {
            CommissionSlab::where('area_id', $request->area_id)
                ->update(['is_default' => false]);
        }

        CommissionSlab::create($request->all());

        return redirect()->route('admin.commission-slabs')
            ->with('success', 'Commission slab created successfully!');
    }

    public function updateCommissionSlab(Request $request, $id)
    {
        $slab = CommissionSlab::findOrFail($id);
        
        $request->validate([
            'min_fare' => 'required|numeric|min:0',
            'max_fare' => 'nullable|numeric|gt:min_fare',
            'commission_type' => 'required|in:percentage,fixed',
            'commission_value' => 'required|numeric|min:0',
            'is_default' => 'boolean',
            'active' => 'boolean'
        ]);

        if ($request->is_default) {
            CommissionSlab::where('area_id', $slab->area_id)
                ->where('id', '!=', $id)
                ->update(['is_default' => false]);
        }

        $slab->update($request->all());

        return redirect()->route('admin.commission-slabs')
            ->with('success', 'Commission slab updated successfully!');
    }

    public function coupons()
    {
        $coupons = [
            ['code' => 'FIRST50', 'type' => 'fixed', 'value' => 50, 'usage' => CouponRedemption::where('coupon_code', 'FIRST50')->count()],
            ['code' => 'LOYAL20', 'type' => 'percentage', 'value' => 20, 'usage' => CouponRedemption::where('coupon_code', 'LOYAL20')->count()],
            ['code' => 'GREEN15', 'type' => 'fixed', 'value' => 15, 'usage' => CouponRedemption::where('coupon_code', 'GREEN15')->count()]
        ];

        return view('admin.coupons', compact('coupons'));
    }

    public function reports()
    {
        return view('admin.reports');
    }

    public function driverWalletReport(Request $request)
    {
        $query = DriverWallet::with(['driver', 'ride'])
            ->orderBy('created_at', 'desc');

        if ($request->driver_id) {
            $query->where('driver_id', $request->driver_id);
        }

        if ($request->from_date) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->to_date) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $transactions = $query->paginate(50);
        $drivers = User::where('role', 'driver')->get();

        return view('admin.reports.driver-wallet', compact('transactions', 'drivers'));
    }

    public function companyWalletReport(Request $request)
    {
        $query = CompanyWallet::with(['driver', 'ride'])
            ->orderBy('created_at', 'desc');

        if ($request->from_date) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->to_date) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $transactions = $query->paginate(50);

        return view('admin.reports.company-wallet', compact('transactions'));
    }

    public function couponUsageReport(Request $request)
    {
        $query = CouponRedemption::with(['user', 'ride'])
            ->orderBy('created_at', 'desc');

        if ($request->coupon_code) {
            $query->where('coupon_code', $request->coupon_code);
        }

        if ($request->from_date) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->to_date) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $redemptions = $query->paginate(50);

        $couponStats = DB::table('coupon_redemptions')
            ->select('coupon_code', DB::raw('COUNT(*) as usage_count'), DB::raw('SUM(discount_amount) as total_discount'))
            ->groupBy('coupon_code')
            ->get();

        return view('admin.reports.coupon-usage', compact('redemptions', 'couponStats'));
    }

    public function rideSharesReport(Request $request)
    {
        $query = Ride::with(['passenger', 'driver', 'area'])
            ->whereNotNull('share_token')
            ->orderBy('created_at', 'desc');

        if ($request->from_date) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->to_date) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $sharedRides = $query->paginate(50);

        return view('admin.reports.ride-shares', compact('sharedRides'));
    }

    public function verifyDriver($driverId)
    {
        $driver = User::where('role', 'driver')->findOrFail($driverId);
        $driver->update(['is_verified' => true]);

        return response()->json(['message' => 'Driver verified successfully!']);
    }

    public function blockDriver($driverId)
    {
        $driver = User::where('role', 'driver')->findOrFail($driverId);
        $driver->update(['is_verified' => false]);

        return response()->json(['message' => 'Driver blocked successfully!']);
    }

    public function drivers()
    {
        $drivers = User::where('role', 'driver')
            ->with(['driverRides' => function($query) {
                $query->where('status', 'completed');
            }])
            ->withSum('driverEarnings', 'amount')
            ->orderBy('created_at', 'desc')
            ->get();

        return view('admin.drivers', compact('drivers'));
    }
}