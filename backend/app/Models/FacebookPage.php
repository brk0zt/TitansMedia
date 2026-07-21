<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacebookPage extends Model
{
    protected $fillable = [
        'business_manager_id',
        'page_id',
        'name',
        'category',
        'followers',
        'engaged',
        'automation_mode',
        'balance',
        'token',
        'useragent',
        'proxy',
        'group_name',
        'cookie',
        'cookie_raw',
        'cookie_c_user',
        'cookie_xs',
        'cookie_datr',
        'notify_balance_threshold',
        'notify_cooldown_minutes',
        'notify_moderation',
        'notify_cabinet_status',
        'notify_billing',
        'fetch_boosted_posts',
        'fetch_dark_posts',
        'fetch_lead_forms',
        'monitor_impressions',
        'monitor_clicks',
        'monitor_budget',
        'monitor_reach',
        'monitor_engagement',
        'status',
        'linked_instagram',
        'banned',
        'unpublished_reason',
        'admin_role',
        'editor',
        'advertiser',
        'moderator',
        'permission_list',
        'restriction_reason',
        'policy_strike',
        'appeal_available',
        'metadata',
    ];

    protected $casts = [
        'followers' => 'integer',
        'engaged' => 'integer',
        'automation_mode' => 'string',
        'balance' => 'decimal:2',
        'notify_balance_threshold' => 'decimal:2',
        'notify_cooldown_minutes' => 'integer',
        'notify_moderation' => 'boolean',
        'notify_cabinet_status' => 'boolean',
        'notify_billing' => 'boolean',
        'fetch_boosted_posts' => 'boolean',
        'fetch_dark_posts' => 'boolean',
        'fetch_lead_forms' => 'boolean',
        'monitor_impressions' => 'boolean',
        'monitor_clicks' => 'boolean',
        'monitor_budget' => 'boolean',
        'monitor_reach' => 'boolean',
        'monitor_engagement' => 'boolean',
        'banned' => 'boolean',
        'admin_role' => 'boolean',
        'editor' => 'boolean',
        'advertiser' => 'boolean',
        'moderator' => 'boolean',
        'permission_list' => 'array',
        'policy_strike' => 'integer',
        'appeal_available' => 'boolean',
        'metadata' => 'array',
        'cookie' => 'encrypted',
        'cookie_raw' => 'encrypted',
        'cookie_c_user' => 'encrypted',
        'cookie_xs' => 'encrypted',
        'cookie_datr' => 'encrypted',
    ];

    public function businessManager(): BelongsTo
    {
        return $this->belongsTo(BusinessManager::class);
    }
}
