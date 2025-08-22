<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Driver;
use App\Models\Ride;
use App\Models\DriverEarning;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function dashboard()
    {
        // Get platform statistics
        $stats = [
            'total_users' => User::count(),
            'total_drivers' => User::where('role', 'driver')->count(),
            'total_passengers' => User::where('role', 'passenger')->count(),
            'active_drivers' => Driver::where('status', 'online')->count(),
            'total_rides' => Ride::count(),
            'completed_rides' => Ride::where('status', 'completed')->count(),
            'total_revenue' => DriverEarning::sum('commission'),
            'today_rides' => Ride::whereDate('created_at', today())->count(),
        ];
        
        // Recent activities
        $recentRides = Ride::with(['passenger', 'driver'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        $recentUsers = User::orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        return view('admin.dashboard', compact('stats', 'recentRides', 'recentUsers'));
    }
    
    public function drivers()
    {
        $drivers = User::where('role', 'driver')
            ->with(['driver'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);
        
        return view('admin.drivers.index', compact('drivers'));
    }
    
    public function approveDriver(Request $request, Driver $driver)
    {
        $driver->update([
            'is_approved' => true,
            'approved_at' => now(),
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Driver approved successfully'
        ]);
    }
    
    public function rejectDriver(Request $request, Driver $driver)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);
        
        $driver->update([
            'is_approved' => false,
            'approved_at' => null,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Driver rejected'
        ]);
    }
    
    public function reports()
    {
        return view('admin.reports.index');
    }
    
    public function earningsReport(Request $request)
    {
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth());
        $endDate = $request->get('end_date', Carbon::now()->endOfMonth());
        
        $earnings = DriverEarning::whereBetween('earning_date', [$startDate, $endDate])
            ->with(['driver', 'ride'])
            ->orderBy('earning_date', 'desc')
            ->paginate(20);
        
        $totalEarnings = DriverEarning::whereBetween('earning_date', [$startDate, $endDate])
            ->sum('driver_earnings');
        
        $totalCommission = DriverEarning::whereBetween('earning_date', [$startDate, $endDate])
            ->sum('commission');
        
        return view('admin.reports.earnings', compact(
            'earnings', 
            'totalEarnings', 
            'totalCommission', 
            'startDate', 
            'endDate'
        ));
    }
    
    public function ridesReport(Request $request)
    {
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth());
        $endDate = $request->get('end_date', Carbon::now()->endOfMonth());
        
        $rides = Ride::whereBetween('created_at', [$startDate, $endDate])
            ->with(['passenger', 'driver'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        $rideStats = [
            'total_rides' => Ride::whereBetween('created_at', [$startDate, $endDate])->count(),
            'completed_rides' => Ride::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'completed')->count(),
            'cancelled_rides' => Ride::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'like', 'cancelled_%')->count(),
            'average_fare' => Ride::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'completed')->avg('actual_fare'),
        ];
        
        return view('admin.reports.rides', compact(
            'rides', 
            'rideStats', 
            'startDate', 
            'endDate'
        ));
    }
}