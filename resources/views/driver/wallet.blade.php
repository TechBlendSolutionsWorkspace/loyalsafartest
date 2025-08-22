@extends('layouts.app')

@section('title', 'Driver Wallet - Loyal Safar')

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
                    <a class="nav-link active" href="{{ route('driver.wallet') }}">
                        <i class="fas fa-wallet mr-2"></i>Wallet & Payouts
                    </a>
                    <a class="nav-link" href="{{ route('driver.leaderboard') }}">
                        <i class="fas fa-trophy mr-2"></i>Leaderboard
                    </a>
                    <a class="nav-link" href="{{ route('driver.community') }}">
                        <i class="fas fa-users mr-2"></i>Driver Community
                    </a>
                    <a class="nav-link" href="{{ route('driver.profile') }}">
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
                            <i class="fas fa-wallet mr-2" style="color: var(--loyal-primary)"></i>
                            Wallet & Payouts
                        </h2>
                        <p class="text-muted mb-0">Manage your earnings and instant payouts</p>
                    </div>
                    
                    <button class="btn btn-success btn-ride" data-bs-toggle="modal" data-bs-target="#instantPayoutModal">
                        <i class="fas fa-money-bill-wave mr-2"></i>Instant Payout
                    </button>
                </div>

                <!-- Wallet Summary Cards -->
                <div class="row mb-4">
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card earnings-card">
                            <div class="card-body text-center" style="color: var(--indrive-white);">
                                <i class="fas fa-rupee-sign fa-3x mb-3"></i>
                                <h3 class="font-weight-bold">₹{{ number_format($wallet_balance ?? 0, 2) }}</h3>
                                <p class="mb-0">Available Balance</p>
                                <small class="opacity-75">Ready for payout</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card payout-card">
                            <div class="card-body text-center" style="color: var(--indrive-green);">
                                <i class="fas fa-chart-line fa-3x mb-3"></i>
                                <h3 class="font-weight-bold">₹{{ number_format($total_earnings ?? 0, 2) }}</h3>
                                <p class="mb-0" style="color: var(--indrive-dark);">Total Earnings</p>
                                <small style="color: var(--indrive-dark);">This month</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card payout-card">
                            <div class="card-body text-center" style="color: var(--indrive-blue);">
                                <i class="fas fa-exchange-alt fa-3x mb-3"></i>
                                <h3 class="font-weight-bold">{{ $total_payouts ?? 0 }}</h3>
                                <p class="mb-0" style="color: var(--indrive-dark);">Total Payouts</p>
                                <small style="color: var(--indrive-dark);">All time</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card commission-card">
                            <div class="card-body text-center">
                                <i class="fas fa-percentage fa-3x mb-3" style="color: var(--indrive-dark);"></i>
                                <h3 class="font-weight-bold" style="color: var(--indrive-dark);">{{ number_format($avg_commission ?? 0, 1) }}%</h3>
                                <p class="mb-0" style="color: var(--indrive-dark);">Avg Commission</p>
                                <small style="color: var(--indrive-dark);">Last 30 days</small>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">
                                    <i class="fas fa-bolt mr-2"></i>Quick Actions
                                </h5>
                                <div class="row">
                                    <div class="col-lg-3 col-md-6 mb-3">
                                        <button class="btn btn-ride btn-block h-100" data-bs-toggle="modal" data-bs-target="#instantPayoutModal">
                                            <i class="fas fa-money-bill-wave fa-2x d-block mb-2"></i>
                                            Instant Payout
                                            <small class="d-block">UPI/Bank Transfer</small>
                                        </button>
                                    </div>
                                    <div class="col-lg-3 col-md-6 mb-3">
                                        <button class="btn btn-block h-100" data-bs-toggle="modal" data-bs-target="#earningsModal" style="background: var(--indrive-blue); color: var(--indrive-white); border: none;">
                                            <i class="fas fa-chart-bar fa-2x d-block mb-2"></i>
                                            Earnings Report
                                            <small class="d-block">Detailed breakdown</small>
                                        </button>
                                    </div>
                                    <div class="col-lg-3 col-md-6 mb-3">
                                        <button class="btn btn-info btn-block h-100" data-bs-toggle="modal" data-bs-target="#bonusModal">
                                            <i class="fas fa-gift fa-2x d-block mb-2"></i>
                                            Bonus Eligible
                                            <small class="d-block">Check incentives</small>
                                        </button>
                                    </div>
                                    <div class="col-lg-3 col-md-6 mb-3">
                                        <button class="btn btn-warning btn-block h-100" id="taxDocuments">
                                            <i class="fas fa-file-invoice fa-2x d-block mb-2"></i>
                                            Tax Documents
                                            <small class="d-block">Download forms</small>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Transaction History -->
                <div class="row">
                    <div class="col-lg-8 mb-4">
                        <div class="card">
                            <div class="card-header" style="background: var(--indrive-green); color: var(--indrive-white);">
                                <h5 class="mb-0">
                                    <i class="fas fa-history mr-2"></i>
                                    Recent Transactions
                                </h5>
                            </div>
                            <div class="card-body">
                                @if(isset($transactions) && count($transactions) > 0)
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead style="background: var(--indrive-light); color: var(--indrive-dark);">
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Transaction</th>
                                                    <th>Ride/Ref</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                @foreach($transactions as $transaction)
                                                    <tr>
                                                        <td>
                                                            <div>{{ $transaction->created_at->format('M d, Y') }}</div>
                                                            <small class="text-muted">{{ $transaction->created_at->format('h:i A') }}</small>
                                                        </td>
                                                        <td>
                                                            <div class="d-flex align-items-center">
                                                                @if($transaction->transaction_type == 'credit')
                                                                    <i class="fas fa-arrow-down text-success mr-2"></i>
                                                                @else
                                                                    <i class="fas fa-arrow-up text-danger mr-2"></i>
                                                                @endif
                                                                <div>
                                                                    <strong>{{ ucfirst(str_replace('_', ' ', $transaction->reason)) }}</strong>
                                                                    <br><small class="text-muted">{{ ucfirst($transaction->source) }}</small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            @if($transaction->ride_id)
                                                                <span class="badge badge-primary">#{{ $transaction->ride_id }}</span>
                                                            @else
                                                                <span class="text-muted">-</span>
                                                            @endif
                                                        </td>
                                                        <td>
                                                            <strong style="color: {{ $transaction->transaction_type == 'credit' ? 'var(--indrive-green)' : 'var(--indrive-red)' }};">
                                                                {{ $transaction->transaction_type == 'credit' ? '+' : '-' }}₹{{ number_format($transaction->amount, 2) }}
                                                            </strong>
                                                        </td>
                                                        <td>
                                                            <span class="badge badge-{{ $transaction->status == 'completed' ? 'success' : ($transaction->status == 'pending' ? 'warning' : 'danger') }}">
                                                                {{ ucfirst($transaction->status) }}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                @endforeach
                                            </tbody>
                                        </table>
                                    </div>
                                @else
                                    <div class="text-center py-4">
                                        <i class="fas fa-wallet fa-3x text-muted mb-3"></i>
                                        <h5 class="text-muted">No Transactions Yet</h5>
                                        <p class="text-muted">Complete rides to start earning!</p>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>

                    <!-- Payout Methods -->
                    <div class="col-lg-4 mb-4">
                        <div class="card">
                            <div class="card-header" style="background: var(--indrive-green); color: var(--indrive-white);">
                                <h5 class="mb-0">
                                    <i class="fas fa-university mr-2"></i>
                                    Payout Methods
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="payout-method mb-3" id="upi-method">
                                    <div class="d-flex justify-content-between align-items-center p-3 border rounded" style="background: var(--indrive-white); border-color: var(--indrive-light);">
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-mobile-alt fa-2x mr-3" style="color: var(--indrive-green);"></i>
                                            <div>
                                                <h6 class="mb-0" style="color: var(--indrive-dark);">UPI Instant</h6>
                                                <small style="color: var(--indrive-green);">**** **** 9876</small>
                                            </div>
                                        </div>
                                        <span class="badge" style="background: var(--indrive-green); color: var(--indrive-white);">Active</span>
                                    </div>
                                </div>
                                
                                <div class="payout-method mb-3">
                                    <div class="d-flex justify-content-between align-items-center p-3 border rounded">
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-university fa-2x text-info mr-3"></i>
                                            <div>
                                                <h6 class="mb-0">Bank Transfer</h6>
                                                <small class="text-muted">HDFC Bank ****1234</small>
                                            </div>
                                        </div>
                                        <span class="badge badge-secondary">2-3 days</span>
                                    </div>
                                </div>
                                
                                <button class="btn btn-outline-primary btn-sm w-100" data-bs-toggle="modal" data-bs-target="#addPaymentModal">
                                    <i class="fas fa-plus mr-2"></i>Add Payment Method
                                </button>
                                
                                <div class="mt-4">
                                    <h6 class="mb-3">
                                        <i class="fas fa-info-circle mr-2"></i>Payout Info
                                    </h6>
                                    <ul class="list-unstyled small">
                                        <li class="mb-2">
                                            <i class="fas fa-check text-success mr-2"></i>
                                            UPI payouts are instant (24/7)
                                        </li>
                                        <li class="mb-2">
                                            <i class="fas fa-check text-success mr-2"></i>
                                            Bank transfers take 2-3 business days
                                        </li>
                                        <li class="mb-2">
                                            <i class="fas fa-check text-success mr-2"></i>
                                            No processing fees for payouts
                                        </li>
                                        <li class="mb-2">
                                            <i class="fas fa-check text-success mr-2"></i>
                                            Minimum payout: ₹100
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Weekly Earnings Chart -->
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header bg-info text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-chart-area mr-2"></i>
                                    Weekly Earnings Breakdown
                                </h5>
                            </div>
                            <div class="card-body">
                                <canvas id="earningsChart" height="100"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Instant Payout Modal -->
