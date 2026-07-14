<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\AdAccountResource;
use App\Models\BusinessManager;
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
}
