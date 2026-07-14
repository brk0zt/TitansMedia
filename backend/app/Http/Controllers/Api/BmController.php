<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreBmRequest;
use App\Http\Resources\BusinessManagerResource;
use App\Models\BusinessManager;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BmController
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $bms = $request->user()
            ->businessManagers()
            ->withCount(['adAccounts', 'facebookPages', 'teamMembers', 'facebookAccounts'])
            ->orderBy('updated_at', 'desc')
            ->paginate(20);

        return BusinessManagerResource::collection($bms);
    }

    public function show(Request $request, BusinessManager $businessManager): BusinessManagerResource
    {
        abort_if($businessManager->user_id !== $request->user()->id, 403);

        $businessManager->loadCount(['adAccounts', 'facebookPages', 'teamMembers', 'facebookAccounts']);

        return new BusinessManagerResource($businessManager);
    }

    public function store(StoreBmRequest $request): BusinessManagerResource
    {
        $bm = $request->user()->businessManagers()->create(
            $request->validated()
        );

        return new BusinessManagerResource($bm);
    }

    public function destroy(Request $request, BusinessManager $businessManager): \Illuminate\Http\JsonResponse
    {
        abort_if($businessManager->user_id !== $request->user()->id, 403);

        $businessManager->delete();

        return response()->json(['message' => 'Business Manager deleted.'], 200);
    }
}
