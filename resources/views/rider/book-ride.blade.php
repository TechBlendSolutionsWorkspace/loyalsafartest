@extends('layouts.app')

@section('title', 'Book a Ride - Loyal Safar')

@section('content')
<div class="container-fluid p-0">
    <!-- Hero Section with Booking Form -->
    <div class="hero-section" style="background: var(--indrive-gradient); min-height: 100vh;">
        <div class="container">
            <div class="row align-items-center min-vh-100">
                <div class="col-lg-6">
                    <div class="hero-content text-white py-5">
                        <h1 class="display-4 font-weight-bold mb-3">
                            <i class="fas fa-leaf mr-3 text-success"></i>
                            Loyal Safar
                        </h1>
                        <p class="lead mb-4">Your trusted eco-friendly ride partner. Every journey matters for a greener tomorrow.</p>
                        
                        <!-- Features Grid -->
                        <div class="row">
                            <div class="col-6 mb-3">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-shield-check fa-2x mr-3 text-success"></i>
                                    <div>
                                        <h6 class="mb-0">100% Safe</h6>
                                        <small class="opacity-75">Verified drivers</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 mb-3">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-bolt fa-2x mr-3 text-warning"></i>
                                    <div>
                                        <h6 class="mb-0">Instant Booking</h6>
                                        <small class="opacity-75">Quick rides</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 mb-3">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-leaf fa-2x mr-3 text-success"></i>
                                    <div>
                                        <h6 class="mb-0">Eco-Friendly</h6>
                                        <small class="opacity-75">Green rides</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 mb-3">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-tags fa-2x mr-3 text-info"></i>
                                    <div>
                                        <h6 class="mb-0">Best Prices</h6>
                                        <small class="opacity-75">Smart coupons</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-6">
                    <!-- Modern Booking Form -->
                    <div class="booking-card bg-white rounded-4 shadow-lg p-4 mx-3">
                        <div class="text-center mb-4">
                            <h3 class="font-weight-bold" style="color: var(--loyal-primary)">
                                <i class="fas fa-route mr-2"></i>Book Your Ride
                            </h3>
                            <p class="text-muted">Smart. Safe. Sustainable.</p>
                        </div>
                        
                        <form id="loyalBookingForm">
                            @csrf
                            
                            <!-- Location Inputs with Animation -->
                            <div class="location-inputs mb-4">
                                <div class="position-relative mb-3">
                                    <div class="location-icon">
                                        <i class="fas fa-circle text-success"></i>
                                    </div>
                                    <input type="text" class="form-control form-control-lg location-input" 
                                           id="pickup_location" name="pickup_location" 
                                           placeholder="Pickup location" required>
                                    <button type="button" class="btn btn-outline-success btn-sm location-btn" id="useCurrentLocation">
                                        <i class="fas fa-crosshairs"></i>
                                    </button>
                                </div>
                                
                                <div class="location-connector">
                                    <div class="connector-line"></div>
                                    <button type="button" class="btn btn-sm btn-outline-primary swap-locations">
                                        <i class="fas fa-exchange-alt"></i>
                                    </button>
                                </div>
                                
                                <div class="position-relative mb-3">
                                    <div class="location-icon">
                                        <i class="fas fa-map-marker-alt text-danger"></i>
                                    </div>
                                    <input type="text" class="form-control form-control-lg location-input" 
                                           id="destination_location" name="destination_location" 
                                           placeholder="Where to?" required>
                                </div>
                            </div>
                            
                            <!-- Ride Options Carousel -->
                            <div class="ride-options-carousel mb-4">
                                <h6 class="mb-3">
                                    <i class="fas fa-car mr-2"></i>Choose Your Ride
                                </h6>
                                <div class="swiper ride-options-swiper">
                                    <div class="swiper-wrapper">
                                        <div class="swiper-slide">
                                            <div class="ride-option-card active" data-type="economy">
                                                <div class="ride-icon">
                                                    <i class="fas fa-car"></i>
                                                </div>
                                                <h6>Economy</h6>
                                                <p class="small">₹15/km</p>
                                                <div class="eco-badge">
                                                    <i class="fas fa-leaf"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="swiper-slide">
                                            <div class="ride-option-card" data-type="premium">
                                                <div class="ride-icon">
                                                    <i class="fas fa-crown"></i>
                                                </div>
                                                <h6>Premium</h6>
                                                <p class="small">₹25/km</p>
                                            </div>
                                        </div>
                                        <div class="swiper-slide">
                                            <div class="ride-option-card" data-type="shared">
                                                <div class="ride-icon">
                                                    <i class="fas fa-users"></i>
                                                </div>
                                                <h6>Shared</h6>
                                                <p class="small">₹8/km</p>
                                                <div class="eco-badge">
                                                    <i class="fas fa-recycle"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="swiper-slide">
                                            <div class="ride-option-card" data-type="green">
                                                <div class="ride-icon">
                                                    <i class="fas fa-leaf"></i>
                                                </div>
                                                <h6>Green Ride</h6>
                                                <p class="small">₹12/km</p>
                                                <div class="eco-badge bg-success">
                                                    <i class="fas fa-battery-three-quarters"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Coupon Section -->
                            <div class="coupon-section mb-4">
                                <div class="d-flex align-items-center justify-content-between">
                                    <h6 class="mb-0">
                                        <i class="fas fa-tags mr-2"></i>Coupons & Offers
                                    </h6>
                                    <button type="button" class="btn btn-sm btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#couponCollapse">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                                
                                <div class="collapse mt-3" id="couponCollapse">
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="coupon_code" 
                                               placeholder="Enter coupon code" style="background: var(--indrive-light); border-color: var(--indrive-light);">
                                        <button class="btn btn-ride" type="button" id="applyCoupon">
                                            Apply
                                        </button>
                                    </div>
                                    
                                    <!-- Available Coupons -->
                                    <div class="available-coupons mt-3">
                                        <small class="text-muted d-block mb-2">Available offers:</small>
                                        <div class="coupon-chips">
                                            <span class="badge me-2 mb-1 coupon-chip" data-code="FIRST50" style="background: var(--indrive-green); color: var(--indrive-white);">
                                                FIRST50 - ₹50 off
                                            </span>
                                            <span class="badge me-2 mb-1 coupon-chip" data-code="LOYAL20" style="background: var(--indrive-blue); color: var(--indrive-white);">
                                                LOYAL20 - 20% off
                                            </span>
                                            <span class="badge me-2 mb-1 coupon-chip" data-code="GREEN15" style="background: var(--indrive-green); color: var(--indrive-white);">
                                                GREEN15 - ₹15 off eco rides
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Fare Estimate -->
                            <div class="fare-estimate-card mb-4" id="fareEstimate" style="display: none;">
                                <div class="row text-center">
                                    <div class="col-4">
                                        <div class="fare-item">
                                            <h6 class="fare-value" id="estimatedFare">₹0</h6>
                                            <small class="text-muted">Estimated Fare</small>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="fare-item">
                                            <h6 class="fare-value text-success" id="discountAmount">-₹0</h6>
                                            <small class="text-muted">Discount</small>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="fare-item">
                                            <h6 class="fare-value text-primary" id="finalFare">₹0</h6>
                                            <small class="text-muted">You Pay</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Book Now Button -->
                            <button type="submit" class="btn btn-primary btn-lg w-100 btn-ride">
                                <i class="fas fa-search mr-2"></i>
                                Find Loyal Driver
                            </button>
                            
                            <!-- Additional Options -->
                            <div class="additional-options mt-3">
                                <div class="row">
                                    <div class="col-6">
                                        <button type="button" class="btn btn-outline-secondary btn-sm w-100" data-bs-toggle="modal" data-bs-target="#scheduleModal">
                                            <i class="fas fa-clock mr-1"></i>Schedule
                                        </button>
                                    </div>
                                    <div class="col-6">
                                        <button type="button" class="btn btn-panic btn-sm w-100" data-bs-toggle="modal" data-bs-target="#emergencyModal">
                                            <i class="fas fa-exclamation-triangle mr-1"></i>Emergency
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Features Section -->
    <div class="features-section py-5 bg-light">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="font-weight-bold" style="color: var(--loyal-primary)">
                    Why Choose Loyal Safar?
                </h2>
                <p class="text-muted">Experience the future of sustainable transportation</p>
            </div>
            
            <div class="row">
                <div class="col-lg-3 col-md-6 mb-4">
                    <div class="feature-card text-center h-100">
                        <div class="feature-icon eco-card d-inline-flex align-items-center justify-content-center rounded-circle mb-3">
                            <i class="fas fa-leaf fa-2x text-white"></i>
                        </div>
                        <h5>Eco-Friendly Rides</h5>
                        <p class="text-muted">Choose from electric and hybrid vehicles for a greener future</p>
                    </div>
                </div>
                
                <div class="col-lg-3 col-md-6 mb-4">
                    <div class="feature-card text-center h-100">
                        <div class="feature-icon earnings-card d-inline-flex align-items-center justify-content-center rounded-circle mb-3">
                            <i class="fas fa-share-alt fa-2x text-white"></i>
                        </div>
                        <h5>Live Ride Sharing</h5>
                        <p class="text-muted">Share your ride status with family and friends for safety</p>
                    </div>
                </div>
                
                <div class="col-lg-3 col-md-6 mb-4">
                    <div class="feature-card text-center h-100">
                        <div class="feature-icon eco-card d-inline-flex align-items-center justify-content-center rounded-circle mb-3">
                            <i class="fas fa-gift fa-2x text-white"></i>
                        </div>
                        <h5>Loyalty Rewards</h5>
                        <p class="text-muted">Earn points with every ride and unlock exclusive benefits</p>
                    </div>
                </div>
                
                <div class="col-lg-3 col-md-6 mb-4">
                    <div class="feature-card text-center h-100">
                        <div class="feature-icon earnings-card d-inline-flex align-items-center justify-content-center rounded-circle mb-3">
                            <i class="fas fa-shield-alt fa-2x text-white"></i>
                        </div>
                        <h5>Panic Button</h5>
                        <p class="text-muted">Emergency alerts sent instantly to your emergency contacts</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Schedule Ride Modal -->
