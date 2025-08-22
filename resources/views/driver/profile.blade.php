@extends('layouts.app')

@section('title', 'Driver Profile - Loyal Safar')

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
                    <a class="nav-link" href="{{ route('driver.leaderboard') }}">
                        <i class="fas fa-trophy mr-2"></i>Leaderboard
                    </a>
                    <a class="nav-link" href="{{ route('driver.community') }}">
                        <i class="fas fa-users mr-2"></i>Driver Community
                    </a>
                    <a class="nav-link active" href="{{ route('driver.profile') }}">
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
                            <i class="fas fa-user-edit mr-2" style="color: var(--loyal-primary)"></i>
                            Driver Profile
                        </h2>
                        <p class="text-muted mb-0">Manage your personal and vehicle information</p>
                    </div>
                </div>

                <div class="row">
                    <!-- Personal Information -->
                    <div class="col-lg-6 mb-4">
                        <div class="card">
                            <div class="card-header bg-primary text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-user mr-2"></i>
                                    Personal Information
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-12 mb-3">
                                        <label class="form-label text-muted">Full Name</label>
                                        <div class="form-control-plaintext font-weight-bold">{{ $user->name }}</div>
                                    </div>
                                    <div class="col-12 mb-3">
                                        <label class="form-label text-muted">Email Address</label>
                                        <div class="form-control-plaintext">{{ $user->email }}</div>
                                    </div>
                                    <div class="col-12 mb-3">
                                        <label class="form-label text-muted">Phone Number</label>
                                        <div class="form-control-plaintext">{{ $user->phone ?? '+91 98765 43210' }}</div>
                                    </div>
                                    <div class="col-6 mb-3">
                                        <label class="form-label text-muted">Driver License</label>
                                        <div class="form-control-plaintext">{{ $profileData['driver_license'] }}</div>
                                    </div>
                                    <div class="col-6 mb-3">
                                        <label class="form-label text-muted">Rating</label>
                                        <div class="form-control-plaintext">
                                            <span class="text-warning">
                                                @for($i = 1; $i <= 5; $i++)
                                                    @if($i <= floor($profileData['rating']))
                                                        <i class="fas fa-star"></i>
                                                    @elseif($i == ceil($profileData['rating']) && $profileData['rating'] - floor($profileData['rating']) >= 0.5)
                                                        <i class="fas fa-star-half-alt"></i>
                                                    @else
                                                        <i class="far fa-star"></i>
                                                    @endif
                                                @endfor
                                            </span>
                                            {{ number_format($profileData['rating'], 1) }}
                                        </div>
                                    </div>
                                </div>
                                <button class="btn btn-outline-primary btn-sm">
                                    <i class="fas fa-edit mr-2"></i>Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Vehicle Information -->
                    <div class="col-lg-6 mb-4">
                        <div class="card">
                            <div class="card-header bg-success text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-car mr-2"></i>
                                    Vehicle Information
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-12 mb-3">
                                        <label class="form-label text-muted">Vehicle Type</label>
                                        <div class="form-control-plaintext font-weight-bold">{{ $profileData['vehicle_type'] }}</div>
                                    </div>
                                    <div class="col-12 mb-3">
                                        <label class="form-label text-muted">Vehicle Model</label>
                                        <div class="form-control-plaintext">{{ $profileData['vehicle_model'] }}</div>
                                    </div>
                                    <div class="col-6 mb-3">
                                        <label class="form-label text-muted">Registration Number</label>
                                        <div class="form-control-plaintext">{{ $profileData['vehicle_registration'] }}</div>
                                    </div>
                                    <div class="col-6 mb-3">
                                        <label class="form-label text-muted">Color</label>
                                        <div class="form-control-plaintext">{{ $profileData['vehicle_color'] }}</div>
                                    </div>
                                    <div class="col-6 mb-3">
                                        <label class="form-label text-muted">Joining Date</label>
                                        <div class="form-control-plaintext">{{ $profileData['joining_date'] }}</div>
                                    </div>
                                    <div class="col-6 mb-3">
                                        <label class="form-label text-muted">Total Trips</label>
                                        <div class="form-control-plaintext">{{ $profileData['total_trips'] }}</div>
                                    </div>
                                </div>
                                <button class="btn btn-outline-success btn-sm">
                                    <i class="fas fa-car mr-2"></i>Update Vehicle
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Documents Status -->
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header bg-info text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-file-alt mr-2"></i>
                                    Documents Status
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    @foreach($profileData['documents'] as $docName => $docInfo)
                                        <div class="col-lg-3 col-md-6 mb-3">
                                            <div class="border rounded p-3 text-center">
                                                <h6 class="mb-2">{{ ucfirst($docName) }}</h6>
                                                @if($docInfo['status'] == 'verified')
                                                    <span class="badge badge-success mb-2">
                                                        <i class="fas fa-check mr-1"></i>Verified
                                                    </span>
                                                @else
                                                    <span class="badge badge-warning mb-2">
                                                        <i class="fas fa-clock mr-1"></i>Pending
                                                    </span>
                                                @endif
                                                <div class="small text-muted">
                                                    Expires: {{ $docInfo['expiry'] }}
                                                </div>
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                                <div class="text-center mt-3">
                                    <button class="btn btn-outline-info">
                                        <i class="fas fa-upload mr-2"></i>Upload Documents
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection