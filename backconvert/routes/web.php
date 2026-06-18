<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

require __DIR__.'/auth.php';
Route::get('/test-login', function () {
    // Find the first user, or create one if none exist
    $user = \App\Models\User::first() ?? \App\Models\User::factory()->create();
    
    // Force log them in using the session
    \Illuminate\Support\Facades\Auth::login($user);
    
    return \Illuminate\Support\Facades\Blade::render('
    <!DOCTYPE html>
    <html>
    <head>
        <title>Echo Test</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        @vite(["resources/js/app.js"])
    </head>
    <body>
        <h1>You are logged in as User ID: {{ $userId }}</h1>
        <p>Keep this page open, open your Developer Console, and paste the Echo JS code!</p>
    </body>
    </html>
    ', ['userId' => $user->id]);
});
