<?php

use App\Http\Controllers\Api\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authenticated user info
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// ─────────────────────────────────────────────────────────────────────────────
// Admin Routes — requires auth:sanctum + admin role
// ─────────────────────────────────────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    // Dashboard stats
    Route::get('/stats', [AdminController::class, 'stats']);

    // User management
    Route::get('/users',                   [AdminController::class, 'listUsers']);
    Route::get('/users/{user}',            [AdminController::class, 'showUser']);
    Route::patch('/users/{user}/role',     [AdminController::class, 'updateUserRole']);
    Route::delete('/users/{user}',         [AdminController::class, 'deleteUser']);

    // All conversion jobs
    Route::get('/jobs',                    [AdminController::class, 'listJobs']);

    // API logs
    Route::get('/api-logs',               [AdminController::class, 'listApiLogs']);
});
