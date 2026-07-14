<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BusinessManagerResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'business_id' => $this->business_id,
            'verified' => $this->verified,
            'ad_account_count' => $this->whenCounted('adAccounts', $this->ad_accounts_count ?? 0),
            'page_count' => $this->whenCounted('facebookPages', $this->facebook_pages_count ?? 0),
            'user_count' => $this->whenCounted('teamMembers', $this->team_members_count ?? 0),
            'facebook_account_count' => $this->whenCounted('facebookAccounts', $this->facebook_accounts_count ?? 0),
            'financial' => [
                'balance' => (float) $this->balance,
                'currency' => $this->currency,
                'overdue' => (float) $this->overdue,
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
