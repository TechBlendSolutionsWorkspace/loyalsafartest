@extends('layouts.app')

@section('title', 'Book a Ride - RideBook')

@section('content')
<div class="container-fluid">
    <div class="row">
        <!-- Passenger Sidebar -->
        <div class="col-md-3 col-lg-2 px-0">
            <div class="sidebar">
                <div class="p-4">
                    <h5 class="text-white">
                        <i class="fas fa-user mr-2"></i>
                        Passenger Panel
                    </h5>
                </div>
                
                <nav class="nav flex-column px-3">
                    <a class="nav-link" href="{{ route('passenger.dashboard') }}">
                        <i class="fas fa-home mr-2"></i>Dashboard
                    </a>
                    <a class="nav-link active" href="{{ route('passenger.book-ride') }}">
                        <i class="fas fa-plus-circle mr-2"></i>Book a Ride
                    </a>
                    <a class="nav-link" href="{{ route('passenger.rides') }}">
                        <i class="fas fa-history mr-2"></i>My Rides
                    </a>
                    <a class="nav-link" href="{{ route('profile.edit') }}">
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
                    <h2>
                        <i class="fas fa-plus-circle mr-2 text-primary"></i>
                        Book a Ride
                    </h2>
                    <a href="{{ route('passenger.dashboard') }}" class="btn btn-outline-secondary">
                        <i class="fas fa-arrow-left mr-2"></i>Back to Dashboard
                    </a>
                </div>

                <div class="row">
                    <!-- Booking Form -->
                    <div class="col-lg-8 mb-4">
                        <div class="card">
                            <div class="card-header bg-primary text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-map-marker-alt mr-2"></i>
                                    Ride Details
                                </h5>
                            </div>
                            <div class="card-body">
                                <form id="bookRideForm" action="{{ route('passenger.store-ride') }}" method="POST">
                                    @csrf
                                    
                                    <!-- Location Inputs -->
                                    <div class="row">
                                        <div class="col-md-6 mb-4">
                                            <label for="pickup_address" class="form-label">
                                                <i class="fas fa-map-marker-alt text-success mr-2"></i>
                                                Pickup Location *
                                            </label>
                                            <div class="input-group">
                                                <input type="text" class="form-control form-control-lg" id="pickup_address" name="pickup_address" placeholder="Enter pickup location" required>
                                                <div class="input-group-append">
                                                    <button class="btn btn-outline-success" type="button" id="useCurrentLocation">
                                                        <i class="fas fa-crosshairs"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <input type="hidden" id="pickup_latitude" name="pickup_latitude">
                                            <input type="hidden" id="pickup_longitude" name="pickup_longitude">
                                        </div>
                                        
                                        <div class="col-md-6 mb-4">
                                            <label for="destination_address" class="form-label">
                                                <i class="fas fa-flag-checkered text-danger mr-2"></i>
                                                Destination *
                                            </label>
                                            <input type="text" class="form-control form-control-lg" id="destination_address" name="destination_address" placeholder="Where do you want to go?" required>
                                            <input type="hidden" id="destination_latitude" name="destination_latitude">
                                            <input type="hidden" id="destination_longitude" name="destination_longitude">
                                        </div>
                                    </div>

                                    <!-- Ride Options -->
                                    <div class="row">
                                        <div class="col-md-6 mb-4">
                                            <label for="ride_type" class="form-label">
                                                <i class="fas fa-car mr-2"></i>
                                                Ride Type
                                            </label>
                                            <select class="form-control form-control-lg" id="ride_type" name="ride_type">
                                                <option value="standard">Standard - Comfortable rides</option>
                                                <option value="premium">Premium - Luxury vehicles</option>
                                                <option value="shared">Shared - Budget-friendly</option>
                                            </select>
                                        </div>
                                        
                                        <div class="col-md-6 mb-4">
                                            <label for="scheduled_at" class="form-label">
                                                <i class="fas fa-clock mr-2"></i>
                                                Schedule (Optional)
                                            </label>
                                            <input type="datetime-local" class="form-control form-control-lg" id="scheduled_at" name="scheduled_at" min="{{ now()->format('Y-m-d\TH:i') }}">
                                        </div>
                                    </div>

                                    <!-- Additional Options -->
                                    <div class="row">
                                        <div class="col-md-6 mb-4">
                                            <label for="passengers" class="form-label">
                                                <i class="fas fa-users mr-2"></i>
                                                Number of Passengers
                                            </label>
                                            <select class="form-control form-control-lg" id="passengers" name="passengers">
                                                <option value="1">1 Passenger</option>
                                                <option value="2">2 Passengers</option>
                                                <option value="3">3 Passengers</option>
                                                <option value="4">4 Passengers</option>
                                            </select>
                                        </div>
                                        
                                        <div class="col-md-6 mb-4">
                                            <label for="payment_method" class="form-label">
                                                <i class="fas fa-credit-card mr-2"></i>
                                                Payment Method
                                            </label>
                                            <select class="form-control form-control-lg" id="payment_method" name="payment_method">
                                                <option value="cash">Cash</option>
                                                <option value="card">Credit/Debit Card</option>
                                                <option value="wallet">Digital Wallet</option>
                                            </select>
                                        </div>
                                    </div>

                                    <!-- Special Instructions -->
                                    <div class="mb-4">
                                        <label for="notes" class="form-label">
                                            <i class="fas fa-sticky-note mr-2"></i>
                                            Special Instructions (Optional)
                                        </label>
                                        <textarea class="form-control" id="notes" name="notes" rows="3" placeholder="Any special instructions for the driver (e.g., landmark, preferred route, etc.)"></textarea>
                                    </div>

                                    <!-- Fare Estimate -->
                                    <div class="card bg-light mb-4" id="fareEstimate" style="display: none;">
                                        <div class="card-body">
                                            <h6 class="card-title">
                                                <i class="fas fa-calculator mr-2 text-primary"></i>
                                                Fare Estimate
                                            </h6>
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <div class="text-center">
                                                        <strong class="text-primary" id="estimatedFare">₹0</strong>
                                                        <br><small class="text-muted">Estimated Fare</small>
                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="text-center">
                                                        <strong class="text-info" id="estimatedDistance">0 km</strong>
                                                        <br><small class="text-muted">Distance</small>
                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="text-center">
                                                        <strong class="text-success" id="estimatedTime">0 min</strong>
                                                        <br><small class="text-muted">Est. Time</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Submit Button -->
                                    <div class="text-center">
                                        <button type="submit" class="btn btn-primary btn-lg btn-ride px-5" id="submitBooking">
                                            <i class="fas fa-search mr-2"></i>Find Driver
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Right Sidebar -->
                    <div class="col-lg-4 mb-4">
                        <!-- Quick Actions -->
                        <div class="card mb-4">
                            <div class="card-header bg-secondary text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-bolt mr-2"></i>Quick Locations
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="list-group list-group-flush">
                                    <button class="list-group-item list-group-item-action quick-location" data-address="Airport, Mumbai" data-lat="19.0896" data-lng="72.8656">
                                        <i class="fas fa-plane mr-2"></i>Mumbai Airport
                                    </button>
                                    <button class="list-group-item list-group-item-action quick-location" data-address="Chhatrapati Shivaji Terminus, Mumbai" data-lat="18.9401" data-lng="72.8347">
                                        <i class="fas fa-train mr-2"></i>CST Railway Station
                                    </button>
                                    <button class="list-group-item list-group-item-action quick-location" data-address="Gateway of India, Mumbai" data-lat="18.9220" data-lng="72.8347">
                                        <i class="fas fa-landmark mr-2"></i>Gateway of India
                                    </button>
                                    <button class="list-group-item list-group-item-action quick-location" data-address="Bandra-Kurla Complex, Mumbai" data-lat="19.0596" data-lng="72.8656">
                                        <i class="fas fa-building mr-2"></i>BKC Business District
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Ride Types Info -->
                        <div class="card mb-4">
                            <div class="card-header bg-info text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-info-circle mr-2"></i>Ride Types
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <h6><i class="fas fa-car mr-2 text-primary"></i>Standard</h6>
                                    <p class="text-muted mb-1">Comfortable rides with professional drivers</p>
                                    <small class="text-success">₹15/km + ₹50 base fare</small>
                                </div>
                                
                                <div class="mb-3">
                                    <h6><i class="fas fa-crown mr-2 text-warning"></i>Premium</h6>
                                    <p class="text-muted mb-1">Luxury vehicles for special occasions</p>
                                    <small class="text-success">₹25/km + ₹100 base fare</small>
                                </div>
                                
                                <div class="mb-0">
                                    <h6><i class="fas fa-user-friends mr-2 text-info"></i>Shared</h6>
                                    <p class="text-muted mb-1">Share rides and save money</p>
                                    <small class="text-success">₹8/km + ₹25 base fare</small>
                                </div>
                            </div>
                        </div>

                        <!-- Map Placeholder -->
                        <div class="card">
                            <div class="card-header bg-success text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-map mr-2"></i>Route Preview
                                </h5>
                            </div>
                            <div class="card-body p-0">
                                <div class="map-container bg-light d-flex align-items-center justify-content-center" style="height: 250px;">
                                    <div class="text-center">
                                        <i class="fas fa-map-marked-alt fa-3x text-muted mb-2"></i>
                                        <p class="text-muted mb-0">Enter locations to see route</p>
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
@endsection

