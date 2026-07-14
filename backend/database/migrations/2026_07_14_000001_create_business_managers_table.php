<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_managers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 255);
            $table->string('business_id', 64)->unique();
            $table->boolean('verified')->default(false);
            $table->decimal('balance', 14, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->decimal('overdue', 14, 2)->default(0);
            $table->jsonb('metadata')->nullable();
            $table->timestampsTz();

            $table->index(['user_id', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_managers');
    }
};
