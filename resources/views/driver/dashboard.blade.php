@extends('layouts.app')

@section('title', 'Driver Dashboard - Loyal Safar')

@section('content')
<div class="container-fluid">
    <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 px-0">
            <div class="sidebar">
                <div class="p-4">
                    <h5 class="text-white">
                        <i class="fas fa-tachometer-alt mr-2"></i>
                        Driver Panel
                    </h5>
                </div>
                
                <nav class="nav flex-column px-3">
                    <a class="nav-link active" href="{{ route('driver.dashboard') }}">
                        <i class="fas fa-home mr-2"></i>Dashboard
                    </a>
                    <a class="nav-link" href="{{ route('driver.rides') }}">
                        <i class="fas fa-route mr-2"></i>My Rides
                    </a>
                    <a class="nav-link" href="{{ route('driver.wallet') }}">
                        <i class="fas fa-wallet mr-2"></i>Wallet
                    </a>
                    <a class="nav-link" href="{{ route('driver.leaderboard') }}">
                        <i class="fas fa-trophy mr-2"></i>Leaderboard
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
                        Driver Dashboard
                    </h2>
                    
                    <!-- Driver Status Toggle -->
                    <div class="driver-status">
                        <div class="custom-control custom-switch">
                            <input type="checkbox" 
                                   class="custom-control-input" 
                                   id="driverStatus" 
                                   {{ $driver && $driver->is_online ? 'checked' : '' }}>
                            <label class="custom-control-label" for="driverStatus">
                                <span class="status-text">
                                    {{ $driver && $driver->is_online ? 'Online' : 'Offline' }}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Statistics Cards -->
                <div class="row mb-4">
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card earnings-card">
                            <div class="card-body text-center">
                                <i class="fas fa-dollar-sign fa-2x mb-2"></i>
                                <h3 class="display-6 font-weight-bold">₹{{ number_format($stats['total_earnings'], 2) }}</h3>
                                <p class="mb-0">Total Earnings</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card bg-success text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-route fa-2x mb-2"></i>
                                <h3 class="display-6 font-weight-bold">{{ $stats['total_rides'] }}</h3>
                                <p class="mb-0">Total Rides</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card bg-warning text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-star fa-2x mb-2"></i>
                                <h3 class="display-6 font-weight-bold">{{ number_format($stats['rating'], 1) }}</h3>
                                <p class="mb-0">Rating</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card bg-info text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-circle fa-2x mb-2"></i>
                                <h3 class="display-6 font-weight-bold">{{ ucfirst($stats['status']) }}</h3>
                                <p class="mb-0">Status</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Current Activity -->
                <div class="row">
                    <!-- Pending Ride Requests -->
                    <div class="col-lg-8 mb-4">
                        <div class="card">
                            <div class="card-header bg-primary text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-bell mr-2"></i>
                                    Pending Ride Requests
                                    <span class="badge badge-light ml-2">{{ count($pendingRides) }}</span>
                                </h5>
                            </div>
                            <div class="card-body">
                                @if(count($pendingRides) > 0)
                                    <div id="rideRequests">
                                        @foreach($pendingRides as $ride)
                                            <div class="ride-request-card mb-3 p-3 border rounded">
                                                <div class="row align-items-center">
                                                    <div class="col-md-6">
                                                        <h6 class="mb-1">
                                                            <i class="fas fa-map-marker-alt text-success mr-1"></i>
                                                            {{ Str::limit($ride['pickup'], 30) }}
                                                        </h6>
                                                        <p class="text-muted mb-1">
                                                            <i class="fas fa-flag-checkered text-danger mr-1"></i>
                                                            {{ Str::limit($ride['dropoff'], 30) }}
                                                        </p>
                                                        <p class="text-muted mb-0">
                                                            <small>
                                                                <i class="fas fa-clock mr-1"></i>
                                                                {{ $ride['distance'] }}
                                                            </small>
                                                        </p>
                                                    </div>
                                                    <div class="col-md-3 text-center">
                                                        <h5 class="text-success mb-0">₹{{ number_format($ride['fare'], 2) }}</h5>
                                                        <small class="text-muted">Estimated Fare</small>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <button class="btn btn-success btn-sm btn-block accept-ride" 
                                                                data-ride-id="{{ $ride['id'] }}">
                                                            <i class="fas fa-check mr-1"></i>Accept
                                                        </button>
                                                        <button class="btn btn-outline-secondary btn-sm btn-block mt-1 decline-ride" 
                                                                data-ride-id="{{ $ride['id'] }}">
                                                            <i class="fas fa-times mr-1"></i>Decline
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                @else
                                    <div class="text-center py-4">
                                        <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                                        <p class="text-muted">No pending ride requests</p>
                                        <p class="text-muted">
                                            <small>Make sure you're online to receive ride requests</small>
                                        </p>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="col-lg-4 mb-4">
                        <div class="card">
                            <div class="card-header bg-secondary text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-history mr-2"></i>Recent Rides
                                </h5>
                            </div>
                            <div class="card-body">
                                @if(count($recentRides) > 0)
                                    @foreach($recentRides as $ride)
                                        <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                            <div>
                                                <h6 class="mb-1">{{ $ride['passenger'] }}</h6>
                                                <p class="text-muted mb-0">
                                                    <small>
                                                        <span class="status-badge badge badge-{{ $ride['status'] == 'completed' ? 'success' : 'warning' }}">
                                                            {{ ucfirst(str_replace('_', ' ', $ride['status'])) }}
                                                        </span>
                                                    </small>
                                                </p>
                                            </div>
                                            <div class="text-right">
                                                <h6 class="mb-0 text-success">₹{{ number_format($ride['fare'], 2) }}</h6>
                                                <small class="text-muted">{{ $ride['date'] }}</small>
                                            </div>
                                        </div>
                                    @endforeach
                                @else
                                    <div class="text-center py-3">
                                        <i class="fas fa-history fa-2x text-muted mb-2"></i>
                                        <p class="text-muted mb-0">No recent rides</p>
                                    </div>
                                @endif
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
<script>
    $(document).ready(function() {
        // Driver status toggle
        $('#driverStatus').change(function() {
            const isOnline = $(this).is(':checked');
            
            $.post('{{ route("driver.toggle-status") }}', {
                _token: '{{ csrf_token() }}'
            })
            .done(function(response) {
                $('.status-text').text(response.status.charAt(0).toUpperCase() + response.status.slice(1));
                showToast(response.message, 'success');
                
                // Update page elements based on status
                if (response.status === 'online') {
                    startLocationTracking();
                    startRideRequestPolling();
                } else {
                    stopLocationTracking();
                    stopRideRequestPolling();
                }
            })
            .fail(function() {
                showToast('Failed to update status', 'danger');
                $(this).prop('checked', !isOnline);
            });
        });
        
        // Accept ride
        $(document).on('click', '.accept-ride', function() {
            const rideId = $(this).data('ride-id');
            const $card = $(this).closest('.ride-request-card');
            
            $.post(`/driver/rides/${rideId}/accept`, {
                _token: '{{ csrf_token() }}'
            })
            .done(function(response) {
                $card.fadeOut();
                showToast('Ride accepted successfully!', 'success');
                // Redirect to ride details
                setTimeout(() => {
                    window.location.href = `/driver/rides/${rideId}`;
                }, 1000);
            })
            .fail(function() {
                showToast('Failed to accept ride', 'danger');
            });
        });
        
        // Decline ride
        $(document).on('click', '.decline-ride', function() {
            const rideId = $(this).data('ride-id');
            const $card = $(this).closest('.ride-request-card');
            
            $.post(`/driver/rides/${rideId}/decline`, {
                _token: '{{ csrf_token() }}'
            })
            .done(function(response) {
                $card.fadeOut();
                showToast('Ride declined', 'info');
            })
            .fail(function() {
                showToast('Failed to decline ride', 'danger');
            });
        });
        
        // Location tracking
        let locationWatchId;
        
        function startLocationTracking() {
            if (navigator.geolocation) {
                locationWatchId = navigator.geolocation.watchPosition(
                    function(position) {
                        updateLocation(position.coords.latitude, position.coords.longitude);
                    },
                    function(error) {
                        console.error('Location error:', error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 30000
                    }
                );
            }
        }
        
        function stopLocationTracking() {
            if (locationWatchId) {
                navigator.geolocation.clearWatch(locationWatchId);
            }
        }
        
        function updateLocation(latitude, longitude) {
            $.post('{{ route("driver.update-location") }}', {
                latitude: latitude,
                longitude: longitude,
                _token: '{{ csrf_token() }}'
            });
        }
        
        // Ride request polling
        let ridePollingInterval;
        
        function startRideRequestPolling() {
            ridePollingInterval = setInterval(function() {
                fetchNearbyRides();
            }, 30000); // Every 30 seconds
        }
        
        function stopRideRequestPolling() {
            if (ridePollingInterval) {
                clearInterval(ridePollingInterval);
            }
        }
        
        function fetchNearbyRides() {
            $.get('/api/driver/nearby-rides')
            .done(function(response) {
                if (response.rides && response.rides.length > 0) {
                    // Update ride requests section
                    updateRideRequests(response.rides);
                }
            });
        }
        
        function updateRideRequests(rides) {
            // Implementation for updating ride requests in real-time
            console.log('New rides available:', rides);
        }
        
        // Initialize if driver is online
        @if($driver && $driver->is_online)
            startLocationTracking();
            startRideRequestPolling();
        @endif
    });
</script>
@endpush