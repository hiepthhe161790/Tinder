<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Likes;
use App\Models\Matches;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
class LikeController extends Controller
{
    public function showLikes(): JsonResponse
    {
        // Xử lý logic để hiển thị tất cả các like
        $likes = Likes::all();

        // Trả về một phản hồi JSON
        return response()->json(['likes' => $likes]);
    }

    public function indexComment(): JsonResponse
    {
        // // Lấy danh sách tất cả người dùng
        // $users = User::all();

        // // Trả về một phản hồi JSON
        // return response()->json(['users' => $users]);
        // Lấy danh sách tất cả người dùng kèm thông tin profile

    // $users = User::with('profile')->get();

    // // Trả về một phản hồi JSON
    // return response()->json(['users' => $users]);
       // Lấy danh sách tất cả người dùng kèm thông tin profile
    //    $users = User::where('id', '!=', auth()->id())->with('profile')->get();
       $currentUserId = auth()->id();

    // Lấy danh sách các người dùng đã được like bởi người dùng hiện tại
    $likedUserIds = Likes::where('user_id', $currentUserId)->pluck('liked_user_id')->toArray();

    // Lấy danh sách các người dùng chưa được like bởi người đang đăng nhập
    $users = User::whereNotIn('id', $likedUserIds)
        ->where('id', '!=', $currentUserId)
        ->with('profile')
        ->get();

    // Trả về một phản hồi JSON
    return response()->json(['users' => $users]);
    }
    public function index(): JsonResponse
{
    $currentUserId = auth()->id();
    
    // Lấy danh sách các người dùng đã được like bởi người dùng hiện tại
    $likedUserIds = Likes::where('user_id', $currentUserId)->pluck('liked_user_id')->toArray();
    
    // Lấy danh sách các người dùng đã match với người đang đăng nhập
    $matchedUserIds = Matches::where('user1_id', $currentUserId)->pluck('user2_id')->toArray();
    $matchedUserIds = array_merge($matchedUserIds, Matches::where('user2_id', $currentUserId)->pluck('user1_id')->toArray());

    // Lấy danh sách các người dùng chưa được like và không có match bởi người đang đăng nhập và có thông tin profile
    $users = User::whereNotIn('id', $likedUserIds)
        ->whereNotIn('id', $matchedUserIds)
        ->where('id', '!=', $currentUserId)
        ->has('profile')
        ->with('profile')
        ->get();

    // Trả về một phản hồi JSON
    return response()->json(['users' => $users]);
}
    public function show(string $id): JsonResponse
    {
        // Tìm người dùng với ID đã cho
        $user = User::find($id);

        // Kiểm tra nếu không tìm thấy người dùng
        if (!$user) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        // Tìm người dùng của người dùng
        $profile = Profile::where('user_id', $user->id)->first();

        // Kiểm tra nếu không tìm thấy người dùng
        if (!$profile) {
            return response()->json(['error' => 'profile not found for the user.'], 404);
        }

        // Tìm thông tin của người dùng
       

        // Gắn thêm thông tin về người dùng và thông tin cho người dùng
        $user->profile = $profile;
     

        // Trả về một phản hồi JSON
        return response()->json(['user' => $user]);
    }

    public function createLike(Request $request): JsonResponse
{
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (auth()->check()) {
        // Lấy user_id của người dùng đã đăng nhập
        $userId = auth()->id();
        $likedUserId = $request->input('liked_user_id');

        // Kiểm tra xem người dùng đang like chính mình không
        if ($userId == $likedUserId) {
            return response()->json(['error' => 'You cannot like yourself.'], 400);
        }

        // Kiểm tra xem đã có một like từ người dùng khác và đảo ngược không
        $existingLike = Likes::where('user_id', $likedUserId)
            ->where('liked_user_id', $userId)
            ->exists();

        // Kiểm tra xem đã có một like từ người dùng hiện tại cho người dùng khác không
        $alreadyLiked = Likes::where('user_id', $userId)
            ->where('liked_user_id', $likedUserId)
            ->exists();

        if ($existingLike && !$alreadyLiked) {
            // Tạo match
            Matches::create([
                'user1_id' => $userId,
                'user2_id' => $likedUserId,
            ]);

            // Trả về một phản hồi JSON cho trang match
            return response()->json(['status' => 'Match-created-successfully']);
        }

        // Nếu không có match, chỉ tạo like
        if (!$alreadyLiked) {
            Likes::create([
                'user_id' => $userId,
                'liked_user_id' => $likedUserId,
            ]);

            // Trả về một phản hồi JSON cho trang like
            return response()->json(['status' => 'Like-created-successfully']);
        }

        // Nếu đã có like từ trước
        return response()->json(['message' => 'You have already liked this user.']);
    } else {
        // Xử lý trường hợp người dùng chưa đăng nhập
        // Có thể chuyển hướng họ đến trang đăng nhập hoặc xử lý theo cách khác
        return response()->json(['error' => 'Please login to create a like.'], 401);
    }
}
}