@extends('layouts.app')

@section('title', 'Rides Management - Loyal Safar Admin')

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
                        Rides Management
                    </h2>
                </div>

                <!-- Rides List -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">
                            <i class="fas fa-list mr-2"></i>
                            All Rides
                        </h5>
                    </div>
                    <div class="card-body">
                        @if(count($rides) > 0)
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Ride ID</th>
                                            <th>Passenger</th>
                                            <th>Driver</th>
                                            <th>Route</th>
                                            <th>Fare</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($rides as $ride)
                                            <tr>
                                                <td>#{{ $ride['id'] }}</td>
                                                <td>
                                                    <i class="fas fa-user mr-1"></i>
                                                    {{ $ride['passenger'] }}
                                                </td>
                                                <td>
                                                    @if($ride['driver'])
                                                        <i class="fas fa-car mr-1"></i>
                                                        {{ $ride['driver'] }}
                                                    @else
                                                        <span class="text-muted">Not assigned</span>
                                                    @endif
                                                </td>
                                                <td>
                                                    <small>
                                                        <i class="fas fa-map-marker-alt text-success mr-1"></i>{{ $ride['pickup'] }}<br>
                                                        <i class="fas fa-map-marker-alt text-danger mr-1"></i>{{ $ride['dropoff'] }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <span class="badge badge-success">
                                                        ₹{{ $ride['fare'] }}
                                                    </span>
                                                </td>
                                                <td>
                                                    @if($ride['status'] == 'completed')
                                                        <span class="badge badge-success">
                                                            <i class="fas fa-check mr-1"></i>Completed
                                                        </span>
                                                    @elseif($ride['status'] == 'pending')
                                                        <span class="badge badge-warning">
                                                            <i class="fas fa-clock mr-1"></i>Pending
                                                        </span>
                                                    @elseif($ride['status'] == 'in_progress')
                                                        <span class="badge badge-info">
                                                            <i class="fas fa-car mr-1"></i>In Progress
                                                        </span>
                                                    @else
                                                        <span class="badge badge-secondary">
                                                            {{ ucfirst($ride['status']) }}
                                                        </span>
                                                    @endif
                                                </td>
                                                <td>
                                                    <a href="{{ route('admin.rides.show', $ride['id']) }}" class="btn btn-primary btn-sm">
                                                        <i class="fas fa-eye mr-1"></i>View
                                                    </a>
                                                    @if($ride['status'] == 'pending')
                                                        <button class="btn btn-danger btn-sm ml-1">
                                                            <i class="fas fa-times mr-1"></i>Cancel
                                                        </button>
                                                    @endif
                                                </td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        @else
                            <div class="text-center py-4">
                                <i class="fas fa-route fa-3x text-muted mb-3"></i>
                                <h5 class="text-muted">No rides found</h5>
                                <p class="text-muted">Rides will appear here as users book them.</p>
                            </div>
                        @endif
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

.table th {
    border-top: none;
    font-weight: 600;
    color: #495057;
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