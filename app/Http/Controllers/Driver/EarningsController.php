<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\DriverEarning;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class EarningsController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Get filter parameters
        $period = $request->get('period', 'week'); // week, month, year
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');
        
        // Build query
        $query = DriverEarning::where('driver_id', $user->id)
            ->with(['ride' => function($q) {
                $q->with('passenger');
            }]);
        
        // Apply date filters
        if ($startDate && $endDate) {
            $query->whereBetween('earning_date', [$startDate, $endDate]);
        } else {
            switch ($period) {
                case 'today':
                    $query->whereDate('earning_date', today());
                    break;
                case 'week':
                    $query->whereBetween('earning_date', [
                        Carbon::now()->startOfWeek(),
                        Carbon::now()->endOfWeek()
                    ]);
                    break;
                case 'month':
                    $query->whereBetween('earning_date', [
                        Carbon::now()->startOfMonth(),
                        Carbon::now()->endOfMonth()
                    ]);
                    break;
                case 'year':
                    $query->whereBetween('earning_date', [
                        Carbon::now()->startOfYear(),
                        Carbon::now()->endOfYear()
                    ]);
                    break;
            }
        }
        
        // Get earnings
        $earnings = $query->orderBy('earning_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(15);
        
        // Calculate summary statistics
        $totalEarnings = $earnings->sum('driver_earnings');
        $totalRides = $earnings->count();
        $averageEarning = $totalRides > 0 ? $totalEarnings / $totalRides : 0;
        
        // Get daily earnings for chart (last 30 days)
        $dailyEarnings = DriverEarning::where('driver_id', $user->id)
            ->whereBetween('earning_date', [
                Carbon::now()->subDays(30),
                Carbon::now()
            ])
            ->selectRaw('earning_date, SUM(driver_earnings) as total_earnings, COUNT(*) as rides_count')
            ->groupBy('earning_date')
            ->orderBy('earning_date')
            ->get();
        
        // Get this week's summary
        $weeklyStats = [
            'total_earnings' => DriverEarning::where('driver_id', $user->id)
                ->whereBetween('earning_date', [
                    Carbon::now()->startOfWeek(),
                    Carbon::now()->endOfWeek()
                ])
                ->sum('driver_earnings'),
            'total_rides' => DriverEarning::where('driver_id', $user->id)
                ->whereBetween('earning_date', [
                    Carbon::now()->startOfWeek(),
                    Carbon::now()->endOfWeek()
                ])
                ->count(),
        ];
        
        // Get monthly stats
        $monthlyStats = [
            'total_earnings' => DriverEarning::where('driver_id', $user->id)
                ->whereBetween('earning_date', [
                    Carbon::now()->startOfMonth(),
                    Carbon::now()->endOfMonth()
                ])
                ->sum('driver_earnings'),
            'total_rides' => DriverEarning::where('driver_id', $user->id)
                ->whereBetween('earning_date', [
                    Carbon::now()->startOfMonth(),
                    Carbon::now()->endOfMonth()
                ])
                ->count(),
        ];
        
        $stats = [
            'total_earnings' => $totalEarnings,
            'total_rides' => $totalRides,
            'average_earning' => $averageEarning,
            'weekly' => $weeklyStats,
            'monthly' => $monthlyStats,
        ];
        
        return view('driver.earnings.index', compact(
            'earnings', 
            'stats', 
            'dailyEarnings', 
            'period'
        ));
    }
    
    public function export(Request $request)
    {
        $user = Auth::user();
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth());
        $endDate = $request->get('end_date', Carbon::now()->endOfMonth());
        
        $earnings = DriverEarning::where('driver_id', $user->id)
            ->whereBetween('earning_date', [$startDate, $endDate])
            ->with(['ride' => function($q) {
                $q->with('passenger');
            }])
            ->orderBy('earning_date', 'desc')
            ->get();
        
        $filename = "earnings-{$startDate}-to-{$endDate}.csv";
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];
        
        $callback = function() use ($earnings) {
            $file = fopen('php://output', 'w');
            
            // CSV headers
            fputcsv($file, [
                'Date',
                'Ride ID',
                'Passenger',
                'Fare Amount',
                'Commission',
                'Driver Earnings',
                'Pickup Address',
                'Destination Address'
            ]);
            
            // CSV data
            foreach ($earnings as $earning) {
                fputcsv($file, [
                    $earning->earning_date,
                    $earning->ride->ride_id,
                    $earning->ride->passenger->name,
                    $earning->fare_amount,
                    $earning->commission,
                    $earning->driver_earnings,
                    $earning->ride->pickup_address,
                    $earning->ride->destination_address,
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
}