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
        Schema::create('company_wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ride_id')->nullable()->constrained('rides')->onDelete('set null');
            $table->foreignId('driver_id')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('amount', 10, 2);
            $table->enum('transaction_type', ['credit', 'debit']);
            $table->enum('reason', ['commission_earned', 'coupon_discount', 'promotion_cost', 'refund_issued', 'penalty_collected']);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_wallets');
    }
};
