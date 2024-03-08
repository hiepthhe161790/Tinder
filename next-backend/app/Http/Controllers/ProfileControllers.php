<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
class ProfileControllers extends Controller
{
    /**
     * Display the user's profile information.
     */
    public function show(): JsonResponse
{
    // Sử dụng auth()->id() để lấy id của người dùng hiện tại
    $userId = auth()->id();

    // Tìm thông tin profile dựa trên id của người dùng
    $profile = Profile::where('user_id', $userId)->first();

    if (!$profile) {
        return response()->json(['error' => 'Profile not found'], 404);
    }

    // Trả về đối tượng Profile dưới dạng JSON
    return response()->json(['profile' => $profile]);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        if (auth()->check()) {
            $user = auth()->user();
            // dd(public_path('images'));

            $request->validate([
                'image_path.*' => 'required|mimes:jpg,png,jpeg|max:5048',
                'age' => 'required|integer|min:0|max:150',
                'gender' => 'required|boolean',
                'location' => 'required|max:100',
                'interests' => 'nullable|string',
            ]);
    
            $generatedImagePaths = [];
            foreach ($request->file('image_path') as $image) {
                $generatedImageName = 'image_path_' . uniqid() . '.' . $image->extension();
                $image->move(public_path('images'), $generatedImageName);
                $generatedImagePaths[] = $generatedImageName;
            }
    
            $profile = new Profile([
                'user_id' => $user->id,
                'image_path' => implode(',', $generatedImagePaths),
                'age' => $request->input('age'),
                'gender' => $request->input('gender'),
                'location' => $request->input('location'),
                'interests' => $request->input('interests'),
            ]);
    
            $profile->save();
    
            return response()->json(['status' => 'profile-stored']);
        } else {
            // Handle the case where the user is not logged in
            // You can redirect them to the login page or handle it differently
            return response()->json(['status' => 'error', 'message' => 'Please log in to create a new profile.']);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    
     public function update(Request $request): JsonResponse
     {
         if (auth()->check()) {
             $user = auth()->user();
     
             $request->validate([
                 'image_path.*' => 'nullable|mimes:jpg,png,jpeg|max:5048',
                 'age' => 'required|integer|min:0|max:150',
                 'gender' => 'required|boolean',
                 'location' => 'required|max:100',
                 'interests' => 'nullable|string',
             ]);
     
             // Lấy thông tin hồ sơ cần cập nhật
             $profile = $user->profile;
     
             // Kiểm tra xem người dùng có hình ảnh mới không
             if ($request->hasFile('image_path')) {
                 $generatedImagePaths = [];
                 foreach ($request->file('image_path') as $image) {
                     $generatedImageName = 'image_path_' . uniqid() . '.' . $image->extension();
                     $image->move(public_path('images'), $generatedImageName);
                     $generatedImagePaths[] = $generatedImageName;
                 }
                 $profile->image_path = implode(',', $generatedImagePaths);
             }
     
             // Cập nhật thông tin hồ sơ
             $profile->age = $request->input('age');
             $profile->gender = $request->input('gender');
             $profile->location = $request->input('location');
             $profile->interests = $request->input('interests');
     
             // Lưu cập nhật vào cơ sở dữ liệu
             $profile->save();
     
             return response()->json(['status' => 'profile-updated']);
         } else {
             return response()->json(['status' => 'error', 'message' => 'Please log in to update your profile.']);
         }
     }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
    public function storeOrUpdateProfile(Request $request): JsonResponse
    {
        if (auth()->check()) {
            $user = auth()->user();
    
            $request->validate([
                'image_paths' => 'required',
                'age' => 'required|integer|min:0|max:150',
                'gender' => 'required|boolean',
                'location' => 'required|max:100',
                'interests' => 'nullable|string',
            ]);
            // Lấy danh sách các đường dẫn ảnh cũ của người dùng
            // Lấy danh sách các hình ảnh cũ liên quan đến người dùng hiện tại
        $oldImages = Profile::where('user_id', $user->id)->pluck('image_path')->toArray();

            $imagePaths = [];
            foreach ($request->input('image_paths') as $base64Image) {
                $mime = explode(';', $base64Image)[0];
            $extension = explode('/', $mime)[1];
               
                $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Image));
    
                $imageName = uniqid() . '.' . $extension;
    
                // Lưu hình ảnh vào thư mục public/images
                $imagePath = 'images/' . $imageName;
                $publicPath = public_path($imagePath);
                file_put_contents($publicPath, $imageData);
                // Lưu hình ảnh vào thư mục storage/app/public/images
            // $imagePath = 'public/images/' . $imageName;
            // $storagePath = storage_path('app/' . $imagePath);
            // file_put_contents($storagePath, $imageData);
    
                $imagePaths[] = $imagePath;
            }
             // Kiểm tra số lượng ảnh cập nhật có lớn hơn 9 không
             if (count($imagePaths) > 9) {
               return response()->json(['status' => 'error-maximum']);
            }
              // Xóa các hình ảnh cũ sau khi cập nhật thành công (nếu có)
            if (!empty($oldImages)) {
               foreach ($oldImages as $oldImagePath) {
                $oldImagePath = public_path($oldImagePath);
            if (file_exists($oldImagePath)) {
                 unlink($oldImagePath);
                 }
               }
            }

            $profileData = [
                'user_id' => $user->id,
                'image_path' => implode(',', $imagePaths), // Sử dụng implode để ngăn cách các đường dẫn ảnh bằng dấu phẩy
                'age' => $request->input('age'),
                'gender' => $request->input('gender'),
                'location' => $request->input('location'),
                'interests' => $request->input('interests'),
            ];
    
            $profile = Profile::updateOrCreate(['user_id' => $user->id], $profileData);
    
            return response()->json(['status' => 'profile-stored']);
        } else {
            return response()->json(['status' => 'error-login']);
        }
    }
    


public function storeOrUpdateProfiles(Request $request): JsonResponse
    {
        if (auth()->check()) {
            $user = auth()->user();
    
            $request->validate([
                'age' => 'required|integer|min:0|max:150',
                'gender' => 'required|boolean',
                'location' => 'required|max:100',
                'interests' => 'nullable|string',
            ]);
    
            // Kiểm tra xem có file hình ảnh được gửi đi không
            if ($request->hasFile('image_path')) {
                // Xử lý các hình ảnh được gửi đi
                $generatedImagePaths = [];
                
                foreach ($request->file('image_path') as $image) {
                    // Xử lý mỗi phần tử trong mảng
                    $generatedImageName = 'image_path_' . uniqid() . '.' . $image->extension();
                    $image->move(public_path('images'), $generatedImageName);
                    $generatedImagePaths[] = $generatedImageName;
                }
    
                $imagePathValue = implode(',', $generatedImagePaths);
            } else {
                // Nếu không có file hình ảnh nào được gửi đi, đặt giá trị image_path thành một mảng rỗng
                $imagePathValue = '';
            }
    
            $profileData = [
                'user_id' => $user->id,
                'image_path' => $imagePathValue,
                'age' => $request->input('age'),
                'gender' => $request->input('gender'),
                'location' => $request->input('location'),
                'interests' => $request->input('interests'),
            ];
    
            $profile = Profile::updateOrCreate(['user_id' => $user->id], $profileData);
    
            return response()->json(['status' => 'profile-stored']);
        } else {
            return response()->json(['auth' => 'error-login']);
        }
    }
    public function getFirstNameAndFirstImage(): JsonResponse
{
    if (auth()->check()) {
        $userId = auth()->id();
        
        // Lấy thông tin của người dùng hiện tại kèm theo thông tin hồ sơ
        $user = User::where('id', $userId)->with('profile')->first();

        if (!$user) {
            return response()->json(['status' => 'User-not-found']);
        }

        // // Kiểm tra xem người dùng có hồ sơ không
        // if (!$user->profile) {
        //     return response()->json(['errors' => 'Profile not found for this user'], 404);
        // }

        // Lấy tên và đường dẫn ảnh đầu tiên từ hồ sơ của người dùng
        $fullName = $user->name; // Đảm bảo 'name' là tên trường thực tế trong bảng User
        $firstName = explode(' ', $fullName); // Tách tên thành mảng các từ
        $lastName = end($firstName); // Lấy phần tử cuối cùng của mảng

        $imagePaths = explode(',', $user->profile->image_path); // Đảm bảo 'image_path' là tên trường thực tế trong bảng Profile
        $firstImagePath = isset($imagePaths[0]) ? $imagePaths[0] : null;
        $avatar = [
            'last_name' => $lastName,
            'first_image_path' => $firstImagePath
        ];
        
        return response()->json([
            'last_name' => $lastName, // Trả về phần tên cuối cùng
            'first_image_path' => $firstImagePath
        ]);
    } else {
        return response()->json(['status' => 'error-login']);
    }
}

public function addImageProfile(Request $request): JsonResponse
{
    if (auth()->check()) {
        $user = auth()->user();

        // $request->validate([
        //     'image_paths.*' => 'required|base64|mimes:jpeg,jpg,png|max:5048',
        // ]);

        $profile = Profile::firstOrNew(['user_id' => $user->id]);

        $imagePaths = explode(',', $profile->image_path ?: ''); // Lấy các đường dẫn ảnh đã có, nếu không có thì gán là một chuỗi rỗng

        // Kiểm tra số lượng ảnh đã có và số lượng ảnh được thêm vào không vượt quá 9
        if (count($imagePaths) + count($request->input('image_paths')) > 9) {
            return response()->json(['status' => 'error-maximum']);
        }

        foreach ($request->input('image_paths') as $base64Image) {
            $mime = explode(';', $base64Image)[0];
            $extension = explode('/', $mime)[1];

            $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Image));

            $imageName = uniqid() . '.' . $extension;

            // Lưu hình ảnh vào thư mục public/images
            $imagePath = 'images/' . $imageName;
            $publicPath = public_path($imagePath);
            file_put_contents($publicPath, $imageData);

            // Kiểm tra độ dài của đường dẫn ảnh trước khi thêm vào mảng
            if (strlen($imagePath) > 255) {
                return response()->json(['status' => 'error', 'message' => 'Image path exceeds maximum length.']);
            }
            $imagePaths[] = $imagePath;
        }

