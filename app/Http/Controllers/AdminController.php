<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function dashboard()
    {
        // Basic stats for admin dashboard
        $stats = [
            'total_users' => 5,
            'total_drivers' => 2,
            'total_rides' => 0,
            'total_revenue' => 0
        ];
        
        return view('admin.dashboard', compact('stats'));
    }
    
    public function drivers()
    {
        // Mock driver data
        $drivers = [
            ['name' => 'Rajesh Kumar', 'email' => 'driver@loyalsafar.com', 'status' => 'verified'],
            ['name' => 'Suresh Sharma', 'email' => 'driver2@loyalsafar.com', 'status' => 'verified']
        ];
        
        return view('admin.drivers', compact('drivers'));
    }
    
    public function areas()
    {
        // Mock area data for Kolkata/Howrah
        $areas = [
            ['name' => 'Kolkata Central', 'base_fare' => 30, 'per_km_rate' => 15],
            ['name' => 'Howrah Station', 'base_fare' => 35, 'per_km_rate' => 18],
            ['name' => 'Salt Lake', 'base_fare' => 25, 'per_km_rate' => 12]
        ];
        
        return view('admin.areas', compact('areas'));
    }
    
    public function coupons()
    {
        // Mock coupon data
        $coupons = [
            ['code' => 'WELCOME10', 'discount' => '10%', 'status' => 'active'],
            ['code' => 'LOYAL20', 'discount' => '20%', 'status' => 'active'],
            ['code' => 'SAFAR15', 'discount' => '₹15', 'status' => 'active']
        ];
        
        return view('admin.coupons', compact('coupons'));
    }
    
    public function commissionSlabs()
    {
        // Mock commission data
        $slabs = [
            ['min_fare' => 0, 'max_fare' => 100, 'rate' => 15, 'type' => 'percentage'],
            ['min_fare' => 101, 'max_fare' => 500, 'rate' => 12, 'type' => 'percentage'],
            ['min_fare' => 501, 'max_fare' => null, 'rate' => 10, 'type' => 'percentage']
        ];
        
        return view('admin.commission-slabs', compact('slabs'));
    }
    
    public function reports()
    {
        // Mock report data
        $reports = [
            'daily_rides' => 0,
            'daily_revenue' => 0,
            'active_drivers' => 2,
            'total_users' => 5
        ];
        
        return view('admin.reports', compact('reports'));
    }
    
    public function verifyDriver(Request $request, $driverId)
    {
        // Mock driver verification
        return response()->json([
            'success' => true,
            'message' => 'Driver verified successfully!'
        ]);
    }
    
    public function blockDriver(Request $request, $driverId)
    {
        // Mock driver blocking
        return response()->json([
            'success' => true,
            'message' => 'Driver blocked successfully!'
        ]);
    }
}