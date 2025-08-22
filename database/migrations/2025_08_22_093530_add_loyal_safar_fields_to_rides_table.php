<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('rides', function (Blueprint $table) {
            $table->foreignId('area_id')->nullable()->constrained('areas')->onDelete('set null');
            $table->decimal('commission_amount', 8, 2)->nullable();
            $table->enum('commission_type', ['fixed', 'percentage'])->nullable();
            $table->decimal('driver_payout', 8, 2)->nullable();
            $table->string('coupon_code')->nullable();
            $table->decimal('coupon_discount', 8, 2)->default(0);
            $table->decimal('final_fare', 8, 2)->nullable();
            $table->enum('payment_status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->boolean('is_green_ride')->default(false);
            $table->string('vehicle_type')->nullable();
            $table->text('special_instructions')->nullable();
            $table->json('emergency_contacts')->nullable();
            $table->boolean('panic_activated')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rides', function (Blueprint $table) {
            $table->dropColumn([
                'area_id', 'commission_amount', 'commission_type', 'driver_payout',
                'coupon_code', 'coupon_discount', 'final_fare', 'payment_status',
                'is_green_ride', 'vehicle_type', 'special_instructions',
                'emergency_contacts', 'panic_activated'
            ]);
        });
    }
};
