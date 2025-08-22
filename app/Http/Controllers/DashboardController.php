<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Redirect to role-specific dashboard
        switch ($user->role) {
            case 'driver':
                return redirect(route('driver.dashboard'));
            case 'passenger':
                return redirect(route('passenger.dashboard'));
            case 'admin':
                return redirect(route('admin.dashboard'));
            default:
                return redirect(route('home'));
        }
    }
}