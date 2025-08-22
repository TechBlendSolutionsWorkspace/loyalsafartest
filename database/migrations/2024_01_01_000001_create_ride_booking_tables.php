<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Users table (already exists from Laravel default)
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->enum('role', ['passenger', 'driver', 'admin'])->default('passenger')->after('password');
            $table->string('avatar')->nullable()->after('role');
            $table->decimal('rating', 3, 2)->default(5.00)->after('avatar');
            $table->boolean('is_verified')->default(false)->after('rating');
            $table->timestamp('last_active_at')->nullable()->after('is_verified');
        });

        // Drivers table
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('license_number')->unique();
            $table->string('license_image');
            $table->enum('status', ['offline', 'online', 'busy'])->default('offline');
            $table->decimal('current_latitude', 10, 8)->nullable();
            $table->decimal('current_longitude', 11, 8)->nullable();
            $table->decimal('total_earnings', 10, 2)->default(0);
            $table->integer('total_rides')->default(0);
            $table->boolean('is_approved')->default(false);
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });

        // Vehicles table
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_id')->constrained()->onDelete('cascade');
            $table->string('make');
            $table->string('model');
            $table->year('year');
            $table->string('color');
            $table->string('license_plate')->unique();
            $table->enum('type', ['sedan', 'suv', 'hatchback', 'luxury']);
            $table->string('vehicle_image');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Rides table
        Schema::create('rides', function (Blueprint $table) {
            $table->id();
            $table->string('ride_id')->unique();
            $table->foreignId('passenger_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('driver_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('pickup_address');
            $table->decimal('pickup_latitude', 10, 8);
            $table->decimal('pickup_longitude', 11, 8);
            $table->string('destination_address');
            $table->decimal('destination_latitude', 10, 8);
            $table->decimal('destination_longitude', 11, 8);
            $table->decimal('estimated_fare', 8, 2);
            $table->decimal('actual_fare', 8, 2)->nullable();
            $table->decimal('distance', 8, 2)->nullable(); // in kilometers
            $table->integer('estimated_duration')->nullable(); // in minutes
            $table->integer('actual_duration')->nullable(); // in minutes
            $table->enum('status', [
                'pending', 'accepted', 'driver_arriving', 
                'driver_arrived', 'in_progress', 'completed', 
                'cancelled_by_passenger', 'cancelled_by_driver'
            ])->default('pending');
            $table->timestamp('requested_at');
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('pickup_time')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();
        });

        // Payments table
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ride_id')->constrained()->onDelete('cascade');
            $table->string('payment_id')->unique();
            $table->decimal('amount', 8, 2);
            $table->enum('method', ['cash', 'card', 'wallet', 'upi']);
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->string('transaction_id')->nullable();
            $table->json('payment_details')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });

        // Ratings table
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ride_id')->constrained()->onDelete('cascade');
            $table->foreignId('rater_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('rated_id')->constrained('users')->onDelete('cascade');
            $table->integer('rating'); // 1-5 stars
            $table->text('comment')->nullable();
            $table->timestamps();
        });

        // Ride requests table (for tracking driver responses)
        Schema::create('ride_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ride_id')->constrained()->onDelete('cascade');
            $table->foreignId('driver_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['sent', 'accepted', 'declined', 'expired'])->default('sent');
            $table->timestamp('sent_at');
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
        });

        // Driver earnings table
        Schema::create('driver_earnings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('ride_id')->constrained()->onDelete('cascade');
            $table->decimal('fare_amount', 8, 2);
            $table->decimal('commission', 8, 2);
            $table->decimal('driver_earnings', 8, 2);
            $table->date('earning_date');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('driver_earnings');
        Schema::dropIfExists('ride_requests');
        Schema::dropIfExists('ratings');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('rides');
        Schema::dropIfExists('vehicles');
        Schema::dropIfExists('drivers');
        
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone', 'role', 'avatar', 'rating', 
                'is_verified', 'last_active_at'
            ]);
        });
    }
};