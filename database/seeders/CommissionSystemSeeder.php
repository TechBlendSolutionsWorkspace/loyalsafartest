<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Area;
use App\Models\CommissionSlab;
use App\Models\Coupon;
use App\Models\User;
use App\Models\Ride;
use Illuminate\Support\Facades\Hash;

class CommissionSystemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Seeding Commission System Data...');
        
        // Create Areas (Kolkata/Howrah focus)
        $areas = [
            ['name' => 'Kolkata Central', 'city' => 'Kolkata', 'state' => 'West Bengal'],
            ['name' => 'Salt Lake', 'city' => 'Kolkata', 'state' => 'West Bengal'],
            ['name' => 'Howrah Station', 'city' => 'Howrah', 'state' => 'West Bengal'],
            ['name' => 'Park Street', 'city' => 'Kolkata', 'state' => 'West Bengal'],
            ['name' => 'Sector V', 'city' => 'Kolkata', 'state' => 'West Bengal'],
            ['name' => 'Belur Math', 'city' => 'Howrah', 'state' => 'West Bengal'],
            ['name' => 'New Town', 'city' => 'Kolkata', 'state' => 'West Bengal']
        ];

        foreach ($areas as $areaData) {
            Area::firstOrCreate(['name' => $areaData['name']], $areaData);
        }

        $this->command->info('Areas created successfully');

        // Create Commission Slabs for each area
        $areas = Area::all();
        
        foreach ($areas as $area) {
            // Bike commission slabs (lower rates for affordable transport)
            CommissionSlab::firstOrCreate([
                'area_id' => $area->id,
                'min_fare' => 0,
                'max_fare' => 50
            ], [
                'commission_type' => 'percentage',
                'commission_value' => 8, // 8% for low fares
                'is_default' => true,
                'active' => true
            ]);

            CommissionSlab::firstOrCreate([
                'area_id' => $area->id,
                'min_fare' => 51,
                'max_fare' => 150
            ], [
                'commission_type' => 'percentage',
                'commission_value' => 12, // 12% for medium fares
                'is_default' => false,
                'active' => true
            ]);

            CommissionSlab::firstOrCreate([
                'area_id' => $area->id,
                'min_fare' => 151,
                'max_fare' => 300
            ], [
                'commission_type' => 'percentage',
                'commission_value' => 15, // 15% for higher fares
                'is_default' => false,
                'active' => true
            ]);

            CommissionSlab::firstOrCreate([
                'area_id' => $area->id,
                'min_fare' => 301,
                'max_fare' => 99999
            ], [
                'commission_type' => 'fixed',
                'commission_value' => 50, // Fixed ₹50 for premium rides
                'is_default' => false,
                'active' => true
            ]);
        }

        $this->command->info('Commission slabs created successfully');

        // Create Sample Coupons
        $coupons = [
            [
                'code' => 'WELCOME50',
                'name' => 'Welcome Bonus',
                'description' => 'Welcome to Loyal Safar! Get ₹50 off your first ride',
                'discount_type' => 'fixed',
                'discount_value' => 50,
                'min_fare' => 100,
                'max_discount' => 50,
                'usage_limit' => 1000,
                'usage_limit_per_user' => 1,
                'used_count' => 0,
                'valid_from' => now()->toDateString(),
                'valid_until' => now()->addMonths(3)->toDateString(),
                'user_type' => 'new_users',
                'active' => true,
                'created_by' => 'System'
            ],
            [
                'code' => 'GREEN20',
                'name' => 'Green Ride Discount',
                'description' => 'Go green with Loyal Safar! 20% off on eco-friendly rides',
                'discount_type' => 'percentage',
                'discount_value' => 20,
                'min_fare' => 75,
                'max_discount' => 100,
                'usage_limit' => 500,
                'usage_limit_per_user' => 5,
                'used_count' => 0,
                'valid_from' => now()->toDateString(),
                'valid_until' => now()->addMonths(2)->toDateString(),
                'user_type' => 'all',
                'active' => true,
                'created_by' => 'System'
            ],
            [
                'code' => 'KOLKATA15',
                'name' => 'Kolkata Special',
                'description' => 'Special discount for Kolkata rides',
                'discount_type' => 'percentage',
                'discount_value' => 15,
                'min_fare' => 60,
                'max_discount' => 80,
                'usage_limit' => null, // Unlimited
                'usage_limit_per_user' => 3,
                'used_count' => 0,
                'valid_from' => now()->toDateString(),
                'valid_until' => now()->addMonth()->toDateString(),
                'applicable_areas' => [1, 2, 4, 5, 7], // Kolkata areas only
                'user_type' => 'all',
                'active' => true,
                'created_by' => 'Marketing'
            ]
        ];

        foreach ($coupons as $couponData) {
            Coupon::firstOrCreate(['code' => $couponData['code']], $couponData);
        }

        $this->command->info('Sample coupons created successfully');

        // Create sample drivers and passengers for testing
        $sampleDrivers = [
            [
                'name' => 'Rajesh Kumar',
                'email' => 'rajesh.driver@loyalsafar.com',
                'phone' => '+91 9876543210',
                'role' => 'driver',
                'password' => Hash::make('password123'),
                'is_verified' => true,
                'rating' => 4.7
            ],
            [
                'name' => 'Amit Das',
                'email' => 'amit.driver@loyalsafar.com',
                'phone' => '+91 9876543211',
                'role' => 'driver',
                'password' => Hash::make('password123'),
                'is_verified' => true,
                'rating' => 4.8
            ],
            [
                'name' => 'Sunil Ghosh',
                'email' => 'sunil.driver@loyalsafar.com',
                'phone' => '+91 9876543212',
                'role' => 'driver',
                'password' => Hash::make('password123'),
                'is_verified' => true,
                'rating' => 4.6
            ]
        ];

        foreach ($sampleDrivers as $driverData) {
            User::firstOrCreate(['email' => $driverData['email']], $driverData);
        }

        $samplePassengers = [
            [
                'name' => 'Priya Sharma',
                'email' => 'priya.passenger@example.com',
                'phone' => '+91 8765432109',
                'role' => 'passenger',
                'password' => Hash::make('password123'),
                'is_verified' => true
            ],
            [
                'name' => 'Vikash Singh',
                'email' => 'vikash.passenger@example.com',
                'phone' => '+91 8765432108',
                'role' => 'passenger',
                'password' => Hash::make('password123'),
                'is_verified' => true
            ]
        ];

        foreach ($samplePassengers as $passengerData) {
            User::firstOrCreate(['email' => $passengerData['email']], $passengerData);
        }

        $this->command->info('Sample users created successfully');

        // Create sample completed rides for commission demonstration
        $drivers = User::where('role', 'driver')->get();
        $passengers = User::where('role', 'passenger')->get();
        $areas = Area::all();

        if ($drivers->count() > 0 && $passengers->count() > 0 && $areas->count() > 0) {
            $sampleRides = [
                [
                    'passenger_id' => $passengers->first()->id,
                    'driver_id' => $drivers->first()->id,
                    'area_id' => $areas->where('name', 'Park Street')->first()->id,
                    'pickup_address' => 'Park Street Metro Station',
                    'pickup_latitude' => 22.5548,
                    'pickup_longitude' => 88.3515,
                    'destination_address' => 'New Market',
                    'destination_latitude' => 22.5675,
                    'destination_longitude' => 88.3654,
                    'estimated_fare' => 120,
                    'total_fare' => 125,
                    'distance' => 3.2,
                    'estimated_duration' => 15,
                    'actual_duration' => 18,
                    'status' => 'completed',
                    'payment_status' => 'completed',
                    'requested_at' => now()->subHours(3),
                    'accepted_at' => now()->subHours(2.5),
                    'pickup_time' => now()->subHours(2.3),
                    'completed_at' => now()->subHours(2)
                ],
                [
                    'passenger_id' => $passengers->last()->id,
                    'driver_id' => $drivers->skip(1)->first()->id,
                    'area_id' => $areas->where('name', 'Salt Lake')->first()->id,
                    'pickup_address' => 'Salt Lake Stadium',
                    'pickup_latitude' => 22.5645,
                    'pickup_longitude' => 88.4329,
                    'destination_address' => 'City Centre 2',
                    'destination_latitude' => 22.5675,
                    'destination_longitude' => 88.4425,
                    'estimated_fare' => 80,
                    'total_fare' => 85,
                    'distance' => 2.1,
                    'estimated_duration' => 12,
                    'actual_duration' => 14,
                    'coupon_code' => 'KOLKATA15',
                    'status' => 'completed',
                    'payment_status' => 'completed',
                    'requested_at' => now()->subHours(5),
                    'accepted_at' => now()->subHours(4.5),
                    'pickup_time' => now()->subHours(4.3),
                    'completed_at' => now()->subHours(4)
                ]
            ];

            foreach ($sampleRides as $rideData) {
                $ride = Ride::create($rideData);
                
                // Process the ride through commission service (if needed for demo)
                $this->command->info("Created sample ride: {$ride->ride_id}");
            }
        }

        $this->command->info('Commission System seeding completed successfully!');
        $this->command->info('');
        $this->command->info('Sample Data Created:');
        $this->command->info('- Areas: ' . Area::count());
        $this->command->info('- Commission Slabs: ' . CommissionSlab::count());
        $this->command->info('- Coupons: ' . Coupon::count());
        $this->command->info('- Drivers: ' . User::where('role', 'driver')->count());
        $this->command->info('- Passengers: ' . User::where('role', 'passenger')->count());
        $this->command->info('');
        $this->command->info('Test Credentials:');
        $this->command->info('Driver: rajesh.driver@loyalsafar.com / password123');
        $this->command->info('Passenger: priya.passenger@example.com / password123');
    }
}
