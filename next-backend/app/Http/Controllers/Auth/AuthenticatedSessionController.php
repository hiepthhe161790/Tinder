<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function getLoginInfo()
    {
        $message = urlencode('Please log in to verify your email.');
        $redirectUrl = "http://localhost:3000/login?message=$message";
        Log::debug('Verification URL: chưa verify');
        echo "<script>
            setTimeout(function() {
                alert('Please login and click once again on the email address link you provided during registration to verify your email.');
                window.location.href = '$redirectUrl';
            }, 3000); // 5 seconds delay
        </script>";
        
        exit();
    }
    // public function store(LoginRequest $request): Response
    // {
    //     $request->authenticate();

    //     $request->session()->regenerate();

    //     return response()->noContent();
    // }
   

    // public function store(LoginRequest $request)
    // {
    //     $request->authenticate();
    
    //     // Lấy và xóa URL trước đó từ session (nếu có)
    //     $redirectUrl = session()->pull('redirect_url');
    
    //     // Đảm bảo session được tạo mới để tránh tấn công phiên
    //     $request->session()->regenerate();
    
    //     // Nếu có URL trước đó
    //     if ($redirectUrl) {
    //         // Phân tích URL để lấy các phần
    //         $urlParts = parse_url($redirectUrl);
        
    //         // Trích xuất id từ phần đường dẫn (path) của URL
    //         $pathParts = explode('/', $urlParts['path']);
    //         $urlId = isset($pathParts[2]) ? $pathParts[2] : null;
    
    //         // Lấy id của người đăng nhập
    //         $loggedInUserId = Auth::id();
    //     //      // Kiểm tra nếu urlId không tồn tại hoặc bằng null
    //     // if (!$urlId) {}
    //         // Kiểm tra nếu url_id bằng logged_in_user_id
    //         if ($urlId == $loggedInUserId) {
    //             // Nếu bằng, chuyển hướng người dùng đến URL đã chỉnh sửa hoặc URL ban đầu nếu không có sự thay đổi
    //             return redirect()->intended($redirectUrl ?? '/');
    //         } elseif (strpos($redirectUrl, 'localhost:3000') !== false) {
    //             // Nếu url_id không bằng logged_in_user_id và URL chứa localhost:3000
    //             // Thay thế localhost:3000 thành localhost:8000
    //             $redirectUrl = str_replace('localhost:3000', 'localhost:8000', $redirectUrl);
    //             // Chuyển hướng người dùng đến URL đã chỉnh sửa
    //             return redirect()->intended($redirectUrl);
    //         }
    //     }
    
    //     // Nếu không có URL trước đó hoặc không thoả mãn các điều kiện trên, trả về noContent()
    //     return response()->noContent();
    // }
    public function store(LoginRequest $request)
    {
        $request->authenticate();
    
        // Lấy và xóa URL trước đó từ session (nếu có)
        $redirectUrl = session()->pull('redirect_url');
    
        // Đảm bảo session được tạo mới để tránh tấn công phiên
        $request->session()->regenerate();
    
        // Nếu có URL trước đó
        if ($redirectUrl) {
            // Chuyển hướng người dùng đến URL đã chỉnh sửa hoặc URL ban đầu nếu không có sự thay đổi
            return redirect()->to($redirectUrl);
        }
    
        // Nếu không có URL trước đó hoặc không thoả mãn các điều kiện trên, trả về noContent()
        return response()->noContent();
    }
    
    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
