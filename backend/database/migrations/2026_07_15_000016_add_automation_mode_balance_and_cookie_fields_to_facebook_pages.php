<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('facebook_pages', function (Blueprint $table) {
            if (!Schema::hasColumn('facebook_pages', 'automation_mode')) {
                $table->string('automation_mode', 16)->default('api')->after('engaged');
            }
            if (!Schema::hasColumn('facebook_pages', 'balance')) {
                $table->decimal('balance', 15, 2)->default(0)->after('automation_mode');
            }
            if (!Schema::hasColumn('facebook_pages', 'cookie_raw')) {
                $table->text('cookie_raw')->nullable()->after('cookie');
            }
            if (!Schema::hasColumn('facebook_pages', 'cookie_c_user')) {
                $table->string('cookie_c_user', 255)->nullable()->after('cookie_raw');
            }
            if (!Schema::hasColumn('facebook_pages', 'cookie_xs')) {
                $table->string('cookie_xs', 512)->nullable()->after('cookie_c_user');
            }
            if (!Schema::hasColumn('facebook_pages', 'cookie_datr')) {
                $table->string('cookie_datr', 255)->nullable()->after('cookie_xs');
            }
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