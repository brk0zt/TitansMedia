<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('facebook_pages', function (Blueprint $table) {
            if (!Schema::hasColumn('facebook_pages', 'linked_instagram')) {
                $table->string('linked_instagram', 255)->nullable();
            }
            if (!Schema::hasColumn('facebook_pages', 'banned')) {
                $table->boolean('banned')->default(false);
            }
            if (!Schema::hasColumn('facebook_pages', 'unpublished_reason')) {
                $table->text('unpublished_reason')->nullable();
            }
            if (!Schema::hasColumn('facebook_pages', 'admin_role')) {
                $table->boolean('admin_role')->default(false);
            }
            if (!Schema::hasColumn('facebook_pages', 'editor')) {
                $table->boolean('editor')->default(false);
            }
            if (!Schema::hasColumn('facebook_pages', 'advertiser')) {
                $table->boolean('advertiser')->default(false);
            }
            if (!Schema::hasColumn('facebook_pages', 'moderator')) {
                $table->boolean('moderator')->default(false);
            }
            if (!Schema::hasColumn('facebook_pages', 'permission_list')) {
                $table->json('permission_list')->nullable();
            }
            if (!Schema::hasColumn('facebook_pages', 'restriction_reason')) {
                $table->text('restriction_reason')->nullable();
            }
            if (!Schema::hasColumn('facebook_pages', 'policy_strike')) {
                $table->unsignedInteger('policy_strike')->default(0);
            }
            if (!Schema::hasColumn('facebook_pages', 'appeal_available')) {
                $table->boolean('appeal_available')->default(false);
            }
        });
    }

    public function down(): void
    {
        Schema::table('facebook_pages', function (Blueprint $table) {
            $cols = [
                'linked_instagram', 'banned', 'unpublished_reason',
                'admin_role', 'editor', 'advertiser', 'moderator', 'permission_list',
                'restriction_reason', 'policy_strike', 'appeal_available',
            ];
            foreach ($cols as $col) {
                if (Schema::hasColumn('facebook_pages', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
