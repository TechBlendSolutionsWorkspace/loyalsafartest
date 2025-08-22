@extends('layouts.app')

@section('title', 'User Details - Loyal Safar Admin')

@section('content')
<div class="container-fluid">
    <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 px-0">
            <div class="sidebar">
                <div class="p-4">
                    <h5 class="text-white">
                        <i class="fas fa-cog mr-2"></i>
                        Admin Panel
                    </h5>
                </div>
                
                <nav class="nav flex-column px-3">
                    <a class="nav-link" href="{{ route('admin.dashboard') }}">
                        <i class="fas fa-home mr-2"></i>Dashboard
                    </a>
                    <a class="nav-link active" href="{{ route('admin.users.index') }}">
                        <i class="fas fa-users mr-2"></i>Users
                    </a>
                    <a class="nav-link" href="{{ route('admin.drivers') }}">
                        <i class="fas fa-car mr-2"></i>Drivers
                    </a>
                    <a class="nav-link" href="{{ route('admin.rides.index') }}">
                        <i class="fas fa-route mr-2"></i>Rides
                    </a>
                    <a class="nav-link" href="{{ route('admin.reports') }}">
                        <i class="fas fa-chart-bar mr-2"></i>Reports
                    </a>
                </nav>
            </div>
        </div>

        <!-- Main Content -->
        <div class="col-md-9 col-lg-10">
            <div class="p-4">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>
                        <i class="fas fa-user mr-2 text-primary"></i>
                        User Details
                    </h2>
                    <a href="{{ route('admin.users.index') }}" class="btn btn-secondary">
                        <i class="fas fa-arrow-left mr-1"></i>Back to Users
                    </a>
                </div>

                <!-- User Details Card -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">
                            <i class="fas fa-info-circle mr-2"></i>
                            User Information
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <table class="table table-borderless">
                                    <tr>
                                        <td><strong>User ID:</strong></td>
                                        <td>#{{ $user->id }}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Name:</strong></td>
                                        <td>{{ $user->name }}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email:</strong></td>
                                        <td>{{ $user->email }}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Role:</strong></td>
                                        <td>
                                            <span class="badge badge-{{ $user->role == 'admin' ? 'danger' : ($user->role == 'driver' ? 'warning' : 'info') }}">
                                                {{ ucfirst($user->role) }}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Status:</strong></td>
                                        <td>
                                            <span class="badge badge-{{ $user->status == 'active' ? 'success' : 'secondary' }}">
                                                {{ ucfirst($user->status) }}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <table class="table table-borderless">
                                    <tr>
                                        <td><strong>Total Rides:</strong></td>
                                        <td>{{ $user->total_rides ?? 0 }}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Total Spent:</strong></td>
                                        <td>₹{{ $user->total_spent ?? 0 }}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Member Since:</strong></td>
                                        <td>{{ date('M d, Y') }}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Last Active:</strong></td>
                                        <td>{{ date('M d, Y H:i') }}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <h6>Actions:</h6>
                            @if($user->status == 'active')
                                <button class="btn btn-warning btn-sm mr-2">
                                    <i class="fas fa-ban mr-1"></i>Suspend User
                                </button>
                            @else
                                <button class="btn btn-success btn-sm mr-2">
                                    <i class="fas fa-check mr-1"></i>Activate User
                                </button>
                            @endif
                            <button class="btn btn-info btn-sm mr-2">
                                <i class="fas fa-envelope mr-1"></i>Send Message
                            </button>
                            <button class="btn btn-secondary btn-sm">
                                <i class="fas fa-edit mr-1"></i>Edit Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.sidebar {
    background: linear-gradient(135deg, #00D26A 0%, #28a745 100%);
    min-height: 100vh;
}

.nav-link {
    color: rgba(255, 255, 255, 0.8) !important;
    padding: 12px 20px;
    margin-bottom: 5px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.nav-link:hover, .nav-link.active {
    background-color: rgba(255, 255, 255, 0.1);
    color: white !important;
    transform: translateX(5px);
}

.card {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 12px;
}

.card-header {
    background: linear-gradient(135deg, #00D26A 0%, #28a745 100%);
    color: white;
    border-radius: 12px 12px 0 0 !important;
}

.btn-primary {
    background: linear-gradient(135deg, #00D26A 0%, #28a745 100%);
    border: none;
}

.btn-primary:hover {
    background: linear-gradient(135deg, #28a745 0%, #00D26A 100%);
    transform: translateY(-1px);
}
</style>
@endsection