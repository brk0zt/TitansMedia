<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ad_accounts', function (Blueprint $table) {
            $table->text('token')->nullable();
            $table->string('useragent', 512)->nullable();
            $table->string('proxy', 512)->nullable();
            $table->text('cookie')->nullable();
            $table->decimal('notify_balance_threshold', 12, 2)->default(0);
            $table->integer('notify_cooldown_minutes')->default(60);
            $table->boolean('notify_moderation')->default(true);
            $table->boolean('notify_cabinet_status')->default(true);
            $table->boolean('notify_billing')->default(true);
            $table->boolean('fetch_boosted_posts')->default(true);
            $table->boolean('fetch_dark_posts')->default(true);
            $table->boolean('fetch_lead_forms')->default(true);
            $table->boolean('monitor_impressions')->default(true);
            $table->boolean('monitor_clicks')->default(true);
            $table->boolean('monitor_budget')->default(true);
            $table->boolean('monitor_reach')->default(true);
            $table->boolean('monitor_engagement')->default(true);
        });
    }

    public function down(): void
    {
        Schema::table('ad_accounts', function (Blueprint $table) {
            $table->dropColumn([
                'token', 'useragent', 'proxy', 'cookie',
                'notify_balance_threshold', 'notify_cooldown_minutes',
                'notify_moderation', 'notify_cabinet_status', 'notify_billing',
                'fetch_boosted_posts', 'fetch_dark_posts', 'fetch_lead_forms',
                'monitor_impressions', 'monitor_clicks', 'monitor_budget',
                'monitor_reach', 'monitor_engagement',
            ]);
        });
    }
};
