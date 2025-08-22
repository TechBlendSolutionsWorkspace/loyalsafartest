@extends('layouts.app')

@section('title', 'Admin Dashboard - Loyal Safar')

@section('content')
<div class="container-fluid">
    <div class="row">
        <!-- Admin Sidebar -->
        <div class="col-md-3 col-lg-2 px-0">
            <div class="sidebar">
                <div class="p-4">
                    <h5 class="text-white">
                        <i class="fas fa-cogs mr-2"></i>
                        Admin Panel
                    </h5>
                </div>
                
                <nav class="nav flex-column px-3">
                    <a class="nav-link active" href="{{ route('admin.dashboard') }}">
                        <i class="fas fa-tachometer-alt mr-2"></i>Dashboard
                    </a>
                    <a class="nav-link" href="{{ route('admin.users.index') }}">
                        <i class="fas fa-users mr-2"></i>User Management
                    </a>
                    <a class="nav-link" href="{{ route('admin.drivers') }}">
                        <i class="fas fa-car mr-2"></i>Driver Management
                    </a>
                    <a class="nav-link" href="{{ route('admin.rides.index') }}">
                        <i class="fas fa-route mr-2"></i>Ride Management
                    </a>
                    <a class="nav-link" href="{{ route('admin.reports') }}">
                        <i class="fas fa-chart-bar mr-2"></i>Reports & Analytics
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
                        <i class="fas fa-tachometer-alt mr-2 text-primary"></i>
                        Admin Dashboard
                    </h2>
                    <div class="text-muted">
                        <i class="fas fa-calendar mr-1"></i>
                        {{ now()->format('l, F j, Y') }}
                    </div>
                </div>

                <!-- Statistics Cards Row 1 -->
                <div class="row mb-4">
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card bg-primary text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-users fa-2x mb-2"></i>
                                <h3 class="display-6 font-weight-bold" data-counter="{{ $stats['total_users'] }}">0</h3>
                                <p class="mb-0">Total Users</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card bg-success text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-car fa-2x mb-2"></i>
                                <h3 class="display-6 font-weight-bold" data-counter="{{ $stats['total_drivers'] }}">0</h3>
                                <p class="mb-0">Total Drivers</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card bg-warning text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-user-friends fa-2x mb-2"></i>
                                <h3 class="display-6 font-weight-bold" data-counter="{{ $stats['total_passengers'] }}">0</h3>
                                <p class="mb-0">Total Passengers</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card bg-info text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-circle fa-2x mb-2 text-success"></i>
                                <h3 class="display-6 font-weight-bold" data-counter="{{ $stats['active_drivers'] }}">0</h3>
                                <p class="mb-0">Active Drivers</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistics Cards Row 2 -->
                <div class="row mb-4">
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card earnings-card">
                            <div class="card-body text-center">
                                <i class="fas fa-route fa-2x mb-2"></i>
                                <h3 class="display-6 font-weight-bold" data-counter="{{ $stats['total_rides'] }}">0</h3>
                                <p class="mb-0">Total Rides</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card bg-success text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-check-circle fa-2x mb-2"></i>
                                <h3 class="display-6 font-weight-bold" data-counter="{{ $stats['completed_rides'] }}">0</h3>
                                <p class="mb-0">Completed Rides</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card bg-dark text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-rupee-sign fa-2x mb-2"></i>
                                <h3 class="display-6 font-weight-bold">₹{{ number_format($stats['total_revenue'], 0) }}</h3>
                                <p class="mb-0">Total Revenue</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card bg-danger text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-calendar-day fa-2x mb-2"></i>
                                <h3 class="display-6 font-weight-bold" data-counter="{{ $stats['today_rides'] }}">0</h3>
                                <p class="mb-0">Today's Rides</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Dashboard Content -->
                <div class="row">
                    <!-- Recent Rides -->
                    <div class="col-lg-8 mb-4">
                        <div class="card">
                            <div class="card-header bg-primary text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-clock mr-2"></i>
                                    Recent Rides
                                    <span class="badge badge-light ml-2">{{ count($recentRides) }}</span>
                                </h5>
                            </div>
                            <div class="card-body">
                                @if(count($recentRides) > 0)
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Passenger</th>
                                                    <th>Driver</th>
                                                    <th>Route</th>
                                                    <th>Fare</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                @foreach($recentRides as $ride)
                                                    <tr>
                                                        <td>
                                                            <div class="d-flex align-items-center">
                                                                @if($ride->passenger->avatar)
                                                                    <img src="{{ $ride->passenger->avatar }}" class="driver-avatar mr-2" alt="Avatar">
                                                                @else
                                                                    <div class="bg-secondary rounded-circle mr-2 d-flex align-items-center justify-content-center" style="width: 35px; height: 35px;">
                                                                        <i class="fas fa-user text-white"></i>
                                                                    </div>
                                                                @endif
                                                                <div>
                                                                    <div class="font-weight-bold">{{ $ride->passenger->name }}</div>
                                                                    <small class="text-muted">{{ $ride->passenger->phone }}</small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            @if($ride->driver)
                                                                <div class="d-flex align-items-center">
                                                                    @if($ride->driver->avatar)
                                                                        <img src="{{ $ride->driver->avatar }}" class="driver-avatar mr-2" alt="Avatar">
                                                                    @else
                                                                        <div class="bg-secondary rounded-circle mr-2 d-flex align-items-center justify-content-center" style="width: 35px; height: 35px;">
                                                                            <i class="fas fa-user text-white"></i>
                                                                        </div>
                                                                    @endif
                                                                    <div>
                                                                        <div class="font-weight-bold">{{ $ride->driver->name }}</div>
                                                                        <small class="text-muted">{{ $ride->driver->phone }}</small>
                                                                    </div>
                                                                </div>
                                                            @else
                                                                <span class="text-muted">Not Assigned</span>
                                                            @endif
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <i class="fas fa-map-marker-alt text-success mr-1"></i>
                                                                <small>{{ Str::limit($ride->pickup_address, 20) }}</small>
                                                            </div>
                                                            <div>
                                                                <i class="fas fa-flag-checkered text-danger mr-1"></i>
                                                                <small>{{ Str::limit($ride->destination_address, 20) }}</small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span class="font-weight-bold text-success">
                                                                ₹{{ number_format($ride->actual_fare ?? $ride->estimated_fare, 2) }}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span class="status-badge badge badge-{{ 
                                                                $ride->status == 'completed' ? 'success' : 
                                                                ($ride->status == 'pending' ? 'warning' : 
                                                                ($ride->status == 'cancelled' ? 'danger' : 'info')) 
                                                            }}">
                                                                {{ ucfirst(str_replace('_', ' ', $ride->status)) }}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div>{{ $ride->created_at->format('M d, Y') }}</div>
                                                            <small class="text-muted">{{ $ride->created_at->format('h:i A') }}</small>
                                                        </td>
                                                        <td>
                                                            <a href="{{ route('admin.rides.show', $ride->id) }}" class="btn btn-sm btn-outline-primary">
                                                                <i class="fas fa-eye"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                @endforeach
                                            </tbody>
                                        </table>
                                    </div>
                                @else
                                    <div class="text-center py-4">
                                        <i class="fas fa-route fa-3x text-muted mb-3"></i>
                                        <p class="text-muted">No recent rides found</p>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>

                    <!-- Recent Users & Quick Actions -->
                    <div class="col-lg-4 mb-4">
                        <!-- Quick Actions -->
                        <div class="card mb-4">
                            <div class="card-header bg-secondary text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-bolt mr-2"></i>Quick Actions
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="d-grid gap-2">
                                    <a href="{{ route('admin.users.index') }}" class="btn btn-primary btn-sm">
                                        <i class="fas fa-users mr-2"></i>Manage Users
                                    </a>
                                    <a href="{{ route('admin.drivers') }}" class="btn btn-success btn-sm">
                                        <i class="fas fa-car mr-2"></i>Approve Drivers
                                    </a>
                                    <a href="{{ route('admin.reports') }}" class="btn btn-info btn-sm">
                                        <i class="fas fa-chart-bar mr-2"></i>View Reports
                                    </a>
                                    <a href="{{ route('admin.rides.index') }}" class="btn btn-warning btn-sm">
                                        <i class="fas fa-route mr-2"></i>Monitor Rides
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Recent Users -->
                        <div class="card">
                            <div class="card-header bg-dark text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-user-plus mr-2"></i>Recent Users
                                </h5>
                            </div>
                            <div class="card-body">
                                @if(count($recentUsers) > 0)
                                    @foreach($recentUsers as $user)
                                        <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                            <div class="d-flex align-items-center">
                                                @if($user->avatar)
                                                    <img src="{{ $user->avatar }}" class="driver-avatar mr-2" alt="Avatar">
                                                @else
                                                    <div class="bg-secondary rounded-circle mr-2 d-flex align-items-center justify-content-center" style="width: 35px; height: 35px;">
                                                        <i class="fas fa-user text-white"></i>
                                                    </div>
                                                @endif
                                                <div>
                                                    <h6 class="mb-0">{{ $user->name }}</h6>
                                                    <small class="text-muted">
                                                        <span class="badge badge-{{ $user->role == 'driver' ? 'success' : ($user->role == 'admin' ? 'danger' : 'primary') }}">
                                                            {{ ucfirst($user->role) }}
                                                        </span>
                                                    </small>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <small class="text-muted">{{ $user->created_at->diffForHumans() }}</small>
                                            </div>
                                        </div>
                                    @endforeach
                                @else
                                    <div class="text-center py-3">
                                        <i class="fas fa-user-plus fa-2x text-muted mb-2"></i>
                                        <p class="text-muted mb-0">No recent users</p>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Row -->
                <div class="row">
                    <div class="col-lg-6 mb-4">
                        <div class="card">
                            <div class="card-header bg-info text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-chart-line mr-2"></i>Rides Trend (Last 7 Days)
                                </h5>
                            </div>
                            <div class="card-body">
                                <canvas id="ridesChart" height="300"></canvas>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6 mb-4">
                        <div class="card">
                            <div class="card-header bg-success text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-chart-pie mr-2"></i>User Distribution
                                </h5>
                            </div>
                            <div class="card-body">
                                <canvas id="usersChart" height="300"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    $(document).ready(function() {
        // Counter animation
        function animateCounter() {
            $('[data-counter]').each(function() {
                const $this = $(this);
                const countTo = parseInt($this.attr('data-counter'));
                
                $({ countNum: 0 }).animate({
                    countNum: countTo
                }, {
                    duration: 2000,
                    easing: 'linear',
                    step: function() {
                        $this.text(Math.floor(this.countNum).toLocaleString());
                    },
                    complete: function() {
                        $this.text(countTo.toLocaleString());
                    }
                });
            });
        }
        
        animateCounter();

        // Rides Trend Chart
        const ctx1 = document.getElementById('ridesChart').getContext('2d');
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
                datasets: [{
                    label: 'Rides',
                    data: [12, 19, 15, 25, 22, 30, 28],
                    borderColor: 'rgb(23, 162, 184)',
                    backgroundColor: 'rgba(23, 162, 184, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Users Distribution Chart
        const ctx2 = document.getElementById('usersChart').getContext('2d');
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Passengers', 'Drivers', 'Admins'],
                datasets: [{
                    data: [{{ $stats['total_passengers'] }}, {{ $stats['total_drivers'] }}, {{ $stats['total_users'] - $stats['total_passengers'] - $stats['total_drivers'] }}],
                    backgroundColor: [
                        'rgb(0, 123, 255)',
                        'rgb(40, 167, 69)',
                        'rgb(220, 53, 69)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    });
</script>
@endpush