<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\CommissionSlab;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AreasAndCommissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Kolkata/Howrah areas
        $kolkataAreas = [
            ['name' => 'Salt Lake City', 'city' => 'Kolkata', 'state' => 'West Bengal'],
            ['name' => 'Park Street', 'city' => 'Kolkata', 'state' => 'West Bengal'],
            ['name' => 'Esplanade', 'city' => 'Kolkata', 'state' => 'West Bengal'],
            ['name' => 'Howrah Station', 'city' => 'Howrah', 'state' => 'West Bengal'],
            ['name' => 'Liluah', 'city' => 'Howrah', 'state' => 'West Bengal'],
            ['name' => 'Shibpur', 'city' => 'Howrah', 'state' => 'West Bengal'],
            ['name' => 'Ballygunge', 'city' => 'Kolkata', 'state' => 'West Bengal'],
            ['name' => 'Gariahat', 'city' => 'Kolkata', 'state' => 'West Bengal']
        ];

        foreach ($kolkataAreas as $areaData) {
            $area = Area::create($areaData);

            // Create commission slabs for each area
            $this->createCommissionSlabs($area->id);
        }
    }

    private function createCommissionSlabs($areaId)
    {
        $commissionSlabs = [
            // Low fare range (₹0-₹100) - Fixed ₹10 commission
            [
                'area_id' => $areaId,
                'min_fare' => 0,
                'max_fare' => 100,
                'commission_type' => 'fixed',
                'commission_value' => 10.00,
                'is_default' => false,
                'active' => true
            ],
            // Medium fare range (₹101-₹500) - 8% commission
            [
                'area_id' => $areaId,
                'min_fare' => 101,
                'max_fare' => 500,
                'commission_type' => 'percentage',
                'commission_value' => 8.00,
                'is_default' => false,
                'active' => true
            ],
            // High fare range (₹501-₹1000) - 12% commission
            [
                'area_id' => $areaId,
                'min_fare' => 501,
                'max_fare' => 1000,
                'commission_type' => 'percentage',
                'commission_value' => 12.00,
                'is_default' => false,
                'active' => true
            ],
            // Premium fare range (₹1001+) - 15% commission
            [
                'area_id' => $areaId,
                'min_fare' => 1001,
                'max_fare' => 10000,
                'commission_type' => 'percentage',
                'commission_value' => 15.00,
                'is_default' => false,
                'active' => true
            ],
            // Default slab for any fare not covered above - 10% commission
            [
                'area_id' => $areaId,
                'min_fare' => 0,
                'max_fare' => 999999,
                'commission_type' => 'percentage',
                'commission_value' => 10.00,
                'is_default' => true,
                'active' => true
            ]
        ];

        foreach ($commissionSlabs as $slabData) {
            CommissionSlab::create($slabData);
        }
    }
}
