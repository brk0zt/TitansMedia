<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BmTeamMember extends Model
{
    protected $fillable = [
        'business_manager_id',
        'name',
        'email',
        'role',
        'status',
        'last_active_at',
        'metadata',
    ];

    protected $casts = [
        'last_active_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function businessManager(): BelongsTo
    {
        return $this->belongsTo(BusinessManager::class);
    }
}
