<?php

namespace App\Http\Controllers\Api;

use App\Models\AdAccount;
use App\Models\FacebookAccount;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class FacebookBillingController
{
    private const GRAPH_API_VERSION = 'v22.0';
    private const GRAPH_BASE = 'https://graph.facebook.com';
    private const CACHE_TTL_SECONDS = 120;
    private const RATE_LIMIT_REMAINING_HEADER = 'x-business-use-case-usage';

    public function billing(Request $request, AdAccount $adAccount): \Illuminate\Http\JsonResponse
    {
        $user = $request->user();

        abort_if($adAccount->businessManager->user_id !== $user->id, 403);

        if (!$adAccount->fb_ad_account_id) {
            return response()->json([
                'error' => 'No Facebook Ad Account ID configured.',
                'message' => 'This ad account does not have a linked Facebook Ad Account. Add a Facebook Ad Account ID to enable billing data.',
            ], 400);
        }

        $fbAccount = FacebookAccount::where('business_manager_id', $adAccount->business_manager_id)
            ->where('status', 'active')
            ->first();

        if (!$fbAccount) {
            return response()->json([
                'error' => 'No active Facebook account token found.',
                'message' => 'This Business Manager has no active Facebook accounts with tokens. Add a Facebook account with a valid token under the FB Accounts tab.',
            ], 400);
        }

        $cacheKey = 'fb_billing_' . $adAccount->fb_ad_account_id;

        $cached = Cache::get($cacheKey);
        if ($cached) {
            return response()->json($cached);
        }

        $adAccountId = $adAccount->fb_ad_account_id;
        if (!str_starts_with($adAccountId, 'act_')) {
            $adAccountId = 'act_' . $adAccountId;
        }

        $fields = 'balance,spend,amount_spent,account_status,currency,business_name,created_at,owner_business,disable_reason,min_campaign_group_spend_cap,spend_cap,budget_remaining,daily_spend,billing_config';

        try {
            $response = Http::timeout(10)
                ->retry(1, 1000)
                ->get(self::GRAPH_BASE . '/' . self::GRAPH_API_VERSION . '/' . $adAccountId, [
                    'fields' => $fields,
                    'access_token' => $fbAccount->token,
                ]);
        } catch (ConnectionException) {
            return response()->json([
                'error' => 'connection_error',
                'message' => 'Could not connect to Facebook Graph API. Please check your internet connection and try again.',
            ], 503);
        }

        if ($response->failed()) {
            $body = $response->json();
            $fbError = $body['error'] ?? [];

            $code = $fbError['code'] ?? 0;
            $type = $fbError['type'] ?? 'Unknown';

            if ($code === 190 || str_contains($type, 'OAuth')) {
                return response()->json([
                    'error' => 'token_expired',
                    'message' => 'Facebook token has expired or is invalid. Please update the token in the Facebook Accounts settings.',
                ], 401);
            }

            if ($code === 4 || $code === 17 || $code === 613) {
                $retryAfter = $fbError['error_subcode'] ?? 60;
                return response()->json([
                    'error' => 'rate_limited',
                    'message' => 'Facebook API rate limit exceeded. Please wait ' . $retryAfter . ' seconds before retrying.',
                    'retry_after' => $retryAfter,
                ], 429);
            }

            if ($code === 10 || $code === 200) {
                return response()->json([
                    'error' => 'permission_error',
                    'message' => 'The Facebook token does not have permission to access this ad account\'s billing data. Required permission: ads_read.',
                ], 403);
            }

            return response()->json([
                'error' => 'facebook_api_error',
                'message' => $fbError['message'] ?? 'An unknown Facebook API error occurred.',
                'code' => $code,
            ], 502);
        }

        $graphData = $response->json();

        $mapped = [
            'id' => $adAccount->id,
            'ad_account_id' => $adAccount->fb_ad_account_id,
            'name' => $adAccount->name,
            'facebook' => [
                'balance' => $graphData['balance'] ?? null,
                'spend' => $graphData['spend'] ?? null,
                'amount_spent' => $graphData['amount_spent'] ?? null,
                'account_status' => $graphData['account_status'] ?? null,
                'currency' => $graphData['currency'] ?? $adAccount->currency,
                'business_name' => $graphData['business_name'] ?? null,
                'spend_cap' => $graphData['spend_cap'] ?? null,
                'budget_remaining' => $graphData['budget_remaining'] ?? null,
                'daily_spend' => $graphData['daily_spend'] ?? null,
                'min_campaign_group_spend_cap' => $graphData['min_campaign_group_spend_cap'] ?? null,
                'disable_reason' => $graphData['disable_reason'] ?? null,
            ],
            'local' => [
                'spend' => (float) $adAccount->spend,
                'impressions' => (int) $adAccount->impressions,
                'clicks' => (int) $adAccount->clicks,
                'currency' => $adAccount->currency,
            ],
        ];

        Cache::put($cacheKey, $mapped, self::CACHE_TTL_SECONDS);

        return response()->json($mapped);
    }
}
