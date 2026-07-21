<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AutoRuleResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'target_type' => $this->target_type,
            'target_id' => $this->target_id,
            'conditions' => $this->conditions,
            'operator' => $this->operator,
            'action_type' => $this->action_type,
            'action_value' => $this->action_value !== null ? (float) $this->action_value : null,
            'action_field' => $this->action_field,
            'is_active' => (bool) $this->is_active,
            'last_triggered_at' => $this->last_triggered_at,
            'trigger_count' => (int) $this->trigger_count,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
