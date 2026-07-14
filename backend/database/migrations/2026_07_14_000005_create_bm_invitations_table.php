<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bm_invitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_manager_id')->constrained()->cascadeOnDelete();
            $table->foreignId('invited_by')->constrained('users')->cascadeOnDelete();
            $table->string('email', 255);
            $table->string('role', 64)->default('Viewer');
            $table->string('token', 64)->unique();
            $table->string('status', 16)->default('pending'); // pending | accepted | expired
            $table->timestampTz('expires_at');
            $table->timestampTz('accepted_at')->nullable();
            $table->timestampsTz();

            $table->index(['business_manager_id', 'status']);
            $table->index(['email', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bm_invitations');
    }
};
