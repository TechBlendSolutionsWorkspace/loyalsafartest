<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@ridebook.com',
            'phone' => '+1234567890',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_verified' => true,
        ]);

        // Create Sample Driver
        User::create([
            'name' => 'John Driver',
            'email' => 'driver@ridebook.com',
            'phone' => '+1234567891',
            'password' => Hash::make('password'),
            'role' => 'driver',
            'is_verified' => true,
        ]);

        // Create Sample Passenger
        User::create([
            'name' => 'Jane Passenger',
            'email' => 'passenger@ridebook.com',
            'phone' => '+1234567892',
            'password' => Hash::make('password'),
            'role' => 'passenger',
            'is_verified' => true,
        ]);
    }
}
