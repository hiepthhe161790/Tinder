// Import dependencies with correct paths
'use client';
import { userProfiles } from '../../../src/hooks/profiles';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import AuthSessionStatus from '../../app/(auth)/AuthSessionStatus';
import InputError from '../../components/InputError';
import "./global.css"
import  Status  from '../../../src/components/AAstore';
import { Avatar, Box, DialogActions, DialogContent, DialogContentText, IconButton, TextField } from '@mui/material';
import CropEasy from '../../components/crop/CropEasy';
import { Crop } from '@mui/icons-material';

const Profiles = () => {
  const router = useRouter();

  const { profile, error, mutate, storeOrUpdateProfile, addImageProfile, updateImageProfile, deleteImageProfile } = userProfiles({
    middleware: 'auth',
    redirectIfAuthenticated: '/setting-profile',
  });

  const [imagePaths, setImagePaths] = useState([]);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('1');
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [showProfileImages, setShowProfileImages] = useState(true); // State để kiểm soát việc hiển thị các ảnh trong profile
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  useEffect(() => {
    if (profile) {
      setImagePaths(profile.image_paths || []);
      setAge(profile.age || '');
      setGender(profile.gender || '1');
      setLocation(profile.location || '');
      setInterests(profile.interests || '');
    }
  }, [profile]);
  useEffect(() => {
    // Cập nhật dữ liệu tin nhắn sau khi gửi tin nhắn thành công
    if (status === 'image-profile-added' || status === 'profile-stored') {
        mutate();
    }
}, [status]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    await storeOrUpdateProfile({
      image_paths: imagePaths,
      age,
      gender,
      location,
      interests,
      setErrors,
      setStatus,
    });
  };
  const handleAddImageProfile = async (event) => {
    event.preventDefault();
    await addImageProfile({
    //    // Chuyển đổi chuỗi base64 thành một đường dẫn hình ảnh
    // const imagePath = croppedImageData;
    // // Tạo một mảng chứa đường dẫn hình ảnh
    // const imagePaths = [imagePath];
      image_paths: imagePaths,
      setErrors,
      setStatus,
    });
  };
  const handleFileChanges = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const imageFiles = Array.from(selectedFiles).filter(file => file.type.startsWith('image/'));
      // const fileArray = imageFiles.map((file) => {
        const fileArray = imageFiles.slice(0, 10).map((file) => { // Chỉ lấy tối đa 10 file
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            resolve(event.target.result);
          };
          reader.onerror = (error) => {
            reject(error);
          };
        });
      });

      Promise.all(fileArray).then((base64Images) => {
        // setImagePaths(prevPaths => [...prevPaths, ...base64Images]); // Thêm các đường dẫn hình ảnh mới vào mảng imagePaths
        setImagePaths(base64Images);
        // Ẩn phần hiển thị các ảnh đã có trong profile khi tải lên ảnh mới
        // setShowProfileImages(false);
      }).catch((error) => {
        console.error('Error reading files:', error);
      });
    }
  };
  const handleEditImage = async (index) => {
    setShowModal(false);
    try {
      await updateImageProfile({ id: profile.id, index, new_image: croppedImageData, setErrors, setStatus });
    } catch (error) {
      console.error('Error editing image:', error);
    }
  };

  const handleDeleteImage = async (index) => {
    setShowModal(false);
    try {
      await deleteImageProfile({ id: profile.id, index, new_image: imagePaths[index], setErrors, setStatus });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleEditButtonClick = (index) => {
    setShowModal(true);
    setModalAction('edit');
    setSelectedImageIndex(index);
  };

  const handleDeleteButtonClick = (index) => {
    setShowModal(true);
    setModalAction('delete');
    setSelectedImageIndex(index);
  };
  const handleBack = () => {
    router.back(); // Sử dụng router của Next.js để quay lại trang trước đó
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // Chỉ lấy file đầu tiên từ tập tin được chọn
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = (event) => {
        // Lưu base64 của file vào state imagePaths
        setImagePaths(event.target.result);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
    }
  };

  // console.log("base64 anh la:", imagePaths)
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [photoURL, setPhotoURL] = useState('');
  const [openCrop, setOpenCrop] = useState(false);
//   const [loading, setLoading] = useState(false);
const [croppedImageData, setCroppedImageData] = useState(null);
const handleChange = (e) => {
  const selectedFiles = e.target.files;
  if (selectedFiles) {
    const imageFiles = Array.from(selectedFiles).filter(file => file.type.startsWith('image/'));
    const fileArray = imageFiles.slice(0, 10).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          resolve(event.target.result); // Đọc tệp và giải mã base64
        };
        reader.onerror = (error) => {
          reject(error);
        };
      });
    });

    Promise.all(fileArray).then((base64Images) => {
      console.log('Base64 Images:', base64Images);
      setPhotoURL(base64Images); // Lưu trữ mảng dữ liệu Base64 của hình ảnh
    }).catch((error) => {
      console.error('Error reading files:', error);
    });
  }

  if (selectedFiles.length > 0) {
    setFile(selectedFiles[0]); // Lưu trữ tệp đầu tiên để hiển thị hình ảnh và mở cửa sổ cắt
    setOpenCrop(true);
  }
};

