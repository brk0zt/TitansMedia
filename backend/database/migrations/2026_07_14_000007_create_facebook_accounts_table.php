<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facebook_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_manager_id')->constrained()->cascadeOnDelete();
            $table->string('name', 255);
            $table->text('token');
            $table->string('useragent', 512);
            $table->string('proxy', 512)->nullable();
            $table->string('group_name', 255)->nullable();
            $table->text('cookie')->nullable();
            $table->decimal('notify_balance_threshold', 14, 2)->default(0);
            $table->unsignedInteger('notify_cooldown_minutes')->default(60);
            $table->boolean('notify_moderation')->default(true);
            $table->boolean('notify_cabinet_status')->default(true);
            $table->boolean('notify_billing')->default(true);
            $table->string('status', 16)->default('active');
            $table->timestampsTz();

            $table->index(['business_manager_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facebook_accounts');
    }
};
