<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('facebook_pages', function (Blueprint $table) {
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
        Schema::table('facebook_pages', function (Blueprint $table) {
            $table->dropColumn([
                'fetch_boosted_posts',
                'fetch_dark_posts',
                'fetch_lead_forms',
                'monitor_impressions',
                'monitor_clicks',
                'monitor_budget',
                'monitor_reach',
                'monitor_engagement',
            ]);
        });
    }
};
