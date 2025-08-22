<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LoyalSafarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            AreasSeeder::class,
            CommissionSlabsSeeder::class,
            LoyalSafarUsersSeeder::class,
        ]);
    }
}
