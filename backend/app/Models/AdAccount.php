<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdAccount extends Model
{
    protected $fillable = [
        'business_manager_id',
        'account_id',
        'fb_ad_account_id',
        'name',
        'status',
        'spend',
        'currency',
        'impressions',
        'clicks',
        'balance',
        'manual_mode',
        'token',
        'useragent',
        'proxy',
        'cookie',
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
        'metadata',
    ];

    protected $casts = [
        'spend' => 'decimal:2',
        'impressions' => 'integer',
        'clicks' => 'integer',
        'balance' => 'decimal:2',
        'manual_mode' => 'boolean',
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
        'metadata' => 'array',
    ];

    public function businessManager(): BelongsTo
    {
        return $this->belongsTo(BusinessManager::class);
    }
}
