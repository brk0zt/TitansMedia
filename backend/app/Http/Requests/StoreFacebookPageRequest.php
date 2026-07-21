<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFacebookPageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'automation_mode' => 'sometimes|string|in:api,cookie,manual',
            'page_id' => 'nullable|string|max:64',
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:128',
            'followers' => 'sometimes|integer|min:0',
            'engaged' => 'sometimes|integer|min:0',
            'balance' => 'sometimes|numeric|min:0',
            'token' => 'required_if:automation_mode,api|nullable|string',
            'useragent' => 'required_if:automation_mode,api|required_if:automation_mode,cookie|nullable|string|max:512',
            'proxy' => 'nullable|string|max:512',
            'group_name' => 'nullable|string|max:255',
            'cookie' => 'nullable|string',
            'cookie_raw' => 'nullable|string',
            'cookie_c_user' => 'nullable|string|max:255',
            'cookie_xs' => 'nullable|string',
            'cookie_datr' => 'nullable|string|max:255',
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
            'status' => 'sometimes|string|in:published,unpublished,restricted,banned',
            'linked_instagram' => 'nullable|string|max:255',
            'unpublished_reason' => 'nullable|string',
            'admin_role' => 'sometimes|boolean',
            'editor' => 'sometimes|boolean',
            'advertiser' => 'sometimes|boolean',
            'moderator' => 'sometimes|boolean',
            'permission_list' => 'nullable|array',
            'restriction_reason' => 'nullable|string',
            'policy_strike' => 'sometimes|integer|min:0',
            'appeal_available' => 'sometimes|boolean',
        ];
    }
}