<div class="modal fade" id="instantPayoutModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header" style="background: var(--indrive-green); color: var(--indrive-white);">
                <h5 class="modal-title">
                    <i class="fas fa-money-bill-wave mr-2"></i>Instant Payout
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="text-center mb-4">
                    <h4 class="text-success">Available Balance</h4>
                    <h2 class="font-weight-bold">₹{{ number_format($wallet_balance ?? 0, 2) }}</h2>
                </div>
                
                <form id="payoutForm">
                    <div class="mb-3">
                        <label for="payout_amount" class="form-label">Payout Amount</label>
                        <div class="input-group">
                            <span class="input-group-text">₹</span>
                            <input type="number" class="form-control" id="payout_amount" 
                                   min="100" max="{{ $wallet_balance ?? 0 }}" step="1" required>
                        </div>
                        <small class="form-text text-muted">Minimum payout: ₹100</small>
                    </div>
                    
                    <div class="mb-3">
                        <label for="payout_method" class="form-label">Payout Method</label>
                        <select class="form-select" id="payout_method" required>
                            <option value="upi">UPI Instant (Immediate)</option>
                            <option value="bank">Bank Transfer (2-3 days)</option>
                        </select>
                    </div>
                    
                    <div class="mb-3" id="upi_section">
                        <label for="upi_id" class="form-label">UPI ID</label>
                        <input type="text" class="form-control" id="upi_id" placeholder="your-upi@paytm">
                    </div>
                    
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle mr-2"></i>
                        <strong>Instant UPI Payout:</strong> Money will be transferred immediately to your UPI account.
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-ride" id="processPayoutBtn">
                    <i class="fas fa-paper-plane mr-2"></i>Process Payout
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Earnings Modal -->
<div class="modal fade" id="earningsModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header" style="background: var(--loyal-gradient);">
                <h5 class="modal-title text-white">
                    <i class="fas fa-chart-bar mr-2"></i>Detailed Earnings Report
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="row mb-4">
                    <div class="col-md-4 text-center">
                        <h6>Total Rides</h6>
                        <h3 class="text-primary">{{ $total_rides ?? 0 }}</h3>
                    </div>
                    <div class="col-md-4 text-center">
                        <h6>Average Fare</h6>
                        <h3 class="text-success">₹{{ number_format($avg_fare ?? 0, 2) }}</h3>
                    </div>
                    <div class="col-md-4 text-center">
                        <h6>Commission Paid</h6>
                        <h3 class="text-warning">₹{{ number_format($total_commission ?? 0, 2) }}</h3>
                    </div>
                </div>
                
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Period</th>
                                <th>Rides</th>
                                <th>Gross Earnings</th>
                                <th>Commission</th>
                                <th>Net Earnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Today</td>
                                <td>5</td>
                                <td>₹850</td>
                                <td>₹85</td>
                                <td>₹765</td>
                            </tr>
                            <tr>
                                <td>This Week</td>
                                <td>32</td>
                                <td>₹5,280</td>
                                <td>₹528</td>
                                <td>₹4,752</td>
                            </tr>
                            <tr>
                                <td>This Month</td>
                                <td>142</td>
                                <td>₹24,870</td>
                                <td>₹2,487</td>
                                <td>₹22,383</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
    $(document).ready(function() {
        // Initialize earnings chart
        const ctx = document.getElementById('earningsChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Gross Earnings',
                    data: [450, 680, 720, 890, 650, 1200, 980],
                    backgroundColor: 'rgba(30, 136, 229, 0.8)',
                    borderColor: 'rgba(30, 136, 229, 1)',
                    borderWidth: 1
                }, {
                    label: 'Net Earnings',
                    data: [405, 612, 648, 801, 585, 1080, 882],
                    backgroundColor: 'rgba(67, 160, 71, 0.8)',
                    borderColor: 'rgba(67, 160, 71, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value;
                            }
                        }
                    }
                }
            }
        });
        
        // Payout form submission
        $('#processPayoutBtn').click(function() {
            const amount = $('#payout_amount').val();
            const method = $('#payout_method').val();
            
            if (!amount || amount < 100) {
                showToast('Minimum payout amount is ₹100', 'warning');
                return;
            }
            
            $(this).prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-2"></i>Processing...');
            
            $.post('/driver/payout', {
                amount: amount,
                method: method,
                upi_id: $('#upi_id').val(),
                _token: '{{ csrf_token() }}'
            })
            .done(function(response) {
                showToast('Payout processed successfully!', 'success');
                $('#instantPayoutModal').modal('hide');
                setTimeout(() => window.location.reload(), 1500);
            })
            .fail(function(xhr) {
                showToast(xhr.responseJSON?.message || 'Payout failed', 'danger');
            })
            .always(function() {
                $('#processPayoutBtn').prop('disabled', false).html('<i class="fas fa-paper-plane mr-2"></i>Process Payout');
            });
        });
        
        // Payout method change
        $('#payout_method').change(function() {
            if ($(this).val() === 'upi') {
                $('#upi_section').show();
            } else {
                $('#upi_section').hide();
            }
        });
        
        // Quick amount buttons
        $('.quick-amount').click(function() {
            const amount = $(this).data('amount');
            $('#payout_amount').val(amount);
        });
    });
</script>
@endpush