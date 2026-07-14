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
        'token',
        'useragent',
        'proxy',
        'group_name',
        'cookie',
        'notify_balance_threshold',
        'notify_cooldown_minutes',
        'notify_moderation',
        'notify_cabinet_status',
        'notify_billing',
        'status',
        'metadata',
    ];

    protected $casts = [
        'followers' => 'integer',
        'engaged' => 'integer',
        'notify_balance_threshold' => 'decimal:2',
        'notify_cooldown_minutes' => 'integer',
        'notify_moderation' => 'boolean',
        'notify_cabinet_status' => 'boolean',
        'notify_billing' => 'boolean',
        'metadata' => 'array',
    ];

    public function businessManager(): BelongsTo
    {
        return $this->belongsTo(BusinessManager::class);
    }
}
