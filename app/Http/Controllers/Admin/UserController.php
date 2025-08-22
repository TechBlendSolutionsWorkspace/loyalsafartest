<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();
        
        // Apply filters
        if ($request->has('role') && $request->role !== '') {
            $query->where('role', $request->role);
        }
        
        if ($request->has('status') && $request->status !== '') {
            if ($request->status === 'verified') {
                $query->where('is_verified', true);
            } else {
                $query->where('is_verified', false);
            }
        }
        
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }
        
        $users = $query->orderBy('created_at', 'desc')->paginate(15);
        
        return view('admin.users.index', compact('users'));
    }
    
    public function show(User $user)
    {
        $user->load(['driver', 'passengerRides', 'driverRides', 'earnings']);
        
        return view('admin.users.show', compact('user'));
    }
    
    public function verify(Request $request, User $user)
    {
        $user->update(['is_verified' => true]);
        
        return response()->json([
            'success' => true,
            'message' => 'User verified successfully'
        ]);
    }
    
    public function block(Request $request, User $user)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);
        
        $user->update([
            'is_verified' => false,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'User blocked successfully'
        ]);
    }
}