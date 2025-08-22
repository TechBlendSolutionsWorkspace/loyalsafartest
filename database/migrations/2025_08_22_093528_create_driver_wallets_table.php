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
        Schema::create('driver_wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('ride_id')->nullable()->constrained('rides')->onDelete('set null');
            $table->decimal('amount', 10, 2);
            $table->enum('transaction_type', ['credit', 'debit']);
            $table->enum('reason', ['ride_completed', 'commission_deducted', 'payout_requested', 'bonus_added', 'penalty_deducted']);
            $table->enum('source', ['ride_fare', 'commission', 'bonus', 'penalty', 'payout']);
            $table->enum('status', ['pending', 'completed', 'failed'])->default('completed');
            $table->string('payout_reference')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driver_wallets');
    }
};
