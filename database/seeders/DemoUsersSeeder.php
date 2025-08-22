<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::firstOrCreate([
            'email' => 'admin@loyalsafar.com'
        ], [
            'name' => 'Admin User',
            'email' => 'admin@loyalsafar.com',
            'password' => Hash::make('password'),
            'phone' => '9876543210',
            'role' => 'admin',
            'is_verified' => true,
        ]);

        // Create Demo Driver
        User::firstOrCreate([
            'email' => 'driver@loyalsafar.com'
        ], [
            'name' => 'Rajesh Kumar',
            'email' => 'driver@loyalsafar.com',
            'password' => Hash::make('password'),
            'phone' => '9876543211',
            'role' => 'driver',
            'is_verified' => true,
            'rating' => 4.8,
        ]);

        // Create Demo Passenger/Rider
        User::firstOrCreate([
            'email' => 'rider@loyalsafar.com'
        ], [
            'name' => 'Anita Sen',
            'email' => 'rider@loyalsafar.com',
            'password' => Hash::make('password'),
            'phone' => '9876543212',
            'role' => 'passenger',
            'is_verified' => true,
        ]);

        // Create Additional Demo Users
        User::firstOrCreate([
            'email' => 'driver2@loyalsafar.com'
        ], [
            'name' => 'Suresh Sharma',
            'email' => 'driver2@loyalsafar.com',
            'password' => Hash::make('password'),
            'phone' => '9876543213',
            'role' => 'driver',
            'is_verified' => true,
            'rating' => 4.5,
        ]);

        User::firstOrCreate([
            'email' => 'rider2@loyalsafar.com'
        ], [
            'name' => 'Priya Ghosh',
            'email' => 'rider2@loyalsafar.com',
            'password' => Hash::make('password'),
            'phone' => '9876543214',
            'role' => 'passenger',
            'is_verified' => true,
        ]);

        $this->command->info('Demo users created successfully!');
    }
}