<div class="modal fade" id="scheduleModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="fas fa-clock mr-2"></i>Schedule Ride
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="schedule_date" class="form-label">Date</label>
                    <input type="date" class="form-control" id="schedule_date" min="{{ date('Y-m-d') }}">
                </div>
                <div class="mb-3">
                    <label for="schedule_time" class="form-label">Time</label>
                    <input type="time" class="form-control" id="schedule_time">
                </div>
                <div class="mb-3">
                    <label for="schedule_note" class="form-label">Special Instructions</label>
                    <textarea class="form-control" id="schedule_note" rows="3" placeholder="Any special requirements..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary">Schedule Ride</button>
            </div>
        </div>
    </div>
</div>

<!-- Emergency Modal -->
<div class="modal fade" id="emergencyModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header" style="background: var(--indrive-red); color: var(--indrive-white);">
                <h5 class="modal-title">
                    <i class="fas fa-exclamation-triangle mr-2"></i>Emergency Contacts
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p class="text-muted mb-4">Add emergency contacts who will be notified with your live location during rides</p>
                
                <div id="emergencyContacts">
                    <!-- Emergency contacts will be loaded here -->
                </div>
                
                <button class="btn btn-outline-primary w-100" id="addEmergencyContact">
                    <i class="fas fa-plus mr-2"></i>Add Emergency Contact
                </button>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success" id="saveEmergencyContacts">
                    <i class="fas fa-save mr-2"></i>Save Contacts
                </button>
            </div>
        </div>
    </div>
