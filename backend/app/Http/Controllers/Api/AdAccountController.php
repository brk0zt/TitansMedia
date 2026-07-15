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
            'status' => 'sometimes|in:active,disabled,paused',
            'spend' => 'sometimes|numeric|min:0',
            'impressions' => 'sometimes|integer|min:0',
            'clicks' => 'sometimes|integer|min:0',
            'token' => 'nullable|string',
            'useragent' => 'nullable|string|max:512',
            'proxy' => 'nullable|string|max:512',
            'cookie' => 'nullable|string',
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
            'manual_mode' => 'sometimes|boolean',
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
            'status' => 'sometimes|in:active,disabled',
            'spend' => 'sometimes|numeric|min:0',
            'impressions' => 'sometimes|integer|min:0',
            'clicks' => 'sometimes|integer|min:0',
            'metadata' => 'nullable|json',
            'token' => 'nullable|string',
            'useragent' => 'nullable|string|max:512',
            'proxy' => 'nullable|string|max:512',
            'cookie' => 'nullable|string',
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
            'manual_mode' => 'sometimes|boolean',
        ]);

        $adAccount->update($validated);

        return response()->json([
            'message' => 'Ad account updated successfully.',
            'data' => new AdAccountResource($adAccount),
        ]);
    }
}
