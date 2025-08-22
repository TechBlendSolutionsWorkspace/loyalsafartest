@extends('layouts.app')

@section('title', 'Welcome to Loyal Safar - Your Trusted Ride Partner')

@section('content')
<!-- Hero Section -->
<section class="hero-section text-white py-5" style="background: var(--indrive-gradient)">
    <div class="container">
        <div class="row align-items-center min-vh-50">
            <div class="col-lg-6">
                <h1 class="display-4 font-weight-bold mb-4">
                    Loyal Safar - Your Trusted Ride Partner
                </h1>
                <p class="lead mb-4">
                    Professional taxi booking platform for Kolkata/Howrah with advanced commission management, 
                    driver wallets, and eco-friendly transportation solutions.
                </p>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <a href="{{ route('register') }}?role=driver" class="btn btn-light btn-lg btn-block">
                            <i class="fas fa-car mr-2"></i>
                            Join as Driver
                        </a>
                    </div>
                    <div class="col-md-6 mb-3">
                        <a href="{{ route('register') }}?role=passenger" class="btn btn-outline-light btn-lg btn-block">
                            <i class="fas fa-user mr-2"></i>
                            Book a Ride
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="hero-image text-center">
                    <i class="fas fa-route display-1 mb-4"></i>
                    <div class="row text-center">
                        <div class="col-4">
                            <i class="fas fa-mobile-alt fa-3x mb-2"></i>
                            <p><small>Mobile Optimized</small></p>
                        </div>
                        <div class="col-4">
                            <i class="fas fa-map-marked-alt fa-3x mb-2"></i>
                            <p><small>GPS Tracking</small></p>
                        </div>
                        <div class="col-4">
                            <i class="fas fa-shield-alt fa-3x mb-2"></i>
                            <p><small>Secure Payments</small></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="py-5">
    <div class="container">
        <div class="row text-center mb-5">
            <div class="col-12">
                <h2 class="display-5 font-weight-bold">Platform Features</h2>
                <p class="lead text-muted">Everything you need for a complete ride-booking solution</p>
            </div>
        </div>
        
        <div class="row">
            <!-- Driver Features -->
            <div class="col-lg-4 mb-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body text-center p-4">
                        <div class="feature-icon mb-3">
                            <i class="fas fa-tachometer-alt fa-3x text-primary"></i>
                        </div>
                        <h5 class="card-title">Driver Dashboard</h5>
                        <p class="card-text">
                            Comprehensive dashboard with earnings tracking, ride history, 
                            and real-time ride requests.
                        </p>
                        <ul class="list-unstyled text-left">
                            <li><i class="fas fa-check text-success mr-2"></i>Real-time ride matching</li>
                            <li><i class="fas fa-check text-success mr-2"></i>Earnings analytics</li>
                            <li><i class="fas fa-check text-success mr-2"></i>Route optimization</li>
                            <li><i class="fas fa-check text-success mr-2"></i>Rating system</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Passenger Features -->
            <div class="col-lg-4 mb-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body text-center p-4">
                        <div class="feature-icon mb-3">
                            <i class="fas fa-mobile-alt fa-3x text-success"></i>
                        </div>
                        <h5 class="card-title">Passenger Experience</h5>
                        <p class="card-text">
                            Seamless booking experience with live tracking, 
                            multiple payment options, and safety features.
                        </p>
                        <ul class="list-unstyled text-left">
                            <li><i class="fas fa-check text-success mr-2"></i>One-tap booking</li>
                            <li><i class="fas fa-check text-success mr-2"></i>Live ride tracking</li>
                            <li><i class="fas fa-check text-success mr-2"></i>Multiple payment methods</li>
                            <li><i class="fas fa-check text-success mr-2"></i>Trip history</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Admin Features -->
            <div class="col-lg-4 mb-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body text-center p-4">
                        <div class="feature-icon mb-3">
                            <i class="fas fa-cogs fa-3x text-info"></i>
                        </div>
                        <h5 class="card-title">Admin Panel</h5>
                        <p class="card-text">
                            Powerful administration tools for managing users, 
                            monitoring rides, and generating reports.
                        </p>
                        <ul class="list-unstyled text-left">
                            <li><i class="fas fa-check text-success mr-2"></i>User management</li>
                            <li><i class="fas fa-check text-success mr-2"></i>Driver verification</li>
                            <li><i class="fas fa-check text-success mr-2"></i>Analytics & reports</li>
                            <li><i class="fas fa-check text-success mr-2"></i>System monitoring</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Technology Stack Section -->
