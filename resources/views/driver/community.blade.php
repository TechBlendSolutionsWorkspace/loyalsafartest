@extends('layouts.app')

@section('title', 'Driver Community - Loyal Safar')

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
                    <a class="nav-link active" href="{{ route('driver.community') }}">
                        <i class="fas fa-users mr-2"></i>Driver Community
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
                            <i class="fas fa-users mr-2" style="color: var(--loyal-primary)"></i>
                            Driver Community
                        </h2>
                        <p class="text-muted mb-0">Connect with fellow drivers in Kolkata & Howrah</p>
                    </div>
                </div>

                <div class="row">
                    <!-- Announcements -->
                    <div class="col-lg-6 mb-4">
                        <div class="card">
                            <div class="card-header bg-primary text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-bullhorn mr-2"></i>
                                    Announcements
                                </h5>
                            </div>
                            <div class="card-body">
                                @foreach($communityData['announcements'] as $announcement)
                                    <div class="mb-3 pb-3 border-bottom">
                                        <h6 class="mb-2">{{ $announcement['title'] }}</h6>
                                        <p class="text-muted mb-1">{{ $announcement['content'] }}</p>
                                        <small class="text-muted">{{ $announcement['date'] }}</small>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    </div>

                    <!-- Driving Tips -->
                    <div class="col-lg-6 mb-4">
                        <div class="card">
                            <div class="card-header bg-success text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-lightbulb mr-2"></i>
                                    Driving Tips
                                </h5>
                            </div>
                            <div class="card-body">
                                @foreach($communityData['tips'] as $tip)
                                    <div class="mb-3 pb-3 border-bottom">
                                        <h6 class="mb-2">{{ $tip['title'] }}</h6>
                                        <p class="text-muted mb-0">{{ $tip['content'] }}</p>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    </div>

                    <!-- Community Forum -->
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header bg-info text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-comments mr-2"></i>
                                    Community Forum
                                </h5>
                            </div>
                            <div class="card-body">
                                @foreach($communityData['forum_posts'] as $post)
                                    <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                                        <div>
                                            <h6 class="mb-1">{{ $post['title'] }}</h6>
                                            <small class="text-muted">by {{ $post['author'] }} • {{ $post['time'] }}</small>
                                        </div>
                                        <div class="text-right">
                                            <span class="badge badge-secondary">{{ $post['replies'] }} replies</span>
                                        </div>
                                    </div>
                                @endforeach
                                
                                <div class="text-center mt-4">
                                    <button class="btn btn-outline-primary">
                                        <i class="fas fa-plus mr-2"></i>Start New Discussion
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