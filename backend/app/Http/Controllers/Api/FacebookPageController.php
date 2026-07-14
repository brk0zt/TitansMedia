<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreFacebookPageRequest;
use App\Http\Requests\UpdateFacebookPageRequest;
use App\Http\Resources\FacebookPageResource;
use App\Models\BusinessManager;
use App\Models\FacebookPage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

class FacebookPageController
{
    public function index(Request $request, BusinessManager $businessManager): AnonymousResourceCollection
    {
        abort_if($businessManager->user_id !== $request->user()->id, 403);

        $pages = $businessManager->facebookPages()
            ->orderBy('updated_at', 'desc')
            ->paginate(20);

        return FacebookPageResource::collection($pages);
    }

    public function store(StoreFacebookPageRequest $request, BusinessManager $businessManager): FacebookPageResource|JsonResponse
    {
        abort_if($businessManager->user_id !== $request->user()->id, 403);

        $data = $request->validated();

        if (empty($data['page_id'])) {
            $data['page_id'] = 'page_' . Str::random(10);
        }

        try {
            $page = $businessManager->facebookPages()->create($data);
            return new FacebookPageResource($page);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create page. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(
        UpdateFacebookPageRequest $request,
        BusinessManager $businessManager,
        FacebookPage $facebookPage
    ): FacebookPageResource {
        abort_if($businessManager->user_id !== $request->user()->id, 403);
        abort_if($facebookPage->business_manager_id !== $businessManager->id, 404);

        $facebookPage->update($request->validated());

        return new FacebookPageResource($facebookPage->fresh());
    }

    public function destroy(
        Request $request,
        BusinessManager $businessManager,
        FacebookPage $facebookPage
    ): JsonResponse {
        abort_if($businessManager->user_id !== $request->user()->id, 403);
        abort_if($facebookPage->business_manager_id !== $businessManager->id, 404);

        $facebookPage->delete();

        return response()->json(['message' => 'Page removed successfully.'], 200);
    }
}
