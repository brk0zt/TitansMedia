<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdAccount extends Model
{
    protected $fillable = [
        'business_manager_id',
        'account_id',
        'name',
        'status',
        'spend',
        'currency',
        'impressions',
        'clicks',
        'metadata',
    ];

    protected $casts = [
        'spend' => 'decimal:2',
        'impressions' => 'integer',
        'clicks' => 'integer',
        'metadata' => 'array',
    ];

    public function businessManager(): BelongsTo
    {
        return $this->belongsTo(BusinessManager::class);
    }
}
