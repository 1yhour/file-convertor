<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user — use these credentials to log in as admin
        User::firstOrCreate(
            ['email' => 'admin@convertor.dev'],
            [
                'name'     => 'Admin',
                'password' => Hash::make('admin1234'),
                'role'     => 'admin',
            ]
        );

        // Regular test user
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name'     => 'Test User',
                'password' => Hash::make('password'),
                'role'     => 'user',
            ]
        );

        // Random regular users (only create if fewer than 7 total users)
        if (User::count() < 7) {
            User::factory()->count(5)->create(['role' => 'user']);
        }
    }
}