<section class="py-5 bg-light">
    <div class="container">
        <div class="row text-center mb-5">
            <div class="col-12">
                <h2 class="display-5 font-weight-bold">Built with Modern Technologies</h2>
                <p class="lead text-muted">Leveraging the best tools for performance, security, and scalability</p>
            </div>
        </div>
        
        <div class="row text-center">
            <div class="col-md-2 col-6 mb-4">
                <div class="tech-item">
                    <i class="fab fa-laravel fa-3x text-danger mb-2"></i>
                    <h6>Laravel</h6>
                    <small class="text-muted">PHP Framework</small>
                </div>
            </div>
            <div class="col-md-2 col-6 mb-4">
                <div class="tech-item">
                    <i class="fab fa-bootstrap fa-3x text-primary mb-2"></i>
                    <h6>Bootstrap 4.4.1</h6>
                    <small class="text-muted">CSS Framework</small>
                </div>
            </div>
            <div class="col-md-2 col-6 mb-4">
                <div class="tech-item">
                    <i class="fab fa-js-square fa-3x text-warning mb-2"></i>
                    <h6>jQuery 3.4.1</h6>
                    <small class="text-muted">JavaScript Library</small>
                </div>
            </div>
            <div class="col-md-2 col-6 mb-4">
                <div class="tech-item">
                    <i class="fas fa-database fa-3x text-info mb-2"></i>
                    <h6>MySQL</h6>
                    <small class="text-muted">Database</small>
                </div>
            </div>
            <div class="col-md-2 col-6 mb-4">
                <div class="tech-item">
                    <i class="fab fa-php fa-3x text-primary mb-2"></i>
                    <h6>PHP 8.2</h6>
                    <small class="text-muted">Backend Language</small>
                </div>
            </div>
            <div class="col-md-2 col-6 mb-4">
                <div class="tech-item">
                    <i class="fas fa-server fa-3x text-dark mb-2"></i>
                    <h6>Nginx</h6>
                    <small class="text-muted">Web Server</small>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Statistics Section -->
<section class="py-5 bg-primary text-white">
    <div class="container">
        <div class="row text-center">
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="stat-item">
                    <i class="fas fa-users fa-3x mb-3"></i>
                    <h3 class="display-4 font-weight-bold" data-counter="1000">0</h3>
                    <p class="lead">Active Users</p>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="stat-item">
                    <i class="fas fa-car fa-3x mb-3"></i>
                    <h3 class="display-4 font-weight-bold" data-counter="500">0</h3>
                    <p class="lead">Verified Drivers</p>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="stat-item">
                    <i class="fas fa-route fa-3x mb-3"></i>
                    <h3 class="display-4 font-weight-bold" data-counter="10000">0</h3>
                    <p class="lead">Completed Rides</p>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="stat-item">
                    <i class="fas fa-star fa-3x mb-3"></i>
                    <h3 class="display-4 font-weight-bold">4.8</h3>
                    <p class="lead">Average Rating</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Call to Action -->
<section class="py-5">
    <div class="container text-center">
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <h2 class="display-5 font-weight-bold mb-4">Ready to Get Started?</h2>
                <p class="lead mb-4">
                    Join thousands of drivers and passengers who trust Loyal Safar 
                    for their daily transportation needs in Kolkata and Howrah.
                </p>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <a href="{{ route('login') }}" class="btn btn-primary btn-lg btn-block">
                            <i class="fas fa-sign-in-alt mr-2"></i>
                            Sign In
                        </a>
                    </div>
                    <div class="col-md-6 mb-3">
                        <a href="{{ route('register') }}" class="btn btn-outline-primary btn-lg btn-block">
                            <i class="fas fa-user-plus mr-2"></i>
                            Create Account
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection

@push('scripts')
<script>
    // Counter animation for statistics
    $(document).ready(function() {
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
        
        // Trigger animation when statistics section is in view
        $(window).scroll(function() {
            const $statsSection = $('.stat-item').first().parent().parent();
            const elementTop = $statsSection.offset().top;
            const elementBottom = elementTop + $statsSection.outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                animateCounter();
                $(window).off('scroll'); // Run only once
            }
        });
    });
</script>
@endpush