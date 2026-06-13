<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call(ConversionJobSeeder::class);
        $this->call(ApiLogSeeder::class);
        $this->call(ConversionHistorySeeder::class);
        $this->call(FileSeeder::class);
        $this->call(UserSeeder::class);
    }
}
