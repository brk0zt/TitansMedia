<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ad_accounts', function (Blueprint $table) {
            if (!Schema::hasColumn('ad_accounts', 'fb_account_id')) {
                $table->string('fb_account_id', 64)->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'pixel_id')) {
                $table->string('pixel_id', 64)->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'owner_account')) {
                $table->string('owner_account', 255)->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'shared_accounts')) {
                $table->json('shared_accounts')->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'outstanding_balance')) {
                $table->decimal('outstanding_balance', 14, 2)->default(0);
            }
            if (!Schema::hasColumn('ad_accounts', 'available_credit')) {
                $table->decimal('available_credit', 14, 2)->default(0);
            }
            if (!Schema::hasColumn('ad_accounts', 'billing_threshold')) {
                $table->decimal('billing_threshold', 14, 2)->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'daily_spending_limit')) {
                $table->decimal('daily_spending_limit', 14, 2)->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'account_spending_limit')) {
                $table->decimal('account_spending_limit', 14, 2)->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'payment_method')) {
                $table->string('payment_method', 64)->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'payment_method_count')) {
                $table->unsignedSmallInteger('payment_method_count')->default(0);
            }
            if (!Schema::hasColumn('ad_accounts', 'card_status')) {
                $table->string('card_status', 32)->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'card_expiration')) {
                $table->string('card_expiration', 10)->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'auto_pay')) {
                $table->boolean('auto_pay')->default(false);
            }
            if (!Schema::hasColumn('ad_accounts', 'manual_pay')) {
                $table->boolean('manual_pay')->default(false);
            }
            if (!Schema::hasColumn('ad_accounts', 'billing_notifications')) {
                $table->boolean('billing_notifications')->default(true);
            }
            if (!Schema::hasColumn('ad_accounts', 'country')) {
                $table->string('country', 4)->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'vat_id')) {
                $table->string('vat_id', 64)->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'today_spend')) {
                $table->decimal('today_spend', 14, 2)->default(0);
            }
            if (!Schema::hasColumn('ad_accounts', 'yesterday_spend')) {
                $table->decimal('yesterday_spend', 14, 2)->default(0);
            }
            if (!Schema::hasColumn('ad_accounts', 'daily_budget')) {
                $table->decimal('daily_budget', 14, 2)->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'lifetime_budget')) {
                $table->decimal('lifetime_budget', 14, 2)->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'remaining_spend')) {
                $table->decimal('remaining_spend', 14, 2)->default(0);
            }
            if (!Schema::hasColumn('ad_accounts', 'review_feedback')) {
                $table->text('review_feedback')->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'policy_violations')) {
                $table->unsignedInteger('policy_violations')->default(0);
            }
            if (!Schema::hasColumn('ad_accounts', 'notification_count')) {
                $table->unsignedInteger('notification_count')->default(0);
            }
            if (!Schema::hasColumn('ad_accounts', 'account_health')) {
                $table->string('account_health', 32)->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'delivery_issues')) {
                $table->text('delivery_issues')->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'applied_auto_rules')) {
                $table->json('applied_auto_rules')->nullable();
            }
            if (!Schema::hasColumn('ad_accounts', 'auto_comment')) {
                $table->boolean('auto_comment')->default(false);
            }
            if (!Schema::hasColumn('ad_accounts', 'restricted')) {
                $table->boolean('restricted')->default(false);
            }
            if (!Schema::hasColumn('ad_accounts', 'unsettled')) {
                $table->boolean('unsettled')->default(false);
            }
            if (!Schema::hasColumn('ad_accounts', 'pending_review')) {
                $table->boolean('pending_review')->default(false);
            }
            if (!Schema::hasColumn('ad_accounts', 'appeal_submitted')) {
                $table->boolean('appeal_submitted')->default(false);
            }
            if (!Schema::hasColumn('ad_accounts', 'review_result')) {
                $table->string('review_result', 64)->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('ad_accounts', function (Blueprint $table) {
            $cols = [
                'fb_account_id', 'pixel_id', 'owner_account', 'shared_accounts',
                'outstanding_balance', 'available_credit', 'billing_threshold',
                'daily_spending_limit', 'account_spending_limit', 'payment_method',
                'payment_method_count', 'card_status', 'card_expiration', 'auto_pay',
                'manual_pay', 'billing_notifications', 'country', 'vat_id',
                'today_spend', 'yesterday_spend', 'daily_budget', 'lifetime_budget',
                'remaining_spend', 'review_feedback', 'policy_violations',
                'notification_count', 'account_health', 'delivery_issues',
                'applied_auto_rules', 'auto_comment', 'restricted', 'unsettled',
                'pending_review', 'appeal_submitted', 'review_result',
            ];
            foreach ($cols as $col) {
                if (Schema::hasColumn('ad_accounts', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
