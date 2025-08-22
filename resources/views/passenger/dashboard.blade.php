@extends('layouts.app')

@section('title', 'Passenger Dashboard - RideBook')

@section('content')
<div class="container-fluid">
    <div class="row">
        <!-- Main Content -->
        <div class="col-12">
            <div class="p-4">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>
                        <i class="fas fa-tachometer-alt mr-2 text-primary"></i>
                        Passenger Dashboard
                    </h2>
                    
                    <a href="{{ route('passenger.book-ride') }}" class="btn btn-primary btn-lg">
                        <i class="fas fa-plus mr-2"></i>Book New Ride
                    </a>
                </div>

                <!-- Active Ride Alert -->
                @if($activeRide)
                    <div class="alert alert-info border-left-primary shadow mb-4">
                        <div class="row align-items-center">
                            <div class="col-lg-8">
                                <h5 class="alert-heading">
                                    <i class="fas fa-route mr-2"></i>Active Ride
                                </h5>
                                <p class="mb-2">
                                    <strong>From:</strong> {{ Str::limit($activeRide->pickup_address, 40) }}<br>
                                    <strong>To:</strong> {{ Str::limit($activeRide->destination_address, 40) }}
                                </p>
                                <p class="mb-0">
                                    <span class="badge badge-{{ $activeRide->status == 'in_progress' ? 'success' : 'warning' }} badge-lg">
                                        {{ ucfirst(str_replace('_', ' ', $activeRide->status)) }}
                                    </span>
                                </p>
                            </div>
                            <div class="col-lg-4 text-right">
                                <a href="{{ route('passenger.rides.show', $activeRide) }}" class="btn btn-outline-primary">
                                    <i class="fas fa-eye mr-1"></i>View Details
                                </a>
                            </div>
                        </div>
                    </div>
                @endif

                <!-- Statistics Cards -->
                <div class="row mb-4">
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card bg-primary text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-route fa-2x mb-2"></i>
                                <h3 class="display-6 font-weight-bold">{{ $stats['total_rides'] }}</h3>
                                <p class="mb-0">Total Rides</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card bg-success text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-check-circle fa-2x mb-2"></i>
                                <h3 class="display-6 font-weight-bold">{{ $stats['completed_rides'] }}</h3>
                                <p class="mb-0">Completed</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card bg-warning text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-times-circle fa-2x mb-2"></i>
                                <h3 class="display-6 font-weight-bold">{{ $stats['cancelled_rides'] }}</h3>
                                <p class="mb-0">Cancelled</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card bg-info text-white">
                            <div class="card-body text-center">
                                <i class="fas fa-rupee-sign fa-2x mb-2"></i>
                                <h3 class="display-6 font-weight-bold">₹{{ number_format($stats['total_spent'], 0) }}</h3>
                                <p class="mb-0">Total Spent</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header bg-light">
                                <h5 class="mb-0">
                                    <i class="fas fa-bolt mr-2"></i>Quick Actions
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-lg-3 col-md-6 mb-3">
                                        <a href="{{ route('passenger.book-ride') }}" class="btn btn-outline-primary btn-block btn-lg">
                                            <i class="fas fa-plus fa-2x d-block mb-2"></i>
                                            Book Ride
                                        </a>
                                    </div>
                                    <div class="col-lg-3 col-md-6 mb-3">
                                        <a href="{{ route('passenger.rides') }}" class="btn btn-outline-secondary btn-block btn-lg">
                                            <i class="fas fa-history fa-2x d-block mb-2"></i>
                                            Ride History
                                        </a>
                                    </div>
                                    <div class="col-lg-3 col-md-6 mb-3">
                                        <a href="{{ route('profile.edit') }}" class="btn btn-outline-info btn-block btn-lg">
                                            <i class="fas fa-user-edit fa-2x d-block mb-2"></i>
                                            Edit Profile
                                        </a>
                                    </div>
                                    <div class="col-lg-3 col-md-6 mb-3">
                                        <button class="btn btn-outline-success btn-block btn-lg" data-toggle="modal" data-target="#helpModal">
                                            <i class="fas fa-question-circle fa-2x d-block mb-2"></i>
                                            Help & Support
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Rides -->
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">
                                    <i class="fas fa-history mr-2"></i>Recent Rides
                                </h5>
                                <a href="{{ route('passenger.rides') }}" class="btn btn-sm btn-outline-light">
                                    View All
                                </a>
                            </div>
                            <div class="card-body">
                                @if(count($recentRides) > 0)
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Ride ID</th>
                                                    <th>Route</th>
                                                    <th>Date</th>
                                                    <th>Status</th>
                                                    <th>Driver</th>
                                                    <th>Fare</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                @foreach($recentRides as $ride)
                                                    <tr>
                                                        <td>
                                                            <strong>{{ $ride->ride_id }}</strong>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <i class="fas fa-map-marker-alt text-success mr-1"></i>
                                                                {{ Str::limit($ride->pickup_address, 20) }}
                                                            </div>
                                                            <div>
                                                                <i class="fas fa-flag-checkered text-danger mr-1"></i>
                                                                {{ Str::limit($ride->destination_address, 20) }}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {{ $ride->requested_at->format('M d, Y') }}<br>
                                                            <small class="text-muted">{{ $ride->requested_at->format('h:i A') }}</small>
                                                        </td>
                                                        <td>
                                                            <span class="badge badge-{{ $ride->status == 'completed' ? 'success' : ($ride->status == 'cancelled_by_passenger' || $ride->status == 'cancelled_by_driver' ? 'danger' : 'warning') }}">
                                                                {{ ucfirst(str_replace('_', ' ', $ride->status)) }}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            @if($ride->driver)
                                                                <div class="d-flex align-items-center">
                                                                    @if($ride->driver->avatar)
                                                                        <img src="{{ $ride->driver->avatar }}" class="driver-avatar mr-2" alt="Driver">
                                                                    @else
                                                                        <div class="driver-avatar mr-2 bg-secondary d-flex align-items-center justify-content-center">
                                                                            <i class="fas fa-user text-white"></i>
                                                                        </div>
                                                                    @endif
                                                                    <div>
                                                                        <div>{{ $ride->driver->name }}</div>
                                                                        <div class="rating-stars">
                                                                            @for($i = 1; $i <= 5; $i++)
                                                                                <i class="fas fa-star{{ $i <= $ride->driver->rating ? '' : '-o' }}"></i>
                                                                            @endfor
                                                                            <small>({{ number_format($ride->driver->rating, 1) }})</small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            @else
                                                                <span class="text-muted">Not assigned</span>
                                                            @endif
                                                        </td>
                                                        <td>
                                                            <strong class="text-success">
                                                                ₹{{ number_format($ride->actual_fare ?? $ride->estimated_fare, 2) }}
                                                            </strong>
                                                        </td>
                                                        <td>
                                                            <a href="{{ route('passenger.rides.show', $ride) }}" class="btn btn-sm btn-outline-primary">
                                                                <i class="fas fa-eye"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                @endforeach
                                            </tbody>
                                        </table>
                                    </div>
                                @else
                                    <div class="text-center py-4">
                                        <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                                        <h5 class="text-muted">No rides yet</h5>
                                        <p class="text-muted">Book your first ride to get started!</p>
                                        <a href="{{ route('passenger.book-ride') }}" class="btn btn-primary">
                                            <i class="fas fa-plus mr-2"></i>Book Your First Ride
                                        </a>
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

