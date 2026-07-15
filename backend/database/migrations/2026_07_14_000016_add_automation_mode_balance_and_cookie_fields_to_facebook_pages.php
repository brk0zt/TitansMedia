<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('facebook_pages', function (Blueprint $table) {
            $table->string('automation_mode', 20)->default('api');
            $table->decimal('balance', 15, 2)->default(0);
            $table->text('cookie_raw')->nullable();
            $table->string('cookie_c_user', 255)->nullable();
            $table->text('cookie_xs')->nullable();
            $table->string('cookie_datr', 255)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('facebook_pages', function (Blueprint $table) {
            $table->dropColumn([
                'automation_mode',
                'balance',
                'cookie_raw',
                'cookie_c_user',
                'cookie_xs',
                'cookie_datr',
            ]);
        });
    }
};
