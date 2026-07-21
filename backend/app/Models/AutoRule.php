<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AutoRule extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'target_type',
        'target_id',
        'conditions',
        'operator',
        'action_type',
        'action_value',
        'action_field',
        'is_active',
        'last_triggered_at',
        'trigger_count',
        'metadata',
    ];

    protected $casts = [
        'conditions' => 'array',
        'action_value' => 'decimal:2',
        'is_active' => 'boolean',
        'last_triggered_at' => 'datetime',
        'trigger_count' => 'integer',
        'metadata' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
