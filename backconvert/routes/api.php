<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ConversionController; // Fixed typo: Controller -> Controllers
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/user/jobs', [ConversionController::class, 'index']);
    
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/users',                   [AdminController::class, 'listUsers']);
        Route::get('/users/{user}',            [AdminController::class, 'showUser']);
        Route::patch('/users/{user}/role',     [AdminController::class, 'updateUserRole']);
        Route::delete('/users/{user}',         [AdminController::class, 'deleteUser']);
        Route::get('/jobs',                    [AdminController::class, 'listJobs']);
        Route::get('/api-logs',               [AdminController::class, 'listApiLogs']);
    });
});
Route::post('/convert/upload', [ConversionController::class, 'upload'])
    ->middleware('throttle:uploads');

Route::get('/convert/download/{jobId}', [ConversionController::class, 'download'])
    ->middleware('throttle:downloads'); // second layer of protection ensure that user cannot download more than 60 files per minute.
