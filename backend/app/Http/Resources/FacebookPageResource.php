<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FacebookPageResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'page_id' => $this->page_id,
            'name' => $this->name,
            'category' => $this->category,
            'followers' => (int) $this->followers,
            'engaged' => (int) $this->engaged,
            'automation_mode' => $this->automation_mode ?? 'api',
            'balance' => (float) $this->balance,
            'token' => $this->token,
            'useragent' => $this->useragent,
            'proxy' => $this->proxy,
            'group_name' => $this->group_name,
            'cookie' => $this->cookie,
            'cookie_raw' => $this->cookie_raw,
            'cookie_c_user' => $this->cookie_c_user,
            'cookie_xs' => $this->cookie_xs,
            'cookie_datr' => $this->cookie_datr,
            'notify_balance_threshold' => (float) $this->notify_balance_threshold,
            'notify_cooldown_minutes' => (int) $this->notify_cooldown_minutes,
            'notify_moderation' => (bool) $this->notify_moderation,
            'notify_cabinet_status' => (bool) $this->notify_cabinet_status,
            'notify_billing' => (bool) $this->notify_billing,
            'fetch_boosted_posts' => (bool) $this->fetch_boosted_posts,
            'fetch_dark_posts' => (bool) $this->fetch_dark_posts,
            'fetch_lead_forms' => (bool) $this->fetch_lead_forms,
            'monitor_impressions' => (bool) $this->monitor_impressions,
            'monitor_clicks' => (bool) $this->monitor_clicks,
            'monitor_budget' => (bool) $this->monitor_budget,
            'monitor_reach' => (bool) $this->monitor_reach,
            'monitor_engagement' => (bool) $this->monitor_engagement,
            'status' => $this->status,
            'linked_instagram' => $this->linked_instagram,
            'banned' => (bool) $this->banned,
            'unpublished_reason' => $this->unpublished_reason,
            'admin_role' => (bool) $this->admin_role,
            'editor' => (bool) $this->editor,
            'advertiser' => (bool) $this->advertiser,
            'moderator' => (bool) $this->moderator,
            'permission_list' => $this->permission_list,
            'restriction_reason' => $this->restriction_reason,
            'policy_strike' => (int) $this->policy_strike,
            'appeal_available' => (bool) $this->appeal_available,
            'created_at' => $this->created_at,
        ];
    }
}
