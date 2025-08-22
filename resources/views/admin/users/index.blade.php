@extends('layouts.app')

@section('title', 'User Management - Admin Dashboard')

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
                    <a class="nav-link" href="{{ route('admin.dashboard') }}">
                        <i class="fas fa-tachometer-alt mr-2"></i>Dashboard
                    </a>
                    <a class="nav-link active" href="{{ route('admin.users.index') }}">
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
                        <i class="fas fa-users mr-2 text-primary"></i>
                        User Management
                    </h2>
                    
                    <!-- Search and Filter -->
                    <div class="d-flex">
                        <div class="input-group mr-3">
                            <input type="text" class="form-control" id="searchUsers" placeholder="Search users...">
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="dropdown">
                            <button class="btn btn-outline-primary dropdown-toggle" type="button" data-toggle="dropdown">
                                <i class="fas fa-filter mr-1"></i>Filter
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" data-filter="all">All Users</a>
                                <a class="dropdown-item" href="#" data-filter="passenger">Passengers</a>
                                <a class="dropdown-item" href="#" data-filter="driver">Drivers</a>
                                <a class="dropdown-item" href="#" data-filter="admin">Admins</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#" data-filter="verified">Verified Only</a>
                                <a class="dropdown-item" href="#" data-filter="unverified">Unverified Only</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistics Cards -->
                <div class="row mb-4">
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card bg-primary text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-users fa-2x mb-2"></i>
                                <h4>{{ $stats['total_users'] ?? 0 }}</h4>
                                <p class="mb-0">Total Users</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card bg-success text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-user-friends fa-2x mb-2"></i>
                                <h4>{{ $stats['passengers'] ?? 0 }}</h4>
                                <p class="mb-0">Passengers</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card bg-warning text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-car fa-2x mb-2"></i>
                                <h4>{{ $stats['drivers'] ?? 0 }}</h4>
                                <p class="mb-0">Drivers</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card bg-info text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-user-shield fa-2x mb-2"></i>
                                <h4>{{ $stats['admins'] ?? 0 }}</h4>
                                <p class="mb-0">Admins</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Users Table -->
                <div class="card">
                    <div class="card-header bg-dark text-white">
                        <h5 class="mb-0">
                            <i class="fas fa-table mr-2"></i>
                            Users List
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover" id="usersTable">
                                <thead class="thead-light">
                                    <tr>
                                        <th>User</th>
                                        <th>Contact</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Rating</th>
                                        <th>Joined</th>
                                        <th>Last Active</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @if(isset($users) && count($users) > 0)
                                        @foreach($users as $user)
                                            <tr data-user-id="{{ $user->id }}" data-role="{{ $user->role }}">
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        @if($user->avatar)
                                                            <img src="{{ $user->avatar }}" class="driver-avatar mr-3" alt="Avatar">
                                                        @else
                                                            <div class="bg-secondary rounded-circle mr-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                                                <i class="fas fa-user text-white"></i>
                                                            </div>
                                                        @endif
                                                        <div>
                                                            <div class="font-weight-bold">{{ $user->name }}</div>
                                                            <small class="text-muted">ID: {{ $user->id }}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>{{ $user->email }}</div>
                                                    <small class="text-muted">{{ $user->phone }}</small>
                                                </td>
                                                <td>
                                                    <span class="badge badge-{{ 
                                                        $user->role == 'admin' ? 'danger' : 
                                                        ($user->role == 'driver' ? 'warning' : 'primary') 
                                                    }}">
                                                        {{ ucfirst($user->role) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span class="badge badge-{{ $user->is_verified ? 'success' : 'secondary' }}">
                                                            {{ $user->is_verified ? 'Verified' : 'Unverified' }}
                                                        </span>
                                                    </div>
                                                    @if($user->role == 'driver' && $user->driver)
                                                        <small class="badge badge-{{ $user->driver->status == 'online' ? 'success' : 'secondary' }}">
                                                            {{ ucfirst($user->driver->status) }}
                                                        </small>
                                                    @endif
                                                </td>
                                                <td>
                                                    @if($user->rating)
                                                        <div class="rating-stars">
                                                            @for($i = 1; $i <= 5; $i++)
                                                                <i class="fas fa-star{{ $i <= $user->rating ? '' : '-o' }}"></i>
                                                            @endfor
                                                        </div>
                                                        <small>({{ number_format($user->rating, 1) }})</small>
                                                    @else
                                                        <span class="text-muted">No ratings</span>
                                                    @endif
                                                </td>
                                                <td>
                                                    <div>{{ $user->created_at->format('M d, Y') }}</div>
                                                    <small class="text-muted">{{ $user->created_at->diffForHumans() }}</small>
                                                </td>
                                                <td>
                                                    @if($user->last_active_at)
                                                        <div>{{ $user->last_active_at->diffForHumans() }}</div>
                                                        <small class="text-muted">{{ $user->last_active_at->format('M d, h:i A') }}</small>
                                                    @else
                                                        <span class="text-muted">Never</span>
                                                    @endif
                                                </td>
                                                <td>
                                                    <div class="btn-group" role="group">
                                                        <a href="{{ route('admin.users.show', $user->id) }}" class="btn btn-sm btn-outline-primary" title="View Details">
                                                            <i class="fas fa-eye"></i>
                                                        </a>
                                                        
                                                        @if(!$user->is_verified)
                                                            <button class="btn btn-sm btn-outline-success verify-user" data-user-id="{{ $user->id }}" title="Verify User">
                                                                <i class="fas fa-check"></i>
                                                            </button>
                                                        @endif
                                                        
                                                        <button class="btn btn-sm btn-outline-warning block-user" data-user-id="{{ $user->id }}" title="Block/Unblock User">
                                                            <i class="fas fa-ban"></i>
                                                        </button>
                                                        
                                                        <div class="dropdown">
                                                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" title="More Actions">
                                                                <i class="fas fa-ellipsis-v"></i>
                                                            </button>
                                                            <div class="dropdown-menu">
                                                                <a class="dropdown-item" href="#">
                                                                    <i class="fas fa-envelope mr-2"></i>Send Message
                                                                </a>
                                                                <a class="dropdown-item" href="#">
                                                                    <i class="fas fa-history mr-2"></i>View Activity
                                                                </a>
                                                                @if($user->role == 'driver')
                                                                    <a class="dropdown-item" href="#">
                                                                        <i class="fas fa-car mr-2"></i>Driver Details
                                                                    </a>
                                                                @endif
                                                                <div class="dropdown-divider"></div>
                                                                <a class="dropdown-item text-danger" href="#">
                                                                    <i class="fas fa-trash mr-2"></i>Delete Account
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        @endforeach
                                    @else
                                        <tr>
                                            <td colspan="8" class="text-center py-4">
                                                <i class="fas fa-users fa-3x text-muted mb-3"></i>
                                                <p class="text-muted">No users found</p>
                                            </td>
                                        </tr>
                                    @endif
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- Pagination -->
                        @if(isset($users) && method_exists($users, 'links'))
                            <div class="d-flex justify-content-center">
                                {{ $users->links() }}
                            </div>
                        @endif
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
        // Search functionality
        $('#searchUsers').on('keyup', function() {
            const searchTerm = $(this).val().toLowerCase();
            
            $('#usersTable tbody tr').each(function() {
                const rowText = $(this).text().toLowerCase();
                if (rowText.includes(searchTerm)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });
        
        // Filter functionality
        $('[data-filter]').on('click', function(e) {
            e.preventDefault();
            const filter = $(this).data('filter');
            
            $('#usersTable tbody tr').each(function() {
                if (filter === 'all') {
                    $(this).show();
                } else if (filter === 'verified' || filter === 'unverified') {
                    const isVerified = $(this).find('.badge-success').text().includes('Verified');
                    if ((filter === 'verified' && isVerified) || (filter === 'unverified' && !isVerified)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                } else {
                    const userRole = $(this).data('role');
                    if (userRole === filter) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }
            });
        });
        
        // Verify user
        $('.verify-user').on('click', function() {
            const userId = $(this).data('user-id');
            const $btn = $(this);
            
            if (confirm('Are you sure you want to verify this user?')) {
                $.post(`/admin/users/${userId}/verify`, {
                    _token: '{{ csrf_token() }}'
                })
                .done(function(response) {
                    showToast('User verified successfully!', 'success');
                    $btn.closest('tr').find('.badge-secondary').removeClass('badge-secondary').addClass('badge-success').text('Verified');
                    $btn.remove();
                })
                .fail(function() {
                    showToast('Failed to verify user', 'danger');
                });
            }
        });
        
        // Block/Unblock user
        $('.block-user').on('click', function() {
            const userId = $(this).data('user-id');
            
            if (confirm('Are you sure you want to block/unblock this user?')) {
                $.post(`/admin/users/${userId}/block`, {
                    _token: '{{ csrf_token() }}'
                })
                .done(function(response) {
                    showToast(response.message, 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                })
                .fail(function() {
                    showToast('Failed to update user status', 'danger');
                });
            }
        });
    });
</script>
@endpush