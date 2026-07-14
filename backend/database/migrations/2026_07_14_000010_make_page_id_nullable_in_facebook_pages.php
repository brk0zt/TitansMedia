<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('facebook_pages', function (Blueprint $table) {
            $table->string('page_id', 64)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('facebook_pages', function (Blueprint $table) {
            $table->string('page_id', 64')->nullable(false)->change();
        });
    }
};
