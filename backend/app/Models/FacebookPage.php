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
        'status',
        'metadata',
    ];

    protected $casts = [
        'followers' => 'integer',
        'engaged' => 'integer',
        'metadata' => 'array',
    ];

    public function businessManager(): BelongsTo
    {
        return $this->belongsTo(BusinessManager::class);
    }
}
