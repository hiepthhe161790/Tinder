<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredProfileControllers;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\ProfileControllers;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware(['web'])->group(function () {
    Route::post('/register', [RegisteredProfileControllers::class, 'store'])
                    ->middleware('guest')
                    ->name('register');
    
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
                    ->middleware('guest')
                    ->name('login');
    Route::get('/login', [AuthenticatedSessionController::class, 'getLoginInfo'])
                    ->middleware('guest')
                    ->name('login');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
                    ->middleware('guest')
                    ->name('password.email');
    
    Route::post('/reset-password', [NewPasswordController::class, 'store'])
                    ->middleware('guest')
                    ->name('password.store');
    
    Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
                    ->middleware(['auth', 'signed', 'throttle:6,1'])
                    ->name('verification.verify');
    
    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
                    ->middleware(['auth', 'throttle:6,1'])
                    ->name('verification.send');
    
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
                    ->middleware('auth')
                    ->name('logout');
    Route::get('/email/verify', EmailVerificationPromptController::class)
                    ->middleware(['auth'])
                    ->name('verification.notice');
                    Route::put('password', [PasswordController::class, 'update'])  ->middleware(['auth'])->name('password.update');
    Route::middleware('auth')->group(function () {
                        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
                        Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
                        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
                        Route::get('/profiles', [ProfileControllers::class, 'show']);
                        Route::post('/profiles', [ProfileControllers::class, 'store']);
                        Route::put('/profiles', [ProfileControllers::class, 'update']);
                        Route::delete('/profiles', [ProfileControllers::class, 'destroy']);  
                    });
                    
    });