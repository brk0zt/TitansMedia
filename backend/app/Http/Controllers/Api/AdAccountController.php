<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\AdAccountResource;
use App\Models\AdAccount;
use App\Models\BusinessManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdAccountController
{
    public function index(Request $request, BusinessManager $businessManager): AnonymousResourceCollection
    {
        abort_if($businessManager->user_id !== $request->user()->id, 403);

        $accounts = $businessManager->adAccounts()
            ->orderBy('updated_at', 'desc')
            ->paginate(20);

        return AdAccountResource::collection($accounts);
    }

    public function store(Request $request, BusinessManager $businessManager): AdAccountResource
    {
        abort_if($businessManager->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'account_id' => 'nullable|string|max:64',
            'fb_ad_account_id' => 'nullable|string|max:255',
            'fb_account_id' => 'nullable|string|max:64',
            'pixel_id' => 'nullable|string|max:64',
            'owner_account' => 'nullable|string|max:255',
            'shared_accounts' => 'nullable|array',
            'status' => 'sometimes|in:active,disabled,paused,restricted,unsettled,pending_review,appeal_submitted',
            'spend' => 'sometimes|numeric|min:0',
            'impressions' => 'sometimes|integer|min:0',
            'clicks' => 'sometimes|integer|min:0',
            'automation_mode' => 'sometimes|in:api,cookie,manual',
            'token' => 'nullable|string',
            'useragent' => 'nullable|string|max:512',
            'proxy' => 'nullable|string|max:512',
            'cookie' => 'nullable|string',
            'cookie_raw' => 'nullable|string',
            'cookie_c_user' => 'nullable|string|max:255',
            'cookie_xs' => 'nullable|string',
            'cookie_datr' => 'nullable|string|max:255',
            'notify_balance_threshold' => 'sometimes|numeric|min:0',
            'notify_cooldown_minutes' => 'sometimes|integer|min:1',
            'notify_moderation' => 'sometimes|boolean',
            'notify_cabinet_status' => 'sometimes|boolean',
            'notify_billing' => 'sometimes|boolean',
            'fetch_boosted_posts' => 'sometimes|boolean',
            'fetch_dark_posts' => 'sometimes|boolean',
            'fetch_lead_forms' => 'sometimes|boolean',
            'monitor_impressions' => 'sometimes|boolean',
            'monitor_clicks' => 'sometimes|boolean',
            'monitor_budget' => 'sometimes|boolean',
            'monitor_reach' => 'sometimes|boolean',
            'monitor_engagement' => 'sometimes|boolean',
            'balance' => 'sometimes|numeric|min:0',
            'outstanding_balance' => 'sometimes|numeric|min:0',
            'available_credit' => 'sometimes|numeric|min:0',
            'billing_threshold' => 'nullable|numeric|min:0',
            'daily_spending_limit' => 'nullable|numeric|min:0',
            'account_spending_limit' => 'nullable|numeric|min:0',
            'manual_mode' => 'sometimes|boolean',
            'payment_method' => 'nullable|string|max:64',
            'payment_method_count' => 'sometimes|integer|min:0',
            'card_status' => 'nullable|string|max:32',
            'card_expiration' => 'nullable|string|max:10',
            'auto_pay' => 'sometimes|boolean',
            'manual_pay' => 'sometimes|boolean',
            'billing_notifications' => 'sometimes|boolean',
            'country' => 'nullable|string|max:4',
            'vat_id' => 'nullable|string|max:64',
            'today_spend' => 'sometimes|numeric|min:0',
            'yesterday_spend' => 'sometimes|numeric|min:0',
            'daily_budget' => 'nullable|numeric|min:0',
            'lifetime_budget' => 'nullable|numeric|min:0',
            'remaining_spend' => 'sometimes|numeric|min:0',
            'review_feedback' => 'nullable|string',
            'policy_violations' => 'sometimes|integer|min:0',
            'notification_count' => 'sometimes|integer|min:0',
            'account_health' => 'nullable|string|max:32',
            'delivery_issues' => 'nullable|string',
            'applied_auto_rules' => 'nullable|array',
            'auto_comment' => 'sometimes|boolean',
            'restricted' => 'sometimes|boolean',
            'unsettled' => 'sometimes|boolean',
            'pending_review' => 'sometimes|boolean',
            'appeal_submitted' => 'sometimes|boolean',
            'review_result' => 'nullable|string|max:64',
        ]);

        $account = $businessManager->adAccounts()->create($validated);

        return new AdAccountResource($account);
    }

    public function update(Request $request, BusinessManager $businessManager, AdAccount $adAccount): JsonResponse
    {
        abort_if($businessManager->user_id !== $request->user()->id, 403);
        abort_if($adAccount->business_manager_id !== $businessManager->id, 403);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'fb_ad_account_id' => 'nullable|string|max:255',
            'fb_account_id' => 'nullable|string|max:64',
            'pixel_id' => 'nullable|string|max:64',
            'owner_account' => 'nullable|string|max:255',
            'shared_accounts' => 'nullable|array',
            'status' => 'sometimes|in:active,disabled,paused,restricted,unsettled,pending_review,appeal_submitted',
            'spend' => 'sometimes|numeric|min:0',
            'impressions' => 'sometimes|integer|min:0',
            'clicks' => 'sometimes|integer|min:0',
            'metadata' => 'nullable|json',
            'automation_mode' => 'sometimes|in:api,cookie,manual',
            'token' => 'nullable|string',
            'useragent' => 'nullable|string|max:512',
            'proxy' => 'nullable|string|max:512',
            'cookie' => 'nullable|string',
            'cookie_raw' => 'nullable|string',
            'cookie_c_user' => 'nullable|string|max:255',
            'cookie_xs' => 'nullable|string',
            'cookie_datr' => 'nullable|string|max:255',
            'notify_balance_threshold' => 'sometimes|numeric|min:0',
            'notify_cooldown_minutes' => 'sometimes|integer|min:1',
            'notify_moderation' => 'sometimes|boolean',
            'notify_cabinet_status' => 'sometimes|boolean',
            'notify_billing' => 'sometimes|boolean',
            'fetch_boosted_posts' => 'sometimes|boolean',
            'fetch_dark_posts' => 'sometimes|boolean',
            'fetch_lead_forms' => 'sometimes|boolean',
            'monitor_impressions' => 'sometimes|boolean',
            'monitor_clicks' => 'sometimes|boolean',
            'monitor_budget' => 'sometimes|boolean',
            'monitor_reach' => 'sometimes|boolean',
            'monitor_engagement' => 'sometimes|boolean',
            'balance' => 'sometimes|numeric|min:0',
            'outstanding_balance' => 'sometimes|numeric|min:0',
            'available_credit' => 'sometimes|numeric|min:0',
            'billing_threshold' => 'nullable|numeric|min:0',
            'daily_spending_limit' => 'nullable|numeric|min:0',
            'account_spending_limit' => 'nullable|numeric|min:0',
            'manual_mode' => 'sometimes|boolean',
            'payment_method' => 'nullable|string|max:64',
            'payment_method_count' => 'sometimes|integer|min:0',
            'card_status' => 'nullable|string|max:32',
            'card_expiration' => 'nullable|string|max:10',
            'auto_pay' => 'sometimes|boolean',
            'manual_pay' => 'sometimes|boolean',
            'billing_notifications' => 'sometimes|boolean',
            'country' => 'nullable|string|max:4',
            'vat_id' => 'nullable|string|max:64',
            'today_spend' => 'sometimes|numeric|min:0',
            'yesterday_spend' => 'sometimes|numeric|min:0',
            'daily_budget' => 'nullable|numeric|min:0',
            'lifetime_budget' => 'nullable|numeric|min:0',
            'remaining_spend' => 'sometimes|numeric|min:0',
            'review_feedback' => 'nullable|string',
            'policy_violations' => 'sometimes|integer|min:0',
            'notification_count' => 'sometimes|integer|min:0',
            'account_health' => 'nullable|string|max:32',
            'delivery_issues' => 'nullable|string',
            'applied_auto_rules' => 'nullable|array',
            'auto_comment' => 'sometimes|boolean',
            'restricted' => 'sometimes|boolean',
            'unsettled' => 'sometimes|boolean',
            'pending_review' => 'sometimes|boolean',
            'appeal_submitted' => 'sometimes|boolean',
            'review_result' => 'nullable|string|max:64',
        ]);

        $adAccount->update($validated);

        return response()->json([
            'message' => 'Ad account updated successfully.',
            'data' => new AdAccountResource($adAccount),
        ]);
    }
}
