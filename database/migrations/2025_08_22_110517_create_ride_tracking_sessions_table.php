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
        Schema::create('ride_tracking_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->unique();
            $table->foreignId('ride_id')->constrained('rides')->onDelete('cascade');
            $table->string('jwt_token', 500);
            $table->timestamp('token_expires_at');
            $table->enum('status', ['active', 'expired', 'ended'])->default('active');
            $table->json('viewer_logs')->nullable(); // Track who accessed the link
            $table->integer('view_count')->default(0);
            $table->timestamp('last_accessed_at')->nullable();
            $table->json('share_methods')->nullable(); // Track how the link was shared
            $table->string('last_known_location')->nullable(); // Latest driver coordinates
            $table->timestamp('location_updated_at')->nullable();
            $table->json('metadata')->nullable(); // Additional session data
            $table->timestamps();
            
            // Indexes
            $table->index(['session_id', 'status']);
            $table->index(['ride_id', 'status']);
            $table->index('token_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ride_tracking_sessions');
    }
};
