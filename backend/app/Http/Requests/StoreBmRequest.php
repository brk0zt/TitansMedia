<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBmRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'business_id' => 'required|string|max:64|unique:business_managers,business_id',
            'verified' => 'sometimes|boolean',
            'balance' => 'sometimes|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'overdue' => 'sometimes|numeric|min:0',
            'restriction_state' => 'nullable|string|max:32',
            'appeals_remaining' => 'sometimes|integer|min:0',
            'admin_role' => 'nullable|string|max:64',
            'verification_status' => 'sometimes|string|max:32',
            'business_verification' => 'sometimes|string|max:32',
            'pixel_count' => 'sometimes|integer|min:0',
            'partner_count' => 'sometimes|integer|min:0',
            'page_count_stored' => 'sometimes|integer|min:0',
            'ad_account_count_stored' => 'sometimes|integer|min:0',
            'metadata' => 'sometimes|array',
        ];
    }
}
