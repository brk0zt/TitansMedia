<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\FacebookPageResource;
use App\Models\BusinessManager;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

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
}
