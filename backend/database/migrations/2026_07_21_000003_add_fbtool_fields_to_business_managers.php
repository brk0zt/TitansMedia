<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('business_managers', function (Blueprint $table) {
            if (!Schema::hasColumn('business_managers', 'restriction_state')) {
                $table->string('restriction_state', 32)->nullable();
            }
            if (!Schema::hasColumn('business_managers', 'appeals_remaining')) {
                $table->unsignedSmallInteger('appeals_remaining')->default(0);
            }
            if (!Schema::hasColumn('business_managers', 'admin_role')) {
                $table->string('admin_role', 64)->nullable();
            }
            if (!Schema::hasColumn('business_managers', 'verification_status')) {
                $table->string('verification_status', 32)->default('none');
            }
            if (!Schema::hasColumn('business_managers', 'business_verification')) {
                $table->string('business_verification', 32)->default('none');
            }
            if (!Schema::hasColumn('business_managers', 'pixel_count')) {
                $table->unsignedInteger('pixel_count')->default(0);
            }
            if (!Schema::hasColumn('business_managers', 'partner_count')) {
                $table->unsignedInteger('partner_count')->default(0);
            }
            if (!Schema::hasColumn('business_managers', 'page_count_stored')) {
                $table->unsignedInteger('page_count_stored')->default(0);
            }
            if (!Schema::hasColumn('business_managers', 'ad_account_count_stored')) {
                $table->unsignedInteger('ad_account_count_stored')->default(0);
            }
        });
    }

    public function down(): void
    {
        Schema::table('business_managers', function (Blueprint $table) {
            $cols = [
                'restriction_state', 'appeals_remaining', 'admin_role',
                'verification_status', 'business_verification',
                'pixel_count', 'partner_count',
                'page_count_stored', 'ad_account_count_stored',
            ];
            foreach ($cols as $col) {
                if (Schema::hasColumn('business_managers', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