@push('scripts')
<script>
    $(document).ready(function() {
        // Use current location
        $('#useCurrentLocation').on('click', function() {
            if (navigator.geolocation) {
                $(this).html('<i class="fas fa-spinner fa-spin"></i>');
                
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        
                        $('#pickup_latitude').val(lat);
                        $('#pickup_longitude').val(lng);
                        $('#pickup_address').val(`Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
                        
                        $('#useCurrentLocation').html('<i class="fas fa-check text-success"></i>');
                        setTimeout(() => {
                            $('#useCurrentLocation').html('<i class="fas fa-crosshairs"></i>');
                        }, 2000);
                        
                        calculateFare();
                    },
                    function(error) {
                        $('#useCurrentLocation').html('<i class="fas fa-crosshairs"></i>');
                        showToast('Unable to get location. Please enter manually.', 'warning');
                    }
                );
            } else {
                showToast('Geolocation is not supported by this browser.', 'error');
            }
        });
        
        // Quick location selection
        $('.quick-location').on('click', function() {
            const address = $(this).data('address');
            const lat = $(this).data('lat');
            const lng = $(this).data('lng');
            
            if ($('#pickup_address').val() === '') {
                $('#pickup_address').val(address);
                $('#pickup_latitude').val(lat);
                $('#pickup_longitude').val(lng);
            } else {
                $('#destination_address').val(address);
                $('#destination_latitude').val(lat);
                $('#destination_longitude').val(lng);
            }
            
            calculateFare();
        });
        
        // Calculate fare when addresses change
        $('#pickup_address, #destination_address').on('blur', function() {
            if ($('#pickup_address').val() && $('#destination_address').val()) {
                // For demo purposes, we'll use mock coordinates
                if (!$('#pickup_latitude').val()) {
                    $('#pickup_latitude').val(19.0760);
                    $('#pickup_longitude').val(72.8777);
                }
                if (!$('#destination_latitude').val()) {
                    $('#destination_latitude').val(19.0596);
                    $('#destination_longitude').val(72.8656);
                }
                calculateFare();
            }
        });
        
        // Ride type change
        $('#ride_type').on('change', function() {
            calculateFare();
        });
        
        function calculateFare() {
            const pickupLat = parseFloat($('#pickup_latitude').val());
            const pickupLng = parseFloat($('#pickup_longitude').val());
            const destLat = parseFloat($('#destination_latitude').val());
            const destLng = parseFloat($('#destination_longitude').val());
            const rideType = $('#ride_type').val();
            
            if (pickupLat && pickupLng && destLat && destLng) {
                // Calculate distance using Haversine formula
                const distance = calculateDistance(pickupLat, pickupLng, destLat, destLng);
                
                // Calculate fare based on ride type
                let baseFare, perKmRate;
                switch(rideType) {
                    case 'premium':
                        baseFare = 100;
                        perKmRate = 25;
                        break;
                    case 'shared':
                        baseFare = 25;
                        perKmRate = 8;
                        break;
                    default: // standard
                        baseFare = 50;
                        perKmRate = 15;
                }
                
                const fare = baseFare + (distance * perKmRate);
                const estimatedTime = Math.round((distance / 30) * 60); // 30 km/h average speed
                
                // Update UI
                $('#estimatedFare').text(`₹${Math.round(fare)}`);
                $('#estimatedDistance').text(`${distance.toFixed(1)} km`);
                $('#estimatedTime').text(`${estimatedTime} min`);
                $('#fareEstimate').show();
            }
        }
        
        function calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }
        
        // Form submission
        $('#bookRideForm').on('submit', function(e) {
            e.preventDefault();
            
            // Validate required fields
            if (!$('#pickup_address').val() || !$('#destination_address').val()) {
                showToast('Please enter both pickup and destination addresses.', 'warning');
                return;
            }
            
            if (!$('#pickup_latitude').val() || !$('#destination_latitude').val()) {
                showToast('Please select valid locations or use current location.', 'warning');
                return;
            }
            
            const $submitBtn = $('#submitBooking');
            $submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-2"></i>Finding Driver...');
            
            // Submit form
            $.post($(this).attr('action'), $(this).serialize())
            .done(function(response) {
                showToast('Ride request submitted successfully! Finding a driver...', 'success');
                setTimeout(() => {
                    window.location.href = response.redirect || '/passenger/dashboard';
                }, 2000);
            })
            .fail(function(xhr) {
                let errorMessage = 'Failed to book ride. Please try again.';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                showToast(errorMessage, 'danger');
                $submitBtn.prop('disabled', false).html('<i class="fas fa-search mr-2"></i>Find Driver');
            });
        });
    });
</script>
@endpush