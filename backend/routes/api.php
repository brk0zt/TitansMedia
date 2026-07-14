<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\BmController;
use App\Http\Controllers\Api\AdAccountController;
use App\Http\Controllers\Api\FacebookPageController;
use App\Http\Controllers\Api\TeamMemberController;
use App\Http\Middleware\AuthRateLimiter;
use App\Http\Middleware\ApiRateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/run-migrations', function () {
    try {
        Artisan::call('migrate', ['--force' => true]);
        return "Tablolar başarıyla kuruldu! Çıktı: " . Artisan::output();
    } catch (\Exception $e) {
        return "Bir hata oluştu: " . $e->getMessage();
    }
});

// ==========================================
// AUTHENTICATION ROUTES (Aggressive Rate Limiting)
// ==========================================
Route::middleware([AuthRateLimiter::class])->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
});

// ==========================================
// PROTECTED API ROUTES (Sanctum + UX-Preserving API Rate Limiting)
// ==========================================
Route::middleware(['auth:sanctum', ApiRateLimiter::class])->group(function () {
    // Session state
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Projects CRUD
    Route::apiResource('projects', ProjectController::class);
    
    // Tasks CRUD
    Route::apiResource('projects.tasks', TaskController::class);
    Route::patch('/tasks/{id}/complete', [TaskController::class, 'complete']);
    
    // Analytics
    Route::get('/analytics/forecast/{project_id}', [AnalyticsController::class, 'forecast']);
    Route::get('/analytics/risk/{project_id}', [AnalyticsController::class, 'risk']);
    Route::get('/analytics/patterns', [AnalyticsController::class, 'patterns']);
    Route::get('/analytics/timeseries', [AnalyticsController::class, 'timeseries']);
    Route::get('/clear-cache', function() {
    Artisan::call('optimize:clear');
    return "Cache cleared successfully";
});

    // ==========================================
    // FBTool — Business Manager Management
    // ==========================================
    Route::apiResource('business-managers', BmController::class)->only(['index', 'show', 'store', 'destroy']);

    // Ad Accounts under a BM
    Route::get('/business-managers/{businessManager}/ad-accounts', [AdAccountController::class, 'index']);

    // Facebook Pages under a BM
    Route::get('/business-managers/{businessManager}/pages', [FacebookPageController::class, 'index']);

    // Team Members under a BM
    Route::get('/business-managers/{businessManager}/members', [TeamMemberController::class, 'index']);
    Route::post('/business-managers/{businessManager}/members/invite', [TeamMemberController::class, 'invite']);
    Route::put('/business-managers/{businessManager}/members/{teamMember}/role', [TeamMemberController::class, 'updateRole']);
    Route::delete('/business-managers/{businessManager}/members/{teamMember}', [TeamMemberController::class, 'destroy']);
});