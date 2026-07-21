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
            'financial' => [
                'balance' => (float) $this->balance,
                'currency' => $this->currency,
                'overdue' => (float) $this->overdue,
            ],
            'restriction_state' => $this->restriction_state,
            'appeals_remaining' => (int) $this->appeals_remaining,
            'admin_role' => $this->admin_role,
            'verification_status' => $this->verification_status ?? ($this->verified ? 'verified' : 'none'),
            'business_verification' => $this->business_verification ?? 'none',
            'pixel_count' => (int) $this->pixel_count,
            'partner_count' => (int) $this->partner_count,
            'page_count_stored' => (int) $this->page_count_stored,
            'ad_account_count_stored' => (int) $this->ad_account_count_stored,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
