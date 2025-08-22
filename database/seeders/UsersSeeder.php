<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Coupon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample drivers
        $drivers = [
            [
                'name' => 'Rajesh Kumar',
                'email' => 'rajesh.driver@loyalsafar.com',
                'phone' => '+91-9876543210',
                'role' => 'driver',
                'password' => Hash::make('password123'),
                'license_number' => 'WB-123456789',
                'vehicle_type' => 'sedan'
            ],
            [
                'name' => 'Amit Sharma',
                'email' => 'amit.driver@loyalsafar.com',
                'phone' => '+91-9876543211',
                'role' => 'driver',
                'password' => Hash::make('password123'),
                'license_number' => 'WB-987654321',
                'vehicle_type' => 'suv'
            ],
            [
                'name' => 'Suresh Chatterjee',
                'email' => 'suresh.driver@loyalsafar.com',
                'phone' => '+91-9876543212',
                'role' => 'driver',
                'password' => Hash::make('password123'),
                'license_number' => 'WB-456789123',
                'vehicle_type' => 'hatchback'
            ]
        ];

        // Create sample passengers
        $passengers = [
            [
                'name' => 'Priya Banerjee',
                'email' => 'priya@example.com',
                'phone' => '+91-8765432109',
                'role' => 'passenger',
                'password' => Hash::make('password123')
            ],
            [
                'name' => 'Arjun Nair',
                'email' => 'arjun@example.com',
                'phone' => '+91-8765432108',
                'role' => 'passenger',
                'password' => Hash::make('password123')
            ],
            [
                'name' => 'Sneha Roy',
                'email' => 'sneha@example.com',
                'phone' => '+91-8765432107',
                'role' => 'passenger',
                'password' => Hash::make('password123')
            ]
        ];

        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@loyalsafar.com',
            'phone' => '+91-9999999999',
            'role' => 'admin',
            'password' => Hash::make('admin123')
        ]);

        // Insert drivers and passengers
        foreach ($drivers as $driver) {
            User::create($driver);
        }

        foreach ($passengers as $passenger) {
            User::create($passenger);
        }

        // Create sample coupons
        $coupons = [
            [
                'code' => 'WELCOME50',
                'type' => 'percentage',
                'value' => 50.00,
                'max_discount' => 100.00,
                'min_order_amount' => 150.00,
                'valid_from' => now(),
                'valid_until' => now()->addDays(30),
                'usage_limit' => 100,
                'used_count' => 0,
                'active' => true,
                'description' => 'Welcome discount - 50% off on first ride'
            ],
            [
                'code' => 'SAVE25',
                'type' => 'fixed',
                'value' => 25.00,
                'max_discount' => 25.00,
                'min_order_amount' => 100.00,
                'valid_from' => now(),
                'valid_until' => now()->addDays(60),
                'usage_limit' => 200,
                'used_count' => 0,
                'active' => true,
                'description' => 'Flat ₹25 discount on rides above ₹100'
            ],
            [
                'code' => 'LOYALTY20',
                'type' => 'percentage',
                'value' => 20.00,
                'max_discount' => 80.00,
                'min_order_amount' => 200.00,
                'valid_from' => now(),
                'valid_until' => now()->addDays(90),
                'usage_limit' => 500,
                'used_count' => 0,
                'active' => true,
                'description' => 'Loyalty discount - 20% off for regular customers'
            ]
        ];

        foreach ($coupons as $coupon) {
            Coupon::create($coupon);
        }
    }
}
