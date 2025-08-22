<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CommissionSlab;
use App\Models\Area;

class CommissionSlabsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $areas = Area::all();
        
        foreach ($areas as $area) {
            // Low fare range - higher commission percentage
            CommissionSlab::create([
                'area_id' => $area->id,
                'min_fare' => 0,
                'max_fare' => 150,
                'commission_type' => 'percentage',
                'commission_value' => 20, // 20% for low fares
                'is_default' => false,
                'active' => true,
            ]);
            
            // Medium fare range
            CommissionSlab::create([
                'area_id' => $area->id,
                'min_fare' => 150,
                'max_fare' => 400,
                'commission_type' => 'percentage',
                'commission_value' => 15, // 15% for medium fares
                'is_default' => true, // Default slab
                'active' => true,
            ]);
            
            // High fare range - lower commission
            CommissionSlab::create([
                'area_id' => $area->id,
                'min_fare' => 400,
                'max_fare' => 800,
                'commission_type' => 'percentage',
                'commission_value' => 12, // 12% for high fares
                'is_default' => false,
                'active' => true,
            ]);
            
            // Premium fare range - fixed commission
            CommissionSlab::create([
                'area_id' => $area->id,
                'min_fare' => 800,
                'max_fare' => null, // No upper limit
                'commission_type' => 'fixed',
                'commission_value' => 80, // Fixed ₹80 for premium rides
                'is_default' => false,
                'active' => true,
            ]);
        }
    }
}
