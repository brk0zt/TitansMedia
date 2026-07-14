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
            'metadata' => 'sometimes|array',
        ];
    }
}
