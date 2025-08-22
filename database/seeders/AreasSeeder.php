<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Area;

class AreasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $areas = [
            [
                'name' => 'Central Kolkata',
                'description' => 'Heart of the city - Park Street, New Market, BBD Bagh',
                'base_fare' => 80.00,
                'per_km_rate' => 15.00,
                'waiting_charge' => 2.00,
                'night_charges' => 25.00,
                'boundary_coordinates' => json_encode([
                    'lat' => 22.5726,
                    'lng' => 88.3639,
                    'radius' => 5
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'Salt Lake (Sector V)',
                'description' => 'IT Hub - Sector V, City Centre Mall, Nicco Park',
                'base_fare' => 70.00,
                'per_km_rate' => 14.00,
                'waiting_charge' => 2.00,
                'night_charges' => 20.00,
                'boundary_coordinates' => json_encode([
                    'lat' => 22.5741,
                    'lng' => 88.4334,
                    'radius' => 6
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'Howrah',
                'description' => 'Railway junction, Howrah Bridge, Botanical Gardens',
                'base_fare' => 60.00,
                'per_km_rate' => 12.00,
                'waiting_charge' => 1.50,
                'night_charges' => 18.00,
                'boundary_coordinates' => json_encode([
                    'lat' => 22.5958,
                    'lng' => 88.2636,
                    'radius' => 7
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'South Kolkata',
                'description' => 'Rashbehari, Gariahat, Lake Gardens, Jadavpur',
                'base_fare' => 75.00,
                'per_km_rate' => 16.00,
                'waiting_charge' => 2.50,
                'night_charges' => 22.00,
                'boundary_coordinates' => json_encode([
                    'lat' => 22.5205,
                    'lng' => 88.3624,
                    'radius' => 8
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'North Kolkata',
                'description' => 'Shyambazar, Hatibagan, Maniktala, Dumdum',
                'base_fare' => 65.00,
                'per_km_rate' => 13.00,
                'waiting_charge' => 2.00,
                'night_charges' => 20.00,
                'boundary_coordinates' => json_encode([
                    'lat' => 22.6157,
                    'lng' => 88.3877,
                    'radius' => 6
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'East Kolkata',
                'description' => 'New Town, Rajarhat, VIP Road, Airport area',
                'base_fare' => 85.00,
                'per_km_rate' => 17.00,
                'waiting_charge' => 3.00,
                'night_charges' => 30.00,
                'boundary_coordinates' => json_encode([
                    'lat' => 22.6203,
                    'lng' => 88.4696,
                    'radius' => 10
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'Airport & Dum Dum',
                'description' => 'Netaji Subhas Airport, Dum Dum Junction, Jessore Road',
                'base_fare' => 90.00,
                'per_km_rate' => 18.00,
                'waiting_charge' => 3.00,
                'night_charges' => 35.00,
                'boundary_coordinates' => json_encode([
                    'lat' => 22.6547,
                    'lng' => 88.4467,
                    'radius' => 5
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'EM Bypass',
                'description' => 'Eastern Metropolitan Bypass - Garia to VIP Road',
                'base_fare' => 70.00,
                'per_km_rate' => 15.00,
                'waiting_charge' => 2.50,
                'night_charges' => 25.00,
                'boundary_coordinates' => json_encode([
                    'lat' => 22.5448,
                    'lng' => 88.4082,
                    'radius' => 12
                ]),
                'is_active' => true,
            ]
        ];

        foreach ($areas as $area) {
            Area::create($area);
        }
    }
}
