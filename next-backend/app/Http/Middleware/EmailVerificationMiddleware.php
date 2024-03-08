<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EmailVerificationMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
   public function handle(Request $request, Closure $next)
    {
        if (!auth()->check()) {
            // Lưu trữ URL mà người dùng cố gắng truy cập
            session()->put('redirect_url', $request->fullUrl());

            // Chuyển hướng đến trang đăng nhập
            return redirect()->route('login');
        }

        return $next($request);
    }
}