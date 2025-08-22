@extends('layouts.app')

@section('title', 'Driver Leaderboard - Loyal Safar')

@section('content')
<div class="container-fluid">
    <div class="row">
        <!-- Driver Sidebar -->
        <div class="col-md-3 col-lg-2 px-0">
            <div class="sidebar">
                <div class="p-4">
                    <h5 class="text-white">
                        <i class="fas fa-car mr-2"></i>
                        Loyal Driver
                    </h5>
                    <small class="text-light opacity-75">Drive. Earn. Grow.</small>
                </div>
                
                <nav class="nav flex-column px-3">
                    <a class="nav-link" href="{{ route('driver.dashboard') }}">
                        <i class="fas fa-tachometer-alt mr-2"></i>Dashboard
                    </a>
                    <a class="nav-link" href="{{ route('driver.wallet') }}">
                        <i class="fas fa-wallet mr-2"></i>Wallet & Payouts
                    </a>
                    <a class="nav-link active" href="{{ route('driver.leaderboard') }}">
                        <i class="fas fa-trophy mr-2"></i>Leaderboard
                    </a>
                    <a class="nav-link" href="{{ route('driver.community') }}">
                        <i class="fas fa-users mr-2"></i>Driver Community
                    </a>
                    <a class="nav-link" href="{{ route('driver.profile') }}">
                        <i class="fas fa-user-edit mr-2"></i>Profile
                    </a>
                </nav>
            </div>
        </div>

        <!-- Main Content -->
        <div class="col-md-9 col-lg-10">
            <div class="p-4">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 class="mb-2">
                            <i class="fas fa-trophy mr-2" style="color: var(--loyal-primary)"></i>
                            Driver Leaderboard
                        </h2>
                        <p class="text-muted mb-0">Top performing drivers in Kolkata & Howrah</p>
                    </div>
                    
                    <div class="dropdown">
                        <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            <i class="fas fa-filter mr-2"></i>This Month
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">This Week</a></li>
                            <li><a class="dropdown-item" href="#">This Month</a></li>
                            <li><a class="dropdown-item" href="#">All Time</a></li>
                        </ul>
                    </div>
                </div>

                <!-- Top 3 Drivers -->
                <div class="row mb-4">
                    @foreach($leaderboard as $index => $driver)
                        @if($index < 3)
                            <div class="col-lg-4 col-md-6 mb-3">
                                <div class="card {{ $index == 0 ? 'border-warning' : ($index == 1 ? 'border-info' : 'border-success') }}">
                                    <div class="card-body text-center">
                                        <div class="mb-3">
                                            @if($index == 0)
                                                <i class="fas fa-crown fa-3x text-warning"></i>
                                            @elseif($index == 1)
                                                <i class="fas fa-medal fa-3x text-info"></i>
                                            @else
                                                <i class="fas fa-award fa-3x text-success"></i>
                                            @endif
                                        </div>
                                        <h5 class="card-title">{{ $driver['name'] }}</h5>
                                        <div class="row text-center">
                                            <div class="col-6">
                                                <h6 class="text-success mb-0">₹{{ number_format($driver['earnings']) }}</h6>
                                                <small class="text-muted">Earnings</small>
                                            </div>
                                            <div class="col-6">
                                                <h6 class="text-primary mb-0">{{ $driver['rides'] }}</h6>
                                                <small class="text-muted">Rides</small>
                                            </div>
                                        </div>
                                        <div class="mt-3">
                                            <span class="badge badge-{{ $index == 0 ? 'warning' : ($index == 1 ? 'info' : 'success') }} badge-lg">
                                                #{{ $index + 1 }} Position
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endif
                    @endforeach
                </div>

                <!-- Complete Leaderboard Table -->
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">
                            <i class="fas fa-list mr-2"></i>
                            Complete Rankings
                        </h5>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0">
                                <thead class="thead-light">
                                    <tr>
                                        <th class="px-4 py-3">Rank</th>
                                        <th class="py-3">Driver Name</th>
                                        <th class="py-3">Total Earnings</th>
                                        <th class="py-3">Total Rides</th>
                                        <th class="py-3">Avg. Per Ride</th>
                                        <th class="py-3">Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($leaderboard as $index => $driver)
                                        <tr class="{{ $driver['name'] == 'You' ? 'table-warning' : '' }}">
                                            <td class="px-4 py-3">
                                                <span class="font-weight-bold">
                                                    #{{ $index + 1 }}
                                                    @if($index < 3)
                                                        @if($index == 0)
                                                            <i class="fas fa-crown text-warning ml-1"></i>
                                                        @elseif($index == 1)
                                                            <i class="fas fa-medal text-info ml-1"></i>
                                                        @else
                                                            <i class="fas fa-award text-success ml-1"></i>
                                                        @endif
                                                    @endif
                                                </span>
                                            </td>
                                            <td class="py-3">
                                                <div class="d-flex align-items-center">
                                                    <div class="avatar-circle mr-3">
                                                        <i class="fas fa-user"></i>
                                                    </div>
                                                    <div>
                                                        <div class="font-weight-bold">{{ $driver['name'] }}</div>
                                                        @if($driver['name'] == 'You')
                                                            <small class="text-muted">Your Position</small>
                                                        @endif
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="py-3">
                                                <span class="text-success font-weight-bold">
                                                    ₹{{ number_format($driver['earnings']) }}
                                                </span>
                                            </td>
                                            <td class="py-3">
                                                <span class="font-weight-bold">{{ $driver['rides'] }}</span>
                                            </td>
                                            <td class="py-3">
                                                <span class="text-info">
                                                    ₹{{ $driver['rides'] > 0 ? number_format($driver['earnings'] / $driver['rides']) : '0' }}
                                                </span>
                                            </td>
                                            <td class="py-3">
                                                <div class="text-warning">
                                                    @for($i = 1; $i <= 5; $i++)
                                                        @if($i <= 4)
                                                            <i class="fas fa-star"></i>
                                                        @else
                                                            <i class="far fa-star"></i>
                                                        @endif
                                                    @endfor
                                                    <span class="ml-1 text-muted">4.5</span>
                                                </div>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Achievement Goals -->
                <div class="card mt-4">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0">
                            <i class="fas fa-target mr-2"></i>
                            Achievement Goals
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-4 col-md-6 mb-3">
                                <div class="achievement-card p-3 border rounded text-center">
                                    <i class="fas fa-star fa-2x text-warning mb-2"></i>
                                    <h6>Top 10 Driver</h6>
                                    <p class="text-muted small mb-2">Complete 50 more rides</p>
                                    <div class="progress" style="height: 8px;">
                                        <div class="progress-bar bg-warning" style="width: 20%"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-6 mb-3">
                                <div class="achievement-card p-3 border rounded text-center">
                                    <i class="fas fa-coins fa-2x text-success mb-2"></i>
                                    <h6>₹10,000 Earnings</h6>
                                    <p class="text-muted small mb-2">Earn ₹10,000 more</p>
                                    <div class="progress" style="height: 8px;">
                                        <div class="progress-bar bg-success" style="width: 0%"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-6 mb-3">
                                <div class="achievement-card p-3 border rounded text-center">
                                    <i class="fas fa-thumbs-up fa-2x text-info mb-2"></i>
                                    <h6>5 Star Rating</h6>
                                    <p class="text-muted small mb-2">Improve service quality</p>
                                    <div class="progress" style="height: 8px;">
                                        <div class="progress-bar bg-info" style="width: 90%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.avatar-circle {
    width: 40px;
    height: 40px;
    background: var(--loyal-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.achievement-card:hover {
    transform: translateY(-2px);
    transition: transform 0.2s;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.badge-lg {
    padding: 8px 12px;
    font-size: 0.875rem;
}
</style>
@endsection