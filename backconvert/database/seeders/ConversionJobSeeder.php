<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ConversionJob;
use App\Models\File;
use App\Models\ConversionHistory;

class ConversionJobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ConversionJob::factory()->count(10)
        ->has(File::factory()->count(2), 'files')
        ->has(ConversionHistory::factory()->count(2), 'history')
        ->create();
    }
}
