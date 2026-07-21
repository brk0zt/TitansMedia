<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusinessManager extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'business_id',
        'verified',
        'balance',
        'currency',
        'overdue',
        'restriction_state',
        'appeals_remaining',
        'admin_role',
        'verification_status',
        'business_verification',
        'pixel_count',
        'partner_count',
        'page_count_stored',
        'ad_account_count_stored',
        'metadata',
    ];

    protected $casts = [
        'verified' => 'boolean',
        'balance' => 'decimal:2',
        'overdue' => 'decimal:2',
        'appeals_remaining' => 'integer',
        'pixel_count' => 'integer',
        'partner_count' => 'integer',
        'page_count_stored' => 'integer',
        'ad_account_count_stored' => 'integer',
        'metadata' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function adAccounts(): HasMany
    {
        return $this->hasMany(AdAccount::class);
    }

    public function facebookPages(): HasMany
    {
        return $this->hasMany(FacebookPage::class);
    }

    public function teamMembers(): HasMany
    {
        return $this->hasMany(BmTeamMember::class);
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(BmInvitation::class);
    }

}
