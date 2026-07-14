<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facebook_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_manager_id')->constrained()->cascadeOnDelete();
            $table->string('page_id', 64)->unique();
            $table->string('name', 255);
            $table->string('category', 128)->nullable();
            $table->bigInteger('followers')->default(0);
            $table->bigInteger('engaged')->default(0);
            $table->string('status', 16)->default('published'); // published | unpublished
            $table->jsonb('metadata')->nullable();
            $table->timestampsTz();

            $table->index(['business_manager_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facebook_pages');
    }
};
