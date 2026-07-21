<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auto_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 255);
            $table->string('target_type', 32); // 'ad_account', 'facebook_page', 'ad_set', 'ad'
            $table->unsignedBigInteger('target_id')->nullable();
            $table->json('conditions');
            $table->string('operator', 8); // 'and', 'or'
            $table->string('action_type', 32); // 'stop', 'start', 'change_daily_budget', 'change_lifetime_budget', 'change_bid'
            $table->decimal('action_value', 14, 2)->nullable();
            $table->string('action_field', 64)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestampTz('last_triggered_at')->nullable();
            $table->unsignedInteger('trigger_count')->default(0);
            $table->json('metadata')->nullable();
            $table->timestampsTz();

            $table->index(['target_type', 'target_id']);
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auto_rules');
    }
};
