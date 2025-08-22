<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Loyal Safar - Your Trusted Ride Partner')</title>
    
    <!-- Bootstrap CSS 5.3.0 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
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
            --indrive-green: #00D26A;
            --indrive-dark: #202124;
            --indrive-light: #F5F5F5;
            --indrive-white: #FFFFFF;
            --indrive-blue: #007AFF;
            --indrive-red: #FF3B30;
            --indrive-gradient: linear-gradient(135deg, #00D26A, #00B85A);
        }
        
        body {
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: var(--indrive-light);
            min-height: 100vh;
            color: var(--indrive-dark);
        }
        
        .navbar-brand {
            font-weight: 800;
            font-size: 1.8rem;
            color: var(--indrive-green) !important;
        }
        
        .navbar {
            background: var(--indrive-white) !important;
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--indrive-light);
            box-shadow: 0 2px 4px rgba(32, 33, 36, 0.1);
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
            background: var(--indrive-gradient);
            color: var(--indrive-white);
            border-radius: 20px;
            box-shadow: 0 8px 25px rgba(0, 210, 106, 0.15);
        }
        
        .payout-card {
            background: var(--indrive-white);
            border: 1px solid var(--indrive-light);
            border-radius: 20px;
            box-shadow: 0 4px 12px rgba(32, 33, 36, 0.08);
        }
        
        .commission-card {
            background: var(--indrive-white);
            border-left: 4px solid var(--indrive-green);
            color: var(--indrive-dark);
        }
        
        .btn-ride {
            background: var(--indrive-green);
            border: none;
            color: var(--indrive-white);
            border-radius: 25px;
            padding: 0.75rem 2rem;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .btn-ride:hover {
            background: #00B85A;
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(0, 210, 106, 0.3);
            color: var(--indrive-white);
        }
        
        .btn-panic {
            background: var(--indrive-red);
            border: none;
            color: var(--indrive-white);
            border-radius: 25px;
            padding: 0.75rem 2rem;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .btn-panic:hover {
            background: #E5342A;
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(255, 59, 48, 0.3);
            color: var(--indrive-white);
        }
        
        .sidebar {
            min-height: 100vh;
            background: var(--indrive-dark);
            box-shadow: 4px 0 15px rgba(32, 33, 36, 0.15);
        }
        
        .sidebar .nav-link {
            color: rgba(255,255,255,0.7);
            padding: 1rem 1.5rem;
            border-radius: 10px;
            margin: 0.2rem 0;
            transition: all 0.3s;
        }
        
        .sidebar .nav-link:hover {
            background: rgba(0, 210, 106, 0.1);
            color: var(--indrive-green);
        }
        
        .sidebar .nav-link.active {
            background: var(--indrive-green);
            color: var(--indrive-white);
        }
        
        .sidebar .nav-link i {
            color: var(--indrive-green);
        }
        
        .sidebar .nav-link.active i {
            color: var(--indrive-white);
        }
        
        .loading-spinner {
            display: none;
        }
        
        .rating-stars {
            color: var(--indrive-green);
        }
        
        .vehicle-info {
            background: var(--indrive-white);
        }
        
        /* Table Styling for InDrive Theme */
        .table tbody tr:nth-child(even) {
            background-color: var(--indrive-light);
        }
        
        .table tbody tr:nth-child(odd) {
            background-color: var(--indrive-white);
        }
        
        .table th {
            border-color: var(--indrive-light);
            color: var(--indrive-dark);
        }
        
        .table td {
            border-color: var(--indrive-light);
            color: var(--indrive-dark);
        }
        
        /* Form Elements */
        .form-control:focus {
            border-color: var(--indrive-green);
            box-shadow: 0 0 0 0.2rem rgba(0, 210, 106, 0.25);
        }
        
        .form-select:focus {
            border-color: var(--indrive-green);
            box-shadow: 0 0 0 0.2rem rgba(0, 210, 106, 0.25);
        }
        
        /* Alert Styling */
        .alert-success {
            background-color: rgba(0, 210, 106, 0.1);
            border-color: var(--indrive-green);
            color: var(--indrive-dark);
        }
        
        .alert-danger {
            background-color: rgba(255, 59, 48, 0.1);
            border-color: var(--indrive-red);
            color: var(--indrive-dark);
        }
        
        .alert-info {
            background-color: rgba(0, 122, 255, 0.1);
            border-color: var(--indrive-blue);
            color: var(--indrive-dark);
        }
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
            <a class="navbar-brand" href="{{ auth()->check() ? route('dashboard') : '/' }}">
                <i class="fas fa-car mr-2"></i>Loyal Safar
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ml-auto">
                    @auth
                        @if(auth()->user()->role === 'driver')
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('driver.dashboard') }}">
                                    <i class="fas fa-tachometer-alt mr-1"></i>Dashboard
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('driver.wallet') }}">
                                    <i class="fas fa-wallet mr-1"></i>Wallet
                                </a>
                            </li>
                        @elseif(auth()->user()->role === 'passenger')
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('rider.dashboard') }}">
                                    <i class="fas fa-tachometer-alt mr-1"></i>Dashboard
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('rider.book-ride') }}">
                                    <i class="fas fa-plus mr-1"></i>Book Ride
                                </a>
                            </li>
                        @elseif(auth()->user()->role === 'admin')
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('admin.dashboard') }}">
                                    <i class="fas fa-cogs mr-1"></i>Admin Panel
                                </a>
                            </li>
                        @endif
                        
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                @if(isset(auth()->user()->avatar) && auth()->user()->avatar)
                                    <img src="{{ auth()->user()->avatar }}" class="driver-avatar mr-1" alt="Avatar">
                                @else
                                    <i class="fas fa-user mr-1"></i>
                                @endif
                                {{ auth()->user()->name }}
                            </a>
                            <ul class="dropdown-menu">
                                <li><h6 class="dropdown-header">{{ ucfirst(auth()->user()->role) }} Account</h6></li>
                                <li><hr class="dropdown-divider"></li>
                                <li>
                                    <form method="POST" action="{{ route('logout') }}" style="display: inline;">
                                        @csrf
                                        <button type="submit" class="dropdown-item">
                                            <i class="fas fa-sign-out-alt mr-2"></i>Logout
                                        </button>
                                    </form>
                                </li>
                            </ul>
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
            <p>&copy; {{ date('Y') }} Loyal Safar. All rights reserved.</p>
            <p class="mb-0">
                <small>Built with Laravel, Bootstrap, and modern web technologies</small>
            </p>
        </div>
    </footer>

    <!-- Core JavaScript -->
    <!-- jQuery 3.4.1 -->
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>
    
    <!-- Bootstrap JS 5.3.0 -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
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
                        <strong class="mr-auto">Loyal Safar</strong>
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