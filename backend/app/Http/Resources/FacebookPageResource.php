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
            'token' => $this->token,
            'useragent' => $this->useragent,
            'proxy' => $this->proxy,
            'group_name' => $this->group_name,
            'cookie' => $this->cookie,
            'notify_balance_threshold' => (float) $this->notify_balance_threshold,
            'notify_cooldown_minutes' => (int) $this->notify_cooldown_minutes,
            'notify_moderation' => (bool) $this->notify_moderation,
            'notify_cabinet_status' => (bool) $this->notify_cabinet_status,
            'notify_billing' => (bool) $this->notify_billing,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}
