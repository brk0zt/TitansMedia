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
        ]);

        $adAccount->update($validated);

        return response()->json([
            'message' => 'Ad account updated successfully.',
            'data' => new AdAccountResource($adAccount),
        ]);
    }
}
