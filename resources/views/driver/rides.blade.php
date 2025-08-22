@extends('layouts.app')

@section('title', 'My Rides - Loyal Safar')

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
                    <a class="nav-link" href="{{ route('driver.dashboard') }}">
                        <i class="fas fa-home mr-2"></i>Dashboard
                    </a>
                    <a class="nav-link active" href="{{ route('driver.rides') }}">
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
                        <i class="fas fa-route mr-2 text-primary"></i>
                        My Rides
                    </h2>
                </div>

                <!-- Rides List -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">
                            <i class="fas fa-list mr-2"></i>
                            Recent Rides
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
                                            <th>Pickup</th>
                                            <th>Dropoff</th>
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
                                                    <i class="fas fa-map-marker-alt text-success mr-1"></i>
                                                    {{ $ride['pickup'] }}
                                                </td>
                                                <td>
                                                    <i class="fas fa-map-marker-alt text-danger mr-1"></i>
                                                    {{ $ride['dropoff'] }}
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
                                                    @else
                                                        <span class="badge badge-info">
                                                            <i class="fas fa-car mr-1"></i>In Progress
                                                        </span>
                                                    @endif
                                                </td>
                                                <td>
                                                    @if($ride['status'] == 'pending')
                                                        <button class="btn btn-primary btn-sm accept-ride" data-ride-id="{{ $ride['id'] }}">
                                                            <i class="fas fa-check mr-1"></i>Accept
                                                        </button>
                                                    @elseif($ride['status'] == 'in_progress')
                                                        <button class="btn btn-success btn-sm complete-ride" data-ride-id="{{ $ride['id'] }}">
                                                            <i class="fas fa-flag-checkered mr-1"></i>Complete
                                                        </button>
                                                    @else
                                                        <button class="btn btn-secondary btn-sm" disabled>
                                                            <i class="fas fa-eye mr-1"></i>View
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
                                <p class="text-muted">Start accepting rides to see them here!</p>
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

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Accept ride functionality
    document.querySelectorAll('.accept-ride').forEach(button => {
        button.addEventListener('click', function() {
            const rideId = this.dataset.rideId;
            
            if (confirm('Accept this ride?')) {
                fetch(`/driver/accept-ride/${rideId}`, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Ride accepted successfully!');
                        location.reload();
                    }
                })
                .catch(error => {
                    alert('Error accepting ride. Please try again.');
                });
            }
        });
    });

    // Complete ride functionality
    document.querySelectorAll('.complete-ride').forEach(button => {
        button.addEventListener('click', function() {
            const rideId = this.dataset.rideId;
            
            if (confirm('Mark this ride as completed?')) {
                fetch(`/driver/complete-ride/${rideId}`, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Ride completed successfully!');
                        location.reload();
                    }
                })
                .catch(error => {
                    alert('Error completing ride. Please try again.');
                });
            }
        });
    });
});
</script>
@endsection