</div>

@endsection

@push('styles')
<style>
    .hero-section {
        position: relative;
        overflow: hidden;
    }
    
    .hero-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="white" opacity="0.1"><path d="M0,0v50c25,25 75,25 100,0s75-25 100,0 75,25 100,0 75-25 100,0 75,25 100,0 75-25 100,0 75,25 100,0 75-25 100,0 75,25 100,0V0H0z"/></svg>');
        animation: wave 20s ease-in-out infinite;
    }
    
    @keyframes wave {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(-50px); }
    }
    
    .booking-card {
        position: relative;
        z-index: 2;
        border: none;
        animation: slideUp 0.8s ease-out;
    }
    
    @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    .location-inputs {
        position: relative;
    }
    
    .location-input {
        padding-left: 50px;
        padding-right: 50px;
        border: 2px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .location-input:focus {
        border-color: var(--loyal-primary);
        box-shadow: 0 0 0 0.2rem rgba(30, 136, 229, 0.25);
    }
    
    .location-icon {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 3;
    }
    
    .location-btn {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 3;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        padding: 0;
    }
    
    .location-connector {
        position: absolute;
        left: 25px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;
    }
    
    .connector-line {
        width: 2px;
        height: 30px;
        background: linear-gradient(to bottom, var(--loyal-primary), var(--loyal-secondary));
        margin: 0 auto;
    }
    
    .swap-locations {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        width: 30px;
        height: 30px;
        padding: 0;
        background: white;
    }
    
    .ride-options-swiper {
        padding: 10px 0;
    }
    
    .ride-option-card {
        background: white;
        border: 2px solid #e9ecef;
        border-radius: 15px;
        padding: 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    
    .ride-option-card:hover {
        border-color: var(--loyal-primary);
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(30, 136, 229, 0.15);
    }
    
    .ride-option-card.active {
        border-color: var(--loyal-primary);
        background: linear-gradient(135deg, var(--loyal-primary), var(--loyal-secondary));
        color: white;
    }
    
    .ride-icon {
        font-size: 2rem;
        margin-bottom: 10px;
        color: var(--loyal-primary);
    }
    
    .ride-option-card.active .ride-icon {
        color: white;
    }
    
    .eco-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: var(--loyal-accent);
        color: white;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
    }
    
    .fare-estimate-card {
        background: var(--loyal-light);
        border-radius: 15px;
        padding: 20px;
        border: 1px solid var(--loyal-accent);
    }
    
    .fare-item {
        padding: 10px;
    }
    
    .fare-value {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0;
    }
    
    .coupon-chip {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .coupon-chip:hover {
        transform: scale(1.05);
    }
    
    .feature-card {
        background: white;
        border-radius: 20px;
        padding: 30px 20px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        transition: transform 0.3s ease;
    }
    
    .feature-card:hover {
        transform: translateY(-10px);
    }
    
    .feature-icon {
        width: 70px;
        height: 70px;
        margin: 0 auto;
    }
    
    .btn-ride {
        position: relative;
        overflow: hidden;
    }
    
    .btn-ride::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
    }
    
    .btn-ride:hover::before {
        left: 100%;
    }
</style>
@endpush

@push('scripts')
<!-- Swiper JS -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

<script>
    $(document).ready(function() {
        // Initialize Swiper for ride options
        const rideSwiper = new Swiper('.ride-options-swiper', {
            slidesPerView: 2.5,
            spaceBetween: 15,
            freeMode: true,
            breakpoints: {
                768: {
                    slidesPerView: 3.5,
                },
                992: {
                    slidesPerView: 2.5,
                }
            }
        });
        
        // Ride option selection
        $('.ride-option-card').click(function() {
            $('.ride-option-card').removeClass('active');
            $(this).addClass('active');
            calculateFare();
        });
        
        // Current location
        $('#useCurrentLocation').click(function() {
            if (navigator.geolocation) {
                $(this).html('<i class="fas fa-spinner fa-spin"></i>');
                
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        $('#pickup_location').val('Current Location');
                        $('#useCurrentLocation').html('<i class="fas fa-check text-success"></i>');
                        setTimeout(() => {
                            $('#useCurrentLocation').html('<i class="fas fa-crosshairs"></i>');
                        }, 2000);
                        calculateFare();
                    },
                    function(error) {
                        $('#useCurrentLocation').html('<i class="fas fa-crosshairs"></i>');
                        showToast('Unable to get location', 'warning');
                    }
                );
            }
        });
        
        // Swap locations
        $('.swap-locations').click(function() {
            const pickup = $('#pickup_location').val();
            const destination = $('#destination_location').val();
            
            $('#pickup_location').val(destination);
            $('#destination_location').val(pickup);
            
            $(this).addClass('animate__animated animate__rotateIn');
            setTimeout(() => {
                $(this).removeClass('animate__animated animate__rotateIn');
            }, 500);
        });
        
        // Apply coupon
        $('#applyCoupon').click(function() {
            const code = $('#coupon_code').val();
            if (code) {
                applyCoupon(code);
            }
        });
        
        // Coupon chip selection
        $('.coupon-chip').click(function() {
            const code = $(this).data('code');
            $('#coupon_code').val(code);
            applyCoupon(code);
        });
        
        // Calculate fare
        function calculateFare() {
            const pickup = $('#pickup_location').val();
            const destination = $('#destination_location').val();
            const rideType = $('.ride-option-card.active').data('type');
            
            if (pickup && destination && rideType) {
                // Simulate fare calculation
                const distance = Math.random() * 20 + 5; // 5-25 km
                let rate;
                
                switch(rideType) {
                    case 'economy': rate = 15; break;
                    case 'premium': rate = 25; break;
                    case 'shared': rate = 8; break;
                    case 'green': rate = 12; break;
                    default: rate = 15;
                }
                
                const baseFare = 50;
                const fare = baseFare + (distance * rate);
                
                $('#estimatedFare').text(`₹${Math.round(fare)}`);
                $('#finalFare').text(`₹${Math.round(fare)}`);
                $('#fareEstimate').slideDown();
            }
        }
        
        // Apply coupon function
        function applyCoupon(code) {
            $.post('/rider/apply-coupon', {
                code: code,
                _token: '{{ csrf_token() }}'
            })
            .done(function(response) {
                const discount = response.discount;
                const currentFare = parseInt($('#estimatedFare').text().replace('₹', ''));
                const finalFare = Math.max(0, currentFare - discount);
                
                $('#discountAmount').text(`-₹${discount}`);
                $('#finalFare').text(`₹${finalFare}`);
                
                showToast(`Coupon applied! ₹${discount} discount`, 'success');
                $('#couponCollapse').collapse('hide');
            })
            .fail(function(xhr) {
                showToast(xhr.responseJSON?.message || 'Invalid coupon code', 'danger');
            });
        }
        
        // Booking form submission
        $('#loyalBookingForm').submit(function(e) {
            e.preventDefault();
            
            const pickup = $('#pickup_location').val();
            const destination = $('#destination_location').val();
            const rideType = $('.ride-option-card.active').data('type');
            
            if (!pickup || !destination) {
                showToast('Please enter pickup and destination', 'warning');
                return;
            }
            
            // Show OTP verification modal
            $('#otpModal').modal('show');
        });
        
        // Emergency contact management
        $('#addEmergencyContact').click(function() {
            const contactHtml = `
                <div class="emergency-contact-item mb-3">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Contact name">
                        <input type="tel" class="form-control" placeholder="Phone number">
                        <button class="btn btn-outline-danger remove-contact" type="button">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            $('#emergencyContacts').append(contactHtml);
        });
        
        // Remove emergency contact
        $(document).on('click', '.remove-contact', function() {
            $(this).closest('.emergency-contact-item').remove();
        });
        
        // Location input changes
        $('#pickup_location, #destination_location').on('input', function() {
            calculateFare();
        });
    });
</script>
@endpush