<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\FacebookProfileResource;
use App\Models\FacebookProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FacebookProfileController
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $profiles = $request->user()
            ->facebookProfiles()
            ->orderBy('updated_at', 'desc')
            ->paginate(20);

        return FacebookProfileResource::collection($profiles);
    }

    public function store(Request $request): FacebookProfileResource
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'profile_id' => 'nullable|string|max:64|unique:facebook_profiles,profile_id',
            'restriction_status' => 'nullable|string|max:32',
            'advertising_strikes' => 'sometimes|integer|min:0',
            'identity_verification' => 'nullable|string|max:32',
            'two_factor_enabled' => 'sometimes|boolean',
            'session_status' => 'nullable|string|max:32',
            'email' => 'nullable|email|max:255',
            'token' => 'nullable|string',
            'useragent' => 'nullable|string|max:512',
            'proxy' => 'nullable|string|max:512',
            'cookie' => 'nullable|string',
            'cookie_raw' => 'nullable|string',
            'cookie_c_user' => 'nullable|string|max:255',
            'cookie_xs' => 'nullable|string',
            'cookie_datr' => 'nullable|string|max:255',
            'automation_mode' => 'sometimes|string|in:api,cookie,manual',
        ]);

        $profile = $request->user()->facebookProfiles()->create($validated);

        return new FacebookProfileResource($profile);
    }

    public function show(Request $request, FacebookProfile $facebookProfile): FacebookProfileResource
    {
        abort_if($facebookProfile->user_id !== $request->user()->id, 403);

        return new FacebookProfileResource($facebookProfile);
    }

    public function update(Request $request, FacebookProfile $facebookProfile): FacebookProfileResource
    {
        abort_if($facebookProfile->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'profile_id' => 'sometimes|string|max:64|unique:facebook_profiles,profile_id,' . $facebookProfile->id,
            'restriction_status' => 'nullable|string|max:32',
            'advertising_strikes' => 'sometimes|integer|min:0',
            'identity_verification' => 'nullable|string|max:32',
            'two_factor_enabled' => 'sometimes|boolean',
            'session_status' => 'nullable|string|max:32',
            'email' => 'nullable|email|max:255',
            'token' => 'nullable|string',
            'useragent' => 'nullable|string|max:512',
            'proxy' => 'nullable|string|max:512',
            'cookie' => 'nullable|string',
            'cookie_raw' => 'nullable|string',
            'cookie_c_user' => 'nullable|string|max:255',
            'cookie_xs' => 'nullable|string',
            'cookie_datr' => 'nullable|string|max:255',
            'automation_mode' => 'sometimes|string|in:api,cookie,manual',
        ]);

        $facebookProfile->update($validated);

        return new FacebookProfileResource($facebookProfile->fresh());
    }

    public function destroy(Request $request, FacebookProfile $facebookProfile): JsonResponse
    {
        abort_if($facebookProfile->user_id !== $request->user()->id, 403);

        $facebookProfile->delete();

        return response()->json(['message' => 'Facebook profile removed successfully.'], 200);
    }
}