        // Kiểm tra số lượng dấu phẩy trong cơ sở dữ liệu không vượt quá 8
        if (substr_count($profile->image_path, ',') + count($request->input('image_paths')) > 8) {
            return response()->json(['status' => 'error', 'message' => 'Total number of commas exceeds the limit of 8.']);
        }

        $profile->user_id = $user->id;
        $profile->image_path = implode(',', $imagePaths);
        $profile->save();

        return response()->json(['status' => 'image-profile-added']);
    } else {
        return response()->json(['status' => 'error', 'message' => 'Please log in to add an image profile.']);
    }
}
public function updateImageProfile(Request $request, $id, $index): JsonResponse
{
    // Lấy thông tin hồ sơ
    $profile = Profile::findOrFail($id);

    // Lấy đường dẫn ảnh cần sửa
    $images = explode(',', $profile->image_path);
    $oldImagePath = $images[$index];

    // Validate request
    $request->validate([
        'new_image' => 'required',
    ]);

    // Decode base64 và lưu ảnh mới
    $base64Image = $request->input('new_image');
    $mime = explode(';', $base64Image)[0];
    $extension = explode('/', $mime)[1];
    $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Image));
    $newImagePath = 'images/' . uniqid() . '.' . $extension;
    // $newImagePath = 'images/65c32b4ca9d0e.jpeg';
    file_put_contents(public_path($newImagePath), $imageData);

    // Xóa ảnh cũ từ thư mục public/images
    if (File::exists(public_path($oldImagePath))) {
        File::delete(public_path($oldImagePath));
    }

    // Cập nhật đường dẫn ảnh trong cơ sở dữ liệu
    $images[$index] = $newImagePath;
    $profile->update(['image_path' => implode(',', $images)]);

    // Chuyển hướng về trang xem thông tin hồ sơ
    return response()->json(['status' => 'image-profile-updated']);
}
public function deleteImageProfile($id, $index): JsonResponse
{
    // Lấy thông tin hồ sơ
    $profile = Profile::findOrFail($id);

    // Lấy đường dẫn ảnh cần xóa
    $images = explode(',', $profile->image_path);
    $imagePath = $images[$index];

    // Xóa ảnh từ thư mục public/images
    if (File::exists(public_path($imagePath))) {
        File::delete(public_path($imagePath));
    }

    // Xóa đường dẫn ảnh khỏi mảng
    unset($images[$index]);

    // Cập nhật lại trường image_path trong cơ sở dữ liệu
    $profile->update(['image_path' => implode(',', $images)]);

    // Chuyển hướng về trang xem thông tin hồ sơ
    return response()->json(['status' => 'image-profile-deleted']);
}
public function getFirstImagePathForUser(int $userId): JsonResponse
{
    $user = User::find($userId);

    if (!$user) {
        return response()->json(['status' => 'User not found'], 404);
    }

    // Kiểm tra xem người dùng có hồ sơ không
    if (!$user->profile) {
        return response()->json(['status' => 'Profile not found for this user'], 404);
    }

    $imagePaths = explode(',', $user->profile->image_path);
    $firstImagePath = isset($imagePaths[0]) ? $imagePaths[0] : null;

    return response()->json(['first_image_path' => $firstImagePath]);
}
}
