<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ad_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_manager_id')->constrained()->cascadeOnDelete();
            $table->string('account_id', 64)->unique();
            $table->string('name', 255);
            $table->string('status', 16)->default('active'); // active | disabled
            $table->decimal('spend', 14, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->bigInteger('impressions')->default(0);
            $table->bigInteger('clicks')->default(0);
            $table->jsonb('metadata')->nullable();
            $table->timestampsTz();

            $table->index(['business_manager_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_accounts');
    }
};
