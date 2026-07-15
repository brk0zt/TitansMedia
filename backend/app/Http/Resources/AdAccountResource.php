<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AdAccountResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'account_id' => $this->account_id,
            'fb_ad_account_id' => $this->fb_ad_account_id,
            'name' => $this->name,
            'status' => $this->status,
            'spend' => (float) $this->spend,
            'currency' => $this->currency,
            'impressions' => (int) $this->impressions,
            'clicks' => (int) $this->clicks,
            'balance' => (float) $this->balance,
            'manual_mode' => (bool) $this->manual_mode,
            'token' => $this->token,
            'useragent' => $this->useragent,
            'proxy' => $this->proxy,
            'cookie' => $this->cookie,
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
            'created_at' => $this->created_at,
        ];
    }
}
