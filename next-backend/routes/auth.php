<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\ProfileControllers;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
Route::middleware(['web'])->group(function () {
Route::post('/register', [RegisteredUserController::class, 'store'])
                ->middleware(['guest', 'throttle:6,1'])
                ->name('register');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
                ->middleware(['guest', 'throttle:6,1'])
                ->name('login');
// Route::get('/login', [AuthenticatedSessionController::class, 'getLoginInfo'])
//                 ->middleware('guest')
//                 ->name('login');
Route::get('/login', function (Request $request) {
    // Xử lý logic khi nhận yêu cầu GET login từ Next.js
    // Trả về đường dẫn cần chuyển hướng trong mã JSON
    return response(null, 302)->header('Location', 'http://localhost:3000/login');
});
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
                ->middleware('guest')
                ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
                ->middleware('guest')
                ->name('password.store');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
                // ->middleware(['auth', 'signed', 'throttle:6,1'])
                ->middleware(['auth.redirect', 'signed','throttle:6,1'])
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
                    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);
              
                });

                Route::get('/profiles', [ProfileControllers::class, 'show']) ->middleware(['auth'])->name('profiles.show');
                Route::post('/profiles', [ProfileControllers::class, 'store']) ->middleware(['auth'])->name('profiles.store');
                Route::put('/profiles', [ProfileControllers::class, 'update']) ->middleware(['auth'])->name('profiles.update');
                Route::delete('/profiles', [ProfileControllers::class, 'destroy']) ->middleware(['auth'])->name('profiles.destroy'); 
                Route::get('/recent-messages', [MessageController::class, 'showRecentMessages'])->middleware('auth'); 
                Route::post('/addImageProfile', [ProfileControllers::class, 'addImageProfile'])->middleware('auth'); 
                Route::put('/profiles/{id}/images/{index}', [ProfileControllers::class, 'updateImageProfile']);
                Route::delete('/profiles/{id}/images/{index}', [ProfileControllers::class, 'deleteImageProfile']);
Route::middleware(['auth'])->group(function () {
                    Route::post('/store-or-update-profile', [ProfileControllers::class, 'storeOrUpdateProfile']);
                    Route::get('/first-name-and-image', [ProfileControllers::class, 'getFirstNameAndFirstImage']);
                    Route::get('/user/{id}/first-image', [ProfileControllers::class, 'getFirstImagePathForUser']);
                    Route::post('/likes', [LikeController::class, 'createLike'])->name('likes.createLike');
                    Route::get('/likes', [LikeController::class, 'showLikes'])->name('likes.showLikes');
                    Route::get('/users', [LikeController::class, 'index'])->name('foods.index');
                    Route::get('/users/{id}', [LikeController::class, 'show'])->name('users.show');
                    Route::get('/messages/matches', [MessageController::class, 'showMatches'])->name('messages.matches');
                    Route::get('/messages/{id}', [MessageController::class, 'showConversation'])->name('messages.show');
                    Route::post('/messages/send', [MessageController::class, 'sendMessage'])->name('messages.send');
                    Route::delete('/matches/{id}', [MessageController::class, 'deleteMatch']);
                });    
});