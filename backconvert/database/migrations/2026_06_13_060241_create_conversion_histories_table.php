<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('conversion_histories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('conversion_job_id')->constrained('conversion_jobs')->cascadeOnDelete();
            $table->string('old_status');
            $table->string('new_status');
            $table->string('message');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversion_histories');
    }
};
