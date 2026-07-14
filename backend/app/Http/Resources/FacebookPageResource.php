<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FacebookPageResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'page_id' => $this->page_id,
            'name' => $this->name,
            'category' => $this->category,
            'followers' => (int) $this->followers,
            'engaged' => (int) $this->engaged,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}