<!-- Help Modal -->
<div class="modal fade" id="helpModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="fas fa-question-circle mr-2"></i>Help & Support
                </h5>
                <button type="button" class="close" data-dismiss="modal">
                    <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <h6>Frequently Asked Questions</h6>
                <div class="accordion" id="faqAccordion">
                    <div class="card">
                        <div class="card-header" id="faq1">
                            <h6 class="mb-0">
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse1">
                                    How do I book a ride?
                                </button>
                            </h6>
                        </div>
                        <div id="collapse1" class="collapse show" data-parent="#faqAccordion">
                            <div class="card-body">
                                Click on "Book Ride" button, enter your pickup and destination locations, then confirm your booking.
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header" id="faq2">
                            <h6 class="mb-0">
                                <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse2">
                                    Can I cancel my ride?
                                </button>
                            </h6>
                        </div>
                        <div id="collapse2" class="collapse" data-parent="#faqAccordion">
                            <div class="card-body">
                                Yes, you can cancel your ride before the driver arrives. Cancellation charges may apply.
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header" id="faq3">
                            <h6 class="mb-0">
                                <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse3">
                                    How is the fare calculated?
                                </button>
                            </h6>
                        </div>
                        <div id="collapse3" class="collapse" data-parent="#faqAccordion">
                            <div class="card-body">
                                Fare is calculated based on distance, time, and current demand. Base fare is ₹50 + ₹15 per kilometer.
                            </div>
                        </div>
                    </div>
                </div>
                
                <hr>
                
                <h6>Contact Support</h6>
                <p>Need more help? Contact our support team:</p>
                <ul class="list-unstyled">
                    <li><i class="fas fa-phone mr-2"></i> +91 8000-800-800</li>
                    <li><i class="fas fa-envelope mr-2"></i> support@ridebook.com</li>
                    <li><i class="fas fa-clock mr-2"></i> Available 24/7</li>
                </ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    $(document).ready(function() {
        // Auto-refresh active ride status if exists
        @if($activeRide)
            setInterval(function() {
                checkRideStatus({{ $activeRide->id }});
            }, 30000); // Check every 30 seconds
        @endif
        
        function checkRideStatus(rideId) {
            $.get(`/api/ride/${rideId}/status`)
            .done(function(response) {
                // Update ride status if changed
                console.log('Ride status:', response.status);
            });
        }
    });
</script>
@endpush