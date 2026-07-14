<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFacebookAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'token' => 'sometimes|string',
            'useragent' => 'sometimes|string|max:512',
            'proxy' => 'nullable|string|max:512',
            'group_name' => 'nullable|string|max:255',
            'cookie' => 'nullable|string',
            'notify_balance_threshold' => 'sometimes|numeric|min:0',
            'notify_cooldown_minutes' => 'sometimes|integer|min:1',
            'notify_moderation' => 'sometimes|boolean',
            'notify_cabinet_status' => 'sometimes|boolean',
            'notify_billing' => 'sometimes|boolean',
            'status' => 'sometimes|string|in:active,disabled',
        ];
    }
}
