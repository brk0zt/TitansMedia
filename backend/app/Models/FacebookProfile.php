<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacebookProfile extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'profile_id',
        'restriction_status',
        'advertising_strikes',
        'identity_verification',
        'two_factor_enabled',
        'session_status',
        'email',
        'token',
        'useragent',
        'proxy',
        'cookie',
        'cookie_raw',
        'cookie_c_user',
        'cookie_xs',
        'cookie_datr',
        'automation_mode',
        'metadata',
    ];

    protected $casts = [
        'advertising_strikes' => 'integer',
        'two_factor_enabled' => 'boolean',
        'automation_mode' => 'string',
        'metadata' => 'array',
        'cookie' => 'encrypted',
        'cookie_raw' => 'encrypted',
        'cookie_c_user' => 'encrypted',
        'cookie_xs' => 'encrypted',
        'cookie_datr' => 'encrypted',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
