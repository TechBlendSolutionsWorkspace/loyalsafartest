@extends('layouts.app')

@section('title', 'Commission Slabs - Loyal Safar Admin')

@section('content')
<div class="container-fluid">
    <div class="row">
        <!-- Admin Sidebar -->
        <div class="col-md-3 col-lg-2 px-0">
            <div class="sidebar">
                <div class="p-4">
                    <h5 class="text-white">
                        <i class="fas fa-shield-alt mr-2"></i>
                        Loyal Safar Admin
                    </h5>
                    <small class="text-light opacity-75">Smart Commission Management</small>
                </div>
                
                <nav class="nav flex-column px-3">
                    <a class="nav-link" href="{{ route('admin.dashboard') }}">
                        <i class="fas fa-tachometer-alt mr-2"></i>Dashboard
                    </a>
                    <a class="nav-link active" href="{{ route('admin.commission-slabs') }}">
                        <i class="fas fa-calculator mr-2"></i>Commission Slabs
                    </a>
                    <a class="nav-link" href="{{ route('admin.users.index') }}">
                        <i class="fas fa-users mr-2"></i>User Management
                    </a>
                    <a class="nav-link" href="{{ route('admin.coupons') }}">
                        <i class="fas fa-tags mr-2"></i>Coupon Management
                    </a>
                    <a class="nav-link" href="{{ route('admin.reports') }}">
                        <i class="fas fa-chart-line mr-2"></i>Reports & Analytics
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
                            <i class="fas fa-calculator mr-2" style="color: var(--loyal-primary)"></i>
                            Commission Slabs Management
                        </h2>
                        <p class="text-muted mb-0">Intelligent commission management for sustainable growth</p>
                    </div>
                    
                    <button class="btn btn-primary btn-ride" data-bs-toggle="modal" data-bs-target="#createSlabModal">
                        <i class="fas fa-plus mr-2"></i>Create New Slab
                    </button>
                </div>

                <!-- Area Statistics -->
                <div class="row mb-4">
                    @foreach($areas as $area)
                        <div class="col-lg-3 col-md-6 mb-3">
                            <div class="card eco-card">
                                <div class="card-body text-center text-white">
                                    <i class="fas fa-map-marked-alt fa-2x mb-2"></i>
                                    <h5 class="font-weight-bold">{{ $area->name }}</h5>
                                    <p class="mb-1">{{ $area->commission_slabs_count }} Slabs Active</p>
                                    <small>Base: ₹{{ $area->base_fare }} | Per KM: ₹{{ $area->per_km_rate }}</small>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>

                <!-- Commission Slabs by Area -->
                @foreach($areas as $area)
                    <div class="card mb-4">
                        <div class="card-header" style="background: var(--loyal-gradient);">
                            <h5 class="mb-0 text-white">
                                <i class="fas fa-map-marker-alt mr-2"></i>
                                {{ $area->name }} Commission Structure
                                <span class="badge badge-light ml-2">{{ $area->commission_slabs->count() }} Slabs</span>
                            </h5>
                        </div>
                        <div class="card-body">
                            @if($area->commission_slabs->count() > 0)
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Fare Range</th>
                                                <th>Commission Type</th>
                                                <th>Commission Value</th>
                                                <th>Default</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @foreach($area->commission_slabs as $slab)
                                                <tr>
                                                    <td>
                                                        <strong>₹{{ number_format($slab->min_fare, 2) }}</strong>
                                                        @if($slab->max_fare)
                                                            - <strong>₹{{ number_format($slab->max_fare, 2) }}</strong>
                                                        @else
                                                            <span class="text-success">& Above</span>
                                                        @endif
                                                    </td>
                                                    <td>
                                                        <span class="badge badge-{{ $slab->commission_type == 'percentage' ? 'primary' : 'info' }}">
                                                            {{ ucfirst($slab->commission_type) }}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <strong class="text-success">
                                                            @if($slab->commission_type == 'percentage')
                                                                {{ $slab->commission_value }}%
                                                            @else
                                                                ₹{{ number_format($slab->commission_value, 2) }}
                                                            @endif
                                                        </strong>
                                                    </td>
                                                    <td>
                                                        @if($slab->is_default)
                                                            <span class="badge badge-warning">
                                                                <i class="fas fa-star mr-1"></i>Default
                                                            </span>
                                                        @else
                                                            <span class="text-muted">-</span>
                                                        @endif
                                                    </td>
                                                    <td>
                                                        <span class="badge badge-{{ $slab->active ? 'success' : 'secondary' }}">
                                                            {{ $slab->active ? 'Active' : 'Inactive' }}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div class="btn-group" role="group">
                                                            <button class="btn btn-sm btn-outline-primary edit-slab" 
                                                                    data-slab="{{ json_encode($slab) }}">
                                                                <i class="fas fa-edit"></i>
                                                            </button>
                                                            @if(!$slab->is_default)
                                                                <button class="btn btn-sm btn-outline-warning set-default-slab" 
                                                                        data-slab-id="{{ $slab->id }}">
                                                                    <i class="fas fa-star"></i>
                                                                </button>
                                                            @endif
                                                            <button class="btn btn-sm btn-outline-{{ $slab->active ? 'secondary' : 'success' }} toggle-slab" 
                                                                    data-slab-id="{{ $slab->id }}">
                                                                <i class="fas fa-power-off"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            @else
                                <div class="text-center py-4">
                                    <i class="fas fa-calculator fa-3x text-muted mb-3"></i>
                                    <h5 class="text-muted">No Commission Slabs</h5>
                                    <p class="text-muted">Create commission slabs for {{ $area->name }} to start earning</p>
                                    <button class="btn btn-primary btn-ride create-slab-for-area" data-area-id="{{ $area->id }}">
                                        <i class="fas fa-plus mr-2"></i>Create First Slab
                                    </button>
                                </div>
                            @endif
                        </div>
                    </div>
                @endforeach

                <!-- Commission Calculator Preview -->
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0">
                            <i class="fas fa-calculator mr-2"></i>
                            Commission Calculator Preview
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4">
                                <label for="calc_area" class="form-label">Select Area</label>
                                <select class="form-select" id="calc_area">
                                    @foreach($areas as $area)
                                        <option value="{{ $area->id }}">{{ $area->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label for="calc_fare" class="form-label">Ride Fare</label>
                                <input type="number" class="form-control" id="calc_fare" placeholder="Enter fare amount" min="0" step="0.01">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">&nbsp;</label>
                                <button class="btn btn-success d-block w-100" id="calculateCommission">
                                    <i class="fas fa-calculator mr-2"></i>Calculate
                                </button>
                            </div>
                        </div>
                        
                        <div class="mt-4" id="commission_result" style="display: none;">
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="text-center p-3 bg-light rounded">
                                        <h6>Ride Fare</h6>
                                        <h4 class="text-primary" id="result_fare">₹0</h4>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="text-center p-3 bg-light rounded">
                                        <h6>Commission</h6>
                                        <h4 class="text-warning" id="result_commission">₹0</h4>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="text-center p-3 bg-light rounded">
                                        <h6>Driver Payout</h6>
                                        <h4 class="text-success" id="result_payout">₹0</h4>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="text-center p-3 bg-light rounded">
                                        <h6>Slab Used</h6>
                                        <p class="mb-0" id="result_slab_info"></p>
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

<!-- Create/Edit Commission Slab Modal -->
<div class="modal fade" id="createSlabModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header" style="background: var(--loyal-gradient);">
                <h5 class="modal-title text-white">
                    <i class="fas fa-plus mr-2"></i>Create Commission Slab
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="slabForm">
                    <input type="hidden" id="slab_id" name="slab_id">
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="area_id" class="form-label">
                                <i class="fas fa-map-marker-alt mr-1"></i>Area
                            </label>
                            <select class="form-select" id="area_id" name="area_id" required>
                                <option value="">Select Area</option>
                                @foreach($areas as $area)
                                    <option value="{{ $area->id }}">{{ $area->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <label for="commission_type" class="form-label">
                                <i class="fas fa-percentage mr-1"></i>Commission Type
                            </label>
                            <select class="form-select" id="commission_type" name="commission_type" required>
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="min_fare" class="form-label">
                                <i class="fas fa-rupee-sign mr-1"></i>Minimum Fare
                            </label>
                            <input type="number" class="form-control" id="min_fare" name="min_fare" 
                                   placeholder="0.00" min="0" step="0.01" required>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <label for="max_fare" class="form-label">
                                <i class="fas fa-rupee-sign mr-1"></i>Maximum Fare
                                <small class="text-muted">(Leave empty for no limit)</small>
                            </label>
                            <input type="number" class="form-control" id="max_fare" name="max_fare" 
                                   placeholder="Leave empty for unlimited" min="0" step="0.01">
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="commission_value" class="form-label">
                                <i class="fas fa-calculator mr-1"></i>Commission Value
                            </label>
                            <input type="number" class="form-control" id="commission_value" name="commission_value" 
                                   placeholder="Enter percentage or amount" min="0" step="0.01" required>
                            <small class="form-text text-muted" id="commission_help">
                                Enter percentage (e.g., 15 for 15%) or fixed amount (e.g., 50 for ₹50)
                            </small>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <div class="form-check mt-4">
                                <input class="form-check-input" type="checkbox" id="is_default" name="is_default">
                                <label class="form-check-label" for="is_default">
                                    <i class="fas fa-star text-warning mr-1"></i>
                                    Set as Default Slab
                                </label>
                                <small class="form-text text-muted">
                                    Used when no other slab matches the fare range
                                </small>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="saveSlabBtn">
                    <i class="fas fa-save mr-2"></i>Save Commission Slab
                </button>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<!-- Bootstrap 5 JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<script>
    $(document).ready(function() {
        // Commission type change handler
        $('#commission_type').change(function() {
            const type = $(this).val();
            const helpText = type === 'percentage' 
                ? 'Enter percentage (e.g., 15 for 15%)'
                : 'Enter fixed amount (e.g., 50 for ₹50)';
            $('#commission_help').text(helpText);
        });
        
        // Save commission slab
        $('#saveSlabBtn').click(function() {
            const formData = {
                area_id: $('#area_id').val(),
                min_fare: $('#min_fare').val(),
                max_fare: $('#max_fare').val() || null,
                commission_type: $('#commission_type').val(),
                commission_value: $('#commission_value').val(),
                is_default: $('#is_default').is(':checked'),
                _token: '{{ csrf_token() }}'
            };
            
            const slabId = $('#slab_id').val();
            const url = slabId ? `/admin/commission-slabs/${slabId}` : '/admin/commission-slabs';
            const method = slabId ? 'PUT' : 'POST';
            
            $.ajax({
                url: url,
                method: method,
                data: formData,
                success: function(response) {
                    showToast('Commission slab saved successfully!', 'success');
                    $('#createSlabModal').modal('hide');
                    setTimeout(() => window.location.reload(), 1000);
                },
                error: function(xhr) {
                    const errors = xhr.responseJSON?.errors;
                    if (errors) {
                        Object.values(errors).forEach(error => {
                            showToast(error[0], 'danger');
                        });
                    } else {
                        showToast('Failed to save commission slab', 'danger');
                    }
                }
            });
        });
        
        // Edit slab
        $('.edit-slab').click(function() {
            const slab = $(this).data('slab');
            
            $('#slab_id').val(slab.id);
            $('#area_id').val(slab.area_id);
            $('#min_fare').val(slab.min_fare);
            $('#max_fare').val(slab.max_fare);
            $('#commission_type').val(slab.commission_type);
            $('#commission_value').val(slab.commission_value);
            $('#is_default').prop('checked', slab.is_default);
            
            $('.modal-title').html('<i class="fas fa-edit mr-2"></i>Edit Commission Slab');
            $('#createSlabModal').modal('show');
        });
        
        // Commission calculator
        $('#calculateCommission').click(function() {
            const areaId = $('#calc_area').val();
            const fare = parseFloat($('#calc_fare').val());
            
            if (!fare || fare <= 0) {
                showToast('Please enter a valid fare amount', 'warning');
                return;
            }
            
            $.get(`/admin/commission-slabs/calculate?area_id=${areaId}&fare=${fare}`)
            .done(function(response) {
                $('#result_fare').text(`₹${fare.toFixed(2)}`);
                $('#result_commission').text(`₹${response.commission.toFixed(2)}`);
                $('#result_payout').text(`₹${response.driver_payout.toFixed(2)}`);
                $('#result_slab_info').html(`
                    <small>${response.slab_type} Commission</small><br>
                    <strong>${response.commission_display}</strong>
                `);
                $('#commission_result').show();
            })
            .fail(function() {
                showToast('Failed to calculate commission', 'danger');
            });
        });
        
        // Set default slab
        $('.set-default-slab').click(function() {
            const slabId = $(this).data('slab-id');
            
            if (confirm('Set this slab as default for the area?')) {
                $.post(`/admin/commission-slabs/${slabId}/set-default`, {
                    _token: '{{ csrf_token() }}'
                })
                .done(function() {
                    showToast('Default slab updated successfully!', 'success');
                    setTimeout(() => window.location.reload(), 1000);
                })
                .fail(function() {
                    showToast('Failed to update default slab', 'danger');
                });
            }
        });
        
        // Toggle slab status
        $('.toggle-slab').click(function() {
            const slabId = $(this).data('slab-id');
            
            $.post(`/admin/commission-slabs/${slabId}/toggle`, {
                _token: '{{ csrf_token() }}'
            })
            .done(function(response) {
                showToast(response.message, 'success');
                setTimeout(() => window.location.reload(), 1000);
            })
            .fail(function() {
                showToast('Failed to toggle slab status', 'danger');
            });
        });
    });
</script>
@endpush