<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\Message;
use App\Models\Matches;
use App\Models\User;
use App\Events\ChatMessage;

class MessageController extends Controller
{
    // public function showMatches(Request $request): JsonResponse
    // {
    //     $loggedInUserId = Auth::id();

    //     $matches = Matches::where('user1_id', $loggedInUserId)
    //         ->orWhere('user2_id', $loggedInUserId)
    //         ->get();

    //     $matchedUserIds = $matches->pluck('user1_id')->merge($matches->pluck('user2_id'))->unique();

    //     $matchedUsers = User::whereIn('id', $matchedUserIds)->get();

    //     return response()->json(['matchedUsers' => $matchedUsers]);
    // }
    public function showMatches(Request $request): JsonResponse 
    {
        $loggedInUserId = Auth::id();

    // Lấy danh sách các người dùng mà người dùng đang đăng nhập đã match với
    $matches = Matches::where('user1_id', $loggedInUserId)
        ->orWhere('user2_id', $loggedInUserId)
        ->get();

    $matchedUserIds = $matches->pluck('user1_id')->merge($matches->pluck('user2_id'))->unique();

    // Lấy danh sách các tin nhắn đã gửi hoặc nhận bởi người dùng đang đăng nhập
    $messages = Message::where('sender_id', $loggedInUserId)
        ->orWhere('receiver_id', $loggedInUserId)
        ->get();

    // Tạo một mảng chứa id của các người dùng có tin nhắn
    $usersWithMessages = [];
    foreach ($messages as $message) {
        if ($message->sender_id !== $loggedInUserId) {
            $usersWithMessages[] = $message->sender_id;
        }
        if ($message->receiver_id !== $loggedInUserId) {
            $usersWithMessages[] = $message->receiver_id;
        }
    }

    // Lọc ra các người dùng đã match nhưng không có tin nhắn
    $matchedUsers = User::whereIn('id', $matchedUserIds)
    ->whereNotIn('id', $usersWithMessages)
    ->where('id', '!=', $loggedInUserId) // Loại bỏ người dùng đang đăng nhập khỏi kết quả
    ->get();

    return response()->json(['matchedUsers' => $matchedUsers]);
    }

    
    public function showConversation(Request $request, $userId): JsonResponse
    {
        $loggedInUser = Auth::user();
    
        $matchedUser = User::findOrFail($userId);
    
        // Xác định match giữa người dùng đăng nhập và người dùng phù hợp
        $match = Matches::where(function ($query) use ($loggedInUser, $matchedUser) {
            $query->where('user1_id', $loggedInUser->id)->where('user2_id', $matchedUser->id);
        })->orWhere(function ($query) use ($loggedInUser, $matchedUser) {
            $query->where('user1_id', $matchedUser->id)->where('user2_id', $loggedInUser->id);
        })->first();
    
        // Lấy cuộc trò chuyện giữa hai người dùng
        $conversation = Message::where(function ($query) use ($loggedInUser, $matchedUser) {
            $query->where('sender_id', $loggedInUser->id)->where('receiver_id', $matchedUser->id);
        })->orWhere(function ($query) use ($loggedInUser, $matchedUser) {
            $query->where('sender_id', $matchedUser->id)->where('receiver_id', $loggedInUser->id);
        })->orderBy('created_at', 'asc')->get();
    
        return response()->json([
            'loggedInUser' => $loggedInUser,
            'matchedUser' => $matchedUser,
            'match' => $match, // Thêm thông tin về match vào phản hồi JSON
            'conversation' => $conversation
        ]);
    }

//     public function sendMessage(Request $request): JsonResponse
// {
//     $request->validate([
//         'receiver_id' => 'required|exists:users,id',
//         'content' => 'required|string',
//     ]);

//     $loggedInUser = Auth::user();

//     $match = Matches::where(function ($query) use ($loggedInUser, $request) {
//         $query->where('user1_id', $loggedInUser->id)->where('user2_id', $request->receiver_id);
//     })->orWhere(function ($query) use ($loggedInUser, $request) {
//         $query->where('user1_id', $request->receiver_id)->where('user2_id', $loggedInUser->id);
//     })->first();

//     if (!$match) {
//         return response()->json(['status' => 'error']);
//     }

//     Message::create([
//         'match_id' => $match->id, // Thêm match_id vào dữ liệu tạo
//         'sender_id' => $loggedInUser->id,
//         'receiver_id' => $request->receiver_id,
//         'content' => $request->content,
//     ]);
//     event(new ChatMessage($message->match_id, $message->sender_id, $message->receiver_id, $message->content));
//     return response()->json(['status' => 'success']);
// }

public function sendMessage(Request $request): JsonResponse
{
    $request->validate([
        'receiver_id' => 'required|exists:users,id',
        'content' => 'required|string',
    ]);

    $loggedInUser = Auth::user();

    $match = Matches::where(function ($query) use ($loggedInUser, $request) {
        $query->where('user1_id', $loggedInUser->id)->where('user2_id', $request->receiver_id);
    })->orWhere(function ($query) use ($loggedInUser, $request) {
        $query->where('user1_id', $request->receiver_id)->where('user2_id', $loggedInUser->id);
    })->first();

    if (!$match) {
        return response()->json(['status' => 'error']);
    }

    $message = Message::create([
        'match_id' => $match->id,
        'sender_id' => $loggedInUser->id,
        'receiver_id' => $request->receiver_id,
        'content' => $request->content,
    ]);

    // Sử dụng biến $message sau khi tạo tin nhắn thành công
    event(new ChatMessage($message->match_id, $message->sender_id, $message->receiver_id, $message->content));

    return response()->json(['status' => 'success']);
}