const handleCroppedImage = (croppedImage) => {
  console.log("Cropped Image Data o app:", croppedImage);
  setCroppedImageData(croppedImage);
};
  

  useEffect(() => {
    if (openCrop) {
      console.log('Open crop dialog');
    } else {
      console.log('Close crop dialog');
    }
  }, [openCrop]);
 
  return (
    <div className="profile-form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
        {!openCrop ? (
          <>
            <DialogContent dividers>
              <DialogContentText>
                You can update your profile by updating these fields:
              </DialogContentText>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <label htmlFor="profilePhoto">
                  <input
                    accept="image/*"
                    id="profilePhoto"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleChange}
                    multiple
                  />
                  <Avatar
                    src={photoURL}
                    sx={{ width: 75, height: 75, cursor: 'pointer' }}
                  />
                </label>
                {file && (
                  <IconButton
                    aria-label="Crop"
                    color="primary"
                    onClick={() => setOpenCrop(true)}
                  >
                    <Crop />
                  </IconButton>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <button type="submit">Save</button>
            </DialogActions>
          </>
        ) : (
          <CropEasy
            photoURL={photoURL}
            setOpenCrop={setOpenCrop}
            setPhotoURL={setPhotoURL}
            setFile={setFile}
            onCroppedImage={handleCroppedImage}
          />
        )}
          <label>
            Image Paths:
            <input type="file" name="image_paths" multiple accept=".jpg, .jpeg, .png, .gif" onChange={handleFileChanges} />
          </label>
          {showProfileImages && profile && profile.image_path && (
            <div className="image-preview-section">
              <p>Images:</p>
              {profile.image_path.split(',').map((image, index) => (
                <div key={index} className="image-container">
                  <img
                    src={`http://127.0.0.1:8000/${image}`}
                    alt={`Image ${index}`}
                    className="image-preview"
                  />
                    <InputError messages={errors.new_image} className="input-error" />
                  <div className="image-buttons">
                    {/* Sử dụng type="button" để ngăn form gửi dữ liệu khi click */}

                    <Button type="button" onClick={() => handleEditButtonClick(index)}>Edit</Button>
                    <Button type="button" onClick={() => handleDeleteButtonClick(index)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {Array.isArray(imagePaths) ? (
            imagePaths.map((imagePath, index) => (
              <img key={index} src={imagePath} alt={`Image ${index}`} className="image-preview" />
            ))
          ) : (
            <img src={imagePaths} alt="Uploaded Image" className="image-preview" />
          )}
          <InputError messages={errors.image_paths} className="input-error" />
        </div>
        <div className="form-section">
          <label>
            Age:
            <input type="number" name="age" value={age} onChange={(event) => setAge(event.target.value)} />
          </label>
          <InputError messages={errors.age} className="input-error" />
        </div>
        <div className="form-section">
          <label>
            Gender:
            <select name="gender" value={gender} onChange={(event) => setGender(event.target.value)}>
              <option value="1">Male</option>
              <option value="0">Female</option>
            </select>
          </label>
          <InputError messages={errors.gender} className="input-error" />
        </div>
        <div className="form-section">
          <label>
            Location:
            <input type="text" name="location" value={location} onChange={(event) => setLocation(event.target.value)} />
          </label>
          <InputError messages={errors.location} className="input-error" />
        </div>
        <div className="form-section">
          <label>
            Interests:
            <input type="text" name="interests" value={interests} onChange={(event) => setInterests(event.target.value)} />
          </label>
          <InputError messages={errors.interests} className="input-error" />
        </div>
        <Button type="button" onClick={handleSubmit}>Save Profile</Button>
        <Button type="button" onClick={handleAddImageProfile}>Add More Images</Button>
        <Button type="button" onClick={handleBack}>Back</Button>
        <Status status={status}/>
        {/* Modal */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleModalClose}>&times;</span>
              {modalAction === 'edit' && (
                <>
                  <label>Image Paths:</label>
                  <input type="file" name="image_paths" accept=".jpg, .jpeg, .png, .gif" onChange={handleFileChange} />
                  {Array.isArray(imagePaths) ? (
                    imagePaths.map((imagePath, index) => (
                      <img key={index} src={imagePath} alt={`Image ${index}`} className="image-preview" />
                    ))
                  ) : (
                    <img src={imagePaths} alt="Uploaded Image" className="image-preview" />
                  )}
                  <Button type="button" onClick={() => handleEditImage(selectedImageIndex)}>Save</Button>
                  <Button type="button" onClick={handleModalClose}>Cancel</Button>
                </>
              )}
              {modalAction === 'delete' && (
                <>
                  <p>Are you sure you want to delete this image?</p>
                  <Button type="button" onClick={() => handleDeleteImage(selectedImageIndex)}>Yes</Button>
                  <Button type="button" onClick={handleModalClose}>No</Button>
                </>
              )}
            </div>
          </div>
        )}
      </form>

    </div>
  );
};

export default Profiles;