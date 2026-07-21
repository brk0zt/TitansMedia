<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facebook_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 255)->nullable();
            $table->string('profile_id', 64)->nullable()->unique();
            $table->string('restriction_status', 32)->nullable();
            $table->unsignedInteger('advertising_strikes')->default(0);
            $table->string('identity_verification', 32)->default('none');
            $table->boolean('two_factor_enabled')->default(false);
            $table->string('session_status', 32)->nullable();
            $table->string('email', 255)->nullable();
            $table->text('token')->nullable();
            $table->string('useragent', 512)->nullable();
            $table->string('proxy', 512)->nullable();
            $table->text('cookie')->nullable();
            $table->text('cookie_raw')->nullable();
            $table->string('cookie_c_user', 255)->nullable();
            $table->text('cookie_xs')->nullable();
            $table->string('cookie_datr', 255)->nullable();
            $table->string('automation_mode', 20)->default('api');
            $table->json('metadata')->nullable();
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facebook_profiles');
    }
};
