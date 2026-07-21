<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\AutoRuleResource;
use App\Models\AutoRule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AutoRuleController
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $rules = $request->user()
            ->autoRules()
            ->orderBy('updated_at', 'desc')
            ->paginate(20);

        return AutoRuleResource::collection($rules);
    }

    public function store(Request $request): AutoRuleResource
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'target_type' => 'required|string|in:ad_account,facebook_page,ad_set,ad',
            'target_id' => 'nullable|integer|exists:' . ($request->target_type === 'ad_account' ? 'ad_accounts' : 'facebook_pages') . ',id',
            'conditions' => 'required|array',
            'conditions.*.metric' => 'required|string',
            'conditions.*.operator' => 'required|string|in:>,<,=,>=,<=',
            'conditions.*.value' => 'required|numeric',
            'operator' => 'required|string|in:and,or',
            'action_type' => 'required|string|in:stop,start,change_daily_budget,change_lifetime_budget,change_bid',
            'action_value' => 'nullable|numeric|min:0',
            'action_field' => 'nullable|string|max:64',
            'is_active' => 'sometimes|boolean',
        ]);

        $rule = $request->user()->autoRules()->create($validated);

        return new AutoRuleResource($rule);
    }

    public function show(Request $request, AutoRule $autoRule): AutoRuleResource
    {
        abort_if($autoRule->user_id !== $request->user()->id, 403);

        return new AutoRuleResource($autoRule);
    }

    public function update(Request $request, AutoRule $autoRule): AutoRuleResource
    {
        abort_if($autoRule->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'target_type' => 'sometimes|string|in:ad_account,facebook_page,ad_set,ad',
            'target_id' => 'nullable|integer',
            'conditions' => 'sometimes|array',
            'conditions.*.metric' => 'required_with:conditions|string',
            'conditions.*.operator' => 'required_with:conditions|string|in:>,<,=,>=,<=',
            'conditions.*.value' => 'required_with:conditions|numeric',
            'operator' => 'sometimes|string|in:and,or',
            'action_type' => 'sometimes|string|in:stop,start,change_daily_budget,change_lifetime_budget,change_bid',
            'action_value' => 'nullable|numeric|min:0',
            'action_field' => 'nullable|string|max:64',
            'is_active' => 'sometimes|boolean',
        ]);

        $autoRule->update($validated);

        return new AutoRuleResource($autoRule->fresh());
    }

    public function destroy(Request $request, AutoRule $autoRule): JsonResponse
    {
        abort_if($autoRule->user_id !== $request->user()->id, 403);

        $autoRule->delete();

        return response()->json(['message' => 'Auto rule removed successfully.'], 200);
    }

    public function toggle(Request $request, AutoRule $autoRule): JsonResponse
    {
        abort_if($autoRule->user_id !== $request->user()->id, 403);

        $autoRule->update(['is_active' => !$autoRule->is_active]);

        return response()->json([
            'message' => $autoRule->is_active ? 'Auto rule activated.' : 'Auto rule deactivated.',
            'data' => new AutoRuleResource($autoRule->fresh()),
        ]);
    }
}
