<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacebookAccount extends Model
{
    protected $fillable = [
        'business_manager_id',
        'name',
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
    ];

    protected $casts = [
        'notify_balance_threshold' => 'decimal:2',
        'notify_cooldown_minutes' => 'integer',
        'notify_moderation' => 'boolean',
        'notify_cabinet_status' => 'boolean',
        'notify_billing' => 'boolean',
    ];

    public function businessManager(): BelongsTo
    {
        return $this->belongsTo(BusinessManager::class);
    }
}