    public function showRecentMessages(Request $request): JsonResponse
{
    $loggedInUserId = Auth::id();

    // Lấy tất cả các tin nhắn được gửi hoặc nhận bởi người dùng đang đăng nhập
    $messages = Message::where('sender_id', $loggedInUserId)
        ->orWhere('receiver_id', $loggedInUserId)
        ->orderBy('created_at', 'desc')
        ->get();

    // Tạo một mảng để lưu trữ thông tin về người dùng đã trò chuyện và tin nhắn cuối cùng với họ
    $recentMessages = [];

    foreach ($messages as $message) {
        // Xác định id của người dùng đã trò chuyện với người dùng hiện tại
        $otherUserId = ($message->sender_id === $loggedInUserId) ? $message->receiver_id : $message->sender_id;

        // Kiểm tra xem người dùng này đã được thêm vào mảng chưa
        if (!isset($recentMessages[$otherUserId])) {
            // Lấy thông tin của người dùng đã trò chuyện
            $otherUser = User::find($otherUserId);

            // Lấy tin nhắn cuối cùng giữa người dùng hiện tại và người dùng đã trò chuyện
            $lastMessage = $message;

            // Thêm thông tin người dùng và tin nhắn cuối cùng vào mảng
            $recentMessages[$otherUserId] = [
                'user' => $otherUser,
                'last_message' => $lastMessage,
            ];
        }
    }
 // Sắp xếp mảng $recentMessages theo thứ tự tin nhắn mới nhất lên đầu
 usort($recentMessages, function ($a, $b) {
    return $b['last_message']->created_at <=> $a['last_message']->created_at;
});
    return response()->json(['recentMessages' => $recentMessages]);
}
public function deleteMatch(Request $request, $userId): JsonResponse
{
    $loggedInUser = Auth::user();
    $matchedUser = User::findOrFail($userId);

    // Tìm và xóa match giữa hai người dùng
    Matches::where(function ($query) use ($loggedInUser, $matchedUser) {
        $query->where('user1_id', $loggedInUser->id)->where('user2_id', $matchedUser->id);
    })->orWhere(function ($query) use ($loggedInUser, $matchedUser) {
        $query->where('user1_id', $matchedUser->id)->where('user2_id', $loggedInUser->id);
    })->delete();

    // Xóa tất cả các tin nhắn giữa hai người dùng
    Message::where(function ($query) use ($loggedInUser, $matchedUser) {
        $query->where('sender_id', $loggedInUser->id)->where('receiver_id', $matchedUser->id);
    })->orWhere(function ($query) use ($loggedInUser, $matchedUser) {
        $query->where('sender_id', $matchedUser->id)->where('receiver_id', $loggedInUser->id);
    })->delete();

    return response()->json(['status' => 'success']);
}
}
