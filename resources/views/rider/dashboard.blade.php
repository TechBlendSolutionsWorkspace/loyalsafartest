@extends('layouts.app')

@section('title', 'Rider Dashboard - Loyal Safar')

@section('content')
<div class="container-fluid">
    <div class="row">
        <!-- Sidebar -->
        <nav class="col-md-3 col-lg-2 d-md-block sidebar collapse">
            <div class="sidebar-sticky p-3">
                <h6 class="text-white mb-3">
                    <i class="fas fa-user mr-2" style="color: var(--indrive-green);"></i>
                    {{ auth()->user()->name }}
                </h6>
                
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link active" href="{{ route('rider.dashboard') }}">
                            <i class="fas fa-tachometer-alt mr-2"></i>Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('rider.book-ride') }}">
                            <i class="fas fa-plus mr-2"></i>Book Ride
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" onclick="showRideHistory()">
                            <i class="fas fa-history mr-2"></i>Ride History
                        </a>
                    </li>
                </ul>
            </div>
        </nav>

        <!-- Main Content -->
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2" style="color: var(--indrive-dark);">
                    <i class="fas fa-tachometer-alt mr-2" style="color: var(--indrive-green);"></i>
                    Welcome to Loyal Safar
                </h1>
                <div class="btn-toolbar mb-2 mb-md-0">
                    <div class="btn-group mr-2">
                        <button class="btn btn-ride" onclick="quickBookRide()">
                            <i class="fas fa-plus mr-2"></i>Quick Book
                        </button>
                    </div>
                </div>
            </div>

            @if(session('success'))
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    {{ session('success') }}
                    <button type="button" class="close" data-dismiss="alert">
                        <span>&times;</span>
                    </button>
                </div>
            @endif

            <!-- Quick Stats -->
            <div class="row mb-4">
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card payout-card h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-uppercase mb-1" style="color: var(--indrive-dark);">
                                        Total Rides
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold" style="color: var(--indrive-dark);">0</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-route fa-2x" style="color: var(--indrive-green);"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card payout-card h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-uppercase mb-1" style="color: var(--indrive-dark);">
                                        Total Spent
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold" style="color: var(--indrive-dark);">₹0</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-rupee-sign fa-2x" style="color: var(--indrive-green);"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card payout-card h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-uppercase mb-1" style="color: var(--indrive-dark);">
                                        Favorite Driver
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold" style="color: var(--indrive-dark);">None</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-star fa-2x" style="color: var(--indrive-green);"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card payout-card h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-uppercase mb-1" style="color: var(--indrive-dark);">
                                        Savings with Coupons
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold" style="color: var(--indrive-dark);">₹0</div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-tags fa-2x" style="color: var(--indrive-green);"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Book Section -->
            <div class="row">
                <div class="col-lg-8 mb-4">
                    <div class="card payout-card">
                        <div class="card-header" style="background: var(--indrive-green); color: var(--indrive-white);">
                            <h6 class="m-0 font-weight-bold">
                                <i class="fas fa-map-marker-alt mr-2"></i>Quick Book a Ride
                            </h6>
                        </div>
                        <div class="card-body">
                            <form id="quickBookForm">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">From</label>
                                        <input type="text" class="form-control" placeholder="Enter pickup location" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">To</label>
                                        <input type="text" class="form-control" placeholder="Enter destination" required>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Ride Type</label>
                                        <select class="form-control">
                                            <option>Economy</option>
                                            <option>Premium</option>
                                            <option>Shared</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">When</label>
                                        <select class="form-control">
                                            <option>Now</option>
                                            <option>Schedule for later</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button type="button" class="btn btn-ride btn-lg" onclick="window.location.href='{{ route('rider.book-ride') }}'">
                                        <i class="fas fa-search mr-2"></i>Find Rides
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4 mb-4">
                    <div class="card payout-card">
                        <div class="card-header" style="background: var(--indrive-green); color: var(--indrive-white);">
                            <h6 class="m-0 font-weight-bold">
                                <i class="fas fa-tags mr-2"></i>Available Coupons
                            </h6>
                        </div>
                        <div class="card-body">
                            <div class="text-center py-4">
                                <i class="fas fa-gift fa-3x mb-3" style="color: var(--indrive-green);"></i>
                                <p class="text-muted">No active coupons</p>
                                <small class="text-muted">Check back later for exciting offers!</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="card payout-card mb-4">
                <div class="card-header" style="background: var(--indrive-green); color: var(--indrive-white);">
                    <h6 class="m-0 font-weight-bold">
                        <i class="fas fa-clock mr-2"></i>Recent Activity
                    </h6>
                </div>
                <div class="card-body">
                    <div class="text-center py-4">
                        <i class="fas fa-history fa-3x mb-3" style="color: var(--indrive-green);"></i>
                        <p class="text-muted">No recent rides</p>
                        <a href="{{ route('rider.book-ride') }}" class="btn btn-ride">
                            <i class="fas fa-plus mr-2"></i>Book Your First Ride
                        </a>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<script>
function quickBookRide() {
    window.location.href = '{{ route("rider.book-ride") }}';
}

function showRideHistory() {
    // Implementation for ride history modal/page
    alert('Ride history feature coming soon!');
}

// Auto-refresh dashboard data every 30 seconds
setInterval(function() {
    // This would typically make an AJAX call to refresh stats
    console.log('Dashboard auto-refresh');
}, 30000);
</script>
@endsection