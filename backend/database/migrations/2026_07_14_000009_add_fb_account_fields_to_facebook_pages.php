<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('facebook_pages', function (Blueprint $table) {
            $table->string('token')->nullable()->after('engaged');
            $table->string('useragent', 512)->nullable()->after('token');
            $table->string('proxy', 512)->nullable()->after('useragent');
            $table->string('group_name', 255)->nullable()->after('proxy');
            $table->text('cookie')->nullable()->after('group_name');
            $table->decimal('notify_balance_threshold', 12, 2)->default(0)->after('cookie');
            $table->integer('notify_cooldown_minutes')->default(60)->after('notify_balance_threshold');
            $table->boolean('notify_moderation')->default(true)->after('notify_cooldown_minutes');
            $table->boolean('notify_cabinet_status')->default(true)->after('notify_moderation');
            $table->boolean('notify_billing')->default(true)->after('notify_cabinet_status');
        });
    }

    public function down(): void
    {
        Schema::table('facebook_pages', function (Blueprint $table) {
            $table->dropColumn([
                'token', 'useragent', 'proxy', 'group_name', 'cookie',
                'notify_balance_threshold', 'notify_cooldown_minutes',
                'notify_moderation', 'notify_cabinet_status', 'notify_billing',
            ]);
        });
    }
};
