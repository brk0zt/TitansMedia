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
            'created_at' => $this->created_at,
        ];
    }
}
