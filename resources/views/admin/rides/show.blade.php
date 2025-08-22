@extends('layouts.app')

@section('title', 'Ride Details - Loyal Safar Admin')

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
                    <a class="nav-link" href="{{ route('admin.users.index') }}">
                        <i class="fas fa-users mr-2"></i>Users
                    </a>
                    <a class="nav-link" href="{{ route('admin.drivers') }}">
                        <i class="fas fa-car mr-2"></i>Drivers
                    </a>
                    <a class="nav-link active" href="{{ route('admin.rides.index') }}">
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
                        <i class="fas fa-route mr-2 text-primary"></i>
                        Ride Details #{{ $ride->id }}
                    </h2>
                    <a href="{{ route('admin.rides.index') }}" class="btn btn-secondary">
                        <i class="fas fa-arrow-left mr-1"></i>Back to Rides
                    </a>
                </div>

                <div class="row">
                    <!-- Ride Information -->
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">
                                    <i class="fas fa-info-circle mr-2"></i>
                                    Ride Information
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <table class="table table-borderless">
                                            <tr>
                                                <td><strong>Ride ID:</strong></td>
                                                <td>#{{ $ride->id }}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Passenger:</strong></td>
                                                <td>{{ $ride->passenger }}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Driver:</strong></td>
                                                <td>{{ $ride->driver }}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Status:</strong></td>
                                                <td>
                                                    @if($ride->status == 'completed')
                                                        <span class="badge badge-success">Completed</span>
                                                    @elseif($ride->status == 'pending')
                                                        <span class="badge badge-warning">Pending</span>
                                                    @else
                                                        <span class="badge badge-info">In Progress</span>
                                                    @endif
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div class="col-md-6">
                                        <table class="table table-borderless">
                                            <tr>
                                                <td><strong>Distance:</strong></td>
                                                <td>{{ $ride->distance }} km</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Duration:</strong></td>
                                                <td>{{ $ride->duration }} min</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Fare:</strong></td>
                                                <td>₹{{ $ride->fare }}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Commission:</strong></td>
                                                <td>₹{{ $ride->commission }}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Route Information -->
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">
                                    <i class="fas fa-map-marker-alt mr-2"></i>
                                    Route Details
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <strong>Pickup Location:</strong><br>
                                    <i class="fas fa-map-marker-alt text-success mr-1"></i>
                                    {{ $ride->pickup_location }}
                                </div>
                                <div class="mb-3">
                                    <strong>Dropoff Location:</strong><br>
                                    <i class="fas fa-map-marker-alt text-danger mr-1"></i>
                                    {{ $ride->dropoff_location }}
                                </div>
                                <div class="mb-3">
                                    <strong>Booking Time:</strong><br>
                                    {{ date('M d, Y H:i') }}
                                </div>
                                @if($ride->status == 'completed')
                                <div class="mb-3">
                                    <strong>Completion Time:</strong><br>
                                    {{ date('M d, Y H:i') }}
                                </div>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">
                                    <i class="fas fa-cogs mr-2"></i>
                                    Actions
                                </h5>
                            </div>
                            <div class="card-body">
                                @if($ride->status == 'pending')
                                    <button class="btn btn-danger mr-2">
                                        <i class="fas fa-times mr-1"></i>Cancel Ride
                                    </button>
                                    <button class="btn btn-warning mr-2">
                                        <i class="fas fa-car mr-1"></i>Assign Driver
                                    </button>
                                @endif
                                <button class="btn btn-info mr-2">
                                    <i class="fas fa-envelope mr-1"></i>Contact Passenger
                                </button>
                                <button class="btn btn-secondary mr-2">
                                    <i class="fas fa-envelope mr-1"></i>Contact Driver
                                </button>
                                <button class="btn btn-success">
                                    <i class="fas fa-download mr-1"></i>Download Receipt
                                </button>
                            </div>
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