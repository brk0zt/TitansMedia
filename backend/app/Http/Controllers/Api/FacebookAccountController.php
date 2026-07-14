<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreFacebookAccountRequest;
use App\Http\Requests\UpdateFacebookAccountRequest;
use App\Http\Resources\FacebookAccountResource;
use App\Models\BusinessManager;
use App\Models\FacebookAccount;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FacebookAccountController
{
    public function index(Request $request, BusinessManager $businessManager): AnonymousResourceCollection
    {
        abort_if($businessManager->user_id !== $request->user()->id, 403);

        $accounts = $businessManager->facebookAccounts()
            ->orderBy('updated_at', 'desc')
            ->paginate(50);

        return FacebookAccountResource::collection($accounts);
    }

    public function store(StoreFacebookAccountRequest $request, BusinessManager $businessManager): FacebookAccountResource
    {
        abort_if($businessManager->user_id !== $request->user()->id, 403);

        $account = $businessManager->facebookAccounts()->create(
            $request->validated()
        );

        return new FacebookAccountResource($account);
    }

    public function update(
        UpdateFacebookAccountRequest $request,
        BusinessManager $businessManager,
        FacebookAccount $facebookAccount
    ): FacebookAccountResource {
        abort_if($businessManager->user_id !== $request->user()->id, 403);
        abort_if($facebookAccount->business_manager_id !== $businessManager->id, 404);

        $facebookAccount->update($request->validated());

        return new FacebookAccountResource($facebookAccount->fresh());
    }

    public function destroy(
        Request $request,
        BusinessManager $businessManager,
        FacebookAccount $facebookAccount
    ): \Illuminate\Http\JsonResponse {
        abort_if($businessManager->user_id !== $request->user()->id, 403);
        abort_if($facebookAccount->business_manager_id !== $businessManager->id, 404);

        $facebookAccount->delete();

        return response()->json(['message' => 'Facebook account removed.'], 200);
    }
}
