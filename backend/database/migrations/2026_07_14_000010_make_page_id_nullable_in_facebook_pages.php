<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (config('database.default') !== 'sqlite') {
            DB::statement('ALTER TABLE facebook_pages ALTER COLUMN page_id DROP NOT NULL');
        }
    }

    public function down(): void
    {
        if (config('database.default') !== 'sqlite') {
            DB::statement('ALTER TABLE facebook_pages ALTER COLUMN page_id SET NOT NULL');
        }
    }
};
