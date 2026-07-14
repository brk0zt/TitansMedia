<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ad_accounts', function (Blueprint $table) {
            $table->string('fb_ad_account_id', 64)->nullable()->after('account_id');
        });
    }

    public function down(): void
    {
        Schema::table('ad_accounts', function (Blueprint $table) {
            $table->dropColumn('fb_ad_account_id');
        });
    }
};
