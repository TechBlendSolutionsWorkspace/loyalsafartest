<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'RideBook - Ride Booking Application')</title>
    
    <!-- Bootstrap CSS 4.4.1 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    
    <!-- Swiper CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
    
    <!-- Fancybox CSS 3.5.7 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css">
    
    <!-- Flickity CSS -->
    <link rel="stylesheet" href="https://unpkg.com/flickity@2/dist/flickity.min.css">
    
    <!-- Highlight.js CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css">
    
    <!-- Custom CSS -->
    <style>
        :root {
            --primary-color: #007bff;
            --secondary-color: #6c757d;
            --success-color: #28a745;
            --danger-color: #dc3545;
            --warning-color: #ffc107;
            --info-color: #17a2b8;
            --dark-color: #343a40;
            --light-color: #f8f9fa;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8f9fa;
        }
        
        .navbar-brand {
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .ride-card {
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        
        .ride-card:hover {
            transform: translateY(-2px);
        }
        
        .status-badge {
            font-size: 0.8rem;
            padding: 0.5rem 1rem;
            border-radius: 20px;
        }
        
        .driver-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
        }
        
        .map-container {
            height: 400px;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .earnings-card {
            background: linear-gradient(135deg, var(--primary-color), var(--info-color));
            color: white;
            border-radius: 15px;
        }
        
        .btn-ride {
            border-radius: 25px;
            padding: 0.75rem 2rem;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .btn-ride:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .sidebar {
            min-height: 100vh;
            background: linear-gradient(180deg, var(--dark-color), #495057);
        }
        
        .sidebar .nav-link {
            color: rgba(255,255,255,0.8);
            padding: 1rem 1.5rem;
            border-radius: 10px;
            margin: 0.2rem 0;
            transition: all 0.3s;
        }
        
        .sidebar .nav-link:hover,
        .sidebar .nav-link.active {
            background: rgba(255,255,255,0.1);
            color: white;
        }
        
        .loading-spinner {
            display: none;
        }
        
        .rating-stars {
            color: #ffc107;
        }
        
        .vehicle-info {
            background: white;
            border-radius: 10px;
            padding: 1rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
    </style>
    
    @stack('styles')
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="{{ route('dashboard') }}">
                <i class="fas fa-car mr-2"></i>RideBook
            </a>
            
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ml-auto">
                    @auth
                        @if(auth()->user()->isDriver())
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('driver.dashboard') }}">
                                    <i class="fas fa-tachometer-alt mr-1"></i>Dashboard
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('driver.rides') }}">
                                    <i class="fas fa-route mr-1"></i>Rides
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('driver.earnings') }}">
                                    <i class="fas fa-dollar-sign mr-1"></i>Earnings
                                </a>
                            </li>
                        @elseif(auth()->user()->isPassenger())
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('passenger.dashboard') }}">
                                    <i class="fas fa-tachometer-alt mr-1"></i>Dashboard
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('passenger.book-ride') }}">
                                    <i class="fas fa-plus mr-1"></i>Book Ride
                                </a>
                            </li>
                        @elseif(auth()->user()->isAdmin())
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('admin.dashboard') }}">
                                    <i class="fas fa-cogs mr-1"></i>Admin Panel
                                </a>
                            </li>
                        @endif
                        
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown">
                                @if(auth()->user()->avatar)
                                    <img src="{{ auth()->user()->avatar }}" class="driver-avatar mr-1" alt="Avatar">
                                @else
                                    <i class="fas fa-user mr-1"></i>
                                @endif
                                {{ auth()->user()->name }}
                            </a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="{{ route('profile.edit') }}">
                                    <i class="fas fa-user-edit mr-2"></i>Profile
                                </a>
                                <div class="dropdown-divider"></div>
                                <form method="POST" action="{{ route('logout') }}" style="display: inline;">
                                    @csrf
                                    <button type="submit" class="dropdown-item">
                                        <i class="fas fa-sign-out-alt mr-2"></i>Logout
                                    </button>
                                </form>
                            </div>
                        </li>
                    @else
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('login') }}">Login</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('register') }}">Register</a>
                        </li>
                    @endauth
                </ul>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="@auth bg-light @endauth">
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4 mt-5">
        <div class="container text-center">
            <p>&copy; {{ date('Y') }} RideBook. All rights reserved.</p>
            <p class="mb-0">
                <small>Built with Laravel, Bootstrap, and modern web technologies</small>
            </p>
        </div>
    </footer>

    <!-- Core JavaScript -->
    <!-- jQuery 3.4.1 -->
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>
    
    <!-- Bootstrap JS 4.4.1 -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Core JS 3.2.1 -->
    <script src="https://cdn.jsdelivr.net/npm/core-js@3.2.1/minified.js"></script>
    
    <!-- List.js -->
    <script src="https://cdn.jsdelivr.net/npm/list.js@2.3.1/dist/list.min.js"></script>
    
    <!-- Highlight.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    
    <!-- Fancybox 3.5.7 -->
    <script src="https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js"></script>
    
    <!-- Swiper -->
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    
    <!-- Flickity -->
    <script src="https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js"></script>

    <!-- Custom JavaScript -->
    <script>
        // Initialize highlight.js
        hljs.highlightAll();
        
        // Initialize Fancybox
        $('[data-fancybox]').fancybox({
            toolbar: true,
            smallBtn: true,
            iframe: {
                preload: false
            }
        });
        
        // CSRF token setup for AJAX
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        
        // Global functions
        function showLoading(element) {
            $(element).find('.loading-spinner').show();
        }
        
        function hideLoading(element) {
            $(element).find('.loading-spinner').hide();
        }
        
        function showToast(message, type = 'success') {
            const toast = `
                <div class="toast" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
                    <div class="toast-header bg-${type} text-white">
                        <strong class="mr-auto">RideBook</strong>
                        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                </div>
            `;
            $('body').append(toast);
            $('.toast').toast('show');
            
            setTimeout(() => {
                $('.toast').toast('hide');
            }, 5000);
        }
        
        // Real-time updates (placeholder for WebSocket implementation)
        function initializeRealTimeUpdates() {
            // This would connect to WebSocket or use Server-Sent Events
            console.log('Real-time updates initialized');
        }
        
        $(document).ready(function() {
            // Initialize real-time updates
            initializeRealTimeUpdates();
            
            // Auto-dismiss alerts
            setTimeout(function() {
                $('.alert').fadeOut('slow');
            }, 5000);
        });
    </script>
    
    @stack('scripts')
</body>
</html>