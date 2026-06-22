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

Route::get('/trigger-conversion', function () {
    // 1. Generate a dummy text file to act as our upload
    $storedName = 'test_uploads/dummy_' . time() . '.txt';
    \Illuminate\Support\Facades\Storage::put($storedName, 'Hello from Laravel! Please convert this txt to a pdf.');

    // 2. Create the ConversionJob record
    $user = \App\Models\User::first();
    $conversion = \App\Models\ConversionJob::create([
        'user_id' => $user->id,
        'input_format' => 'txt',
        'output_format' => 'pdf',
        'status' => 'pending'
    ]);

    // 3. Link the Input File to the Job
    $conversion->files()->create([
        'file_type' => 'input',
        'original_name' => 'dummy.txt',
        'stored_name' => $storedName,
        'mime_type' => 'text/plain',
        'size' => \Illuminate\Support\Facades\Storage::size($storedName),
    ]);

    // 4. Dispatch it!
    \App\Jobs\ConvertFileJob::dispatch($conversion)->onQueue('conversions');

    return "Job Dispatched! Go look at your Developer Console in the /test-login tab!";
});
