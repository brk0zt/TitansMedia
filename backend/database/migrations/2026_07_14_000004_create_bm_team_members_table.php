<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bm_team_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_manager_id')->constrained()->cascadeOnDelete();
            $table->string('name', 128);
            $table->string('email', 255);
            $table->string('role', 64)->default('Viewer'); // Admin | Ad Manager | Analyst | Viewer
            $table->string('status', 16)->default('active'); // active | disabled
            $table->timestampTz('last_active_at')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->timestampsTz();

            $table->unique(['business_manager_id', 'email']);
            $table->index(['business_manager_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bm_team_members');
    }
};
