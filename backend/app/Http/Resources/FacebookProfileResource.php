<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FacebookProfileResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'profile_id' => $this->profile_id,
            'restriction_status' => $this->restriction_status,
            'advertising_strikes' => (int) $this->advertising_strikes,
            'identity_verification' => $this->identity_verification,
            'two_factor_enabled' => (bool) $this->two_factor_enabled,
            'session_status' => $this->session_status,
            'email' => $this->email,
            'automation_mode' => $this->automation_mode ?? 'api',
            'token' => $this->token,
            'useragent' => $this->useragent,
            'proxy' => $this->proxy,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
