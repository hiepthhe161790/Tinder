import React, { useState } from 'react';
import { Avatar, Box, DialogActions, DialogContent, DialogContentText, IconButton, TextField } from '@mui/material';
import CropEasy from '../crop/CropEasy';
import { Crop } from '@mui/icons-material';
import { useEffect } from 'react';
import axios from 'axios'; // Import axios library
import Profiles from '../../app/store-or-update-profile/page';
const CropImage = () => {
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
  console.log("Cropped Image Data o app profile:", croppedImageData);
  return !openCrop ? (
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
    <>
   
      {/* <CropEasy {...{ photoURL, setOpenCrop, setPhotoURL, setFile, setLoading }} /> */}
      <CropEasy
        photoURL={photoURL}
        setOpenCrop={setOpenCrop}
        setPhotoURL={setPhotoURL}
        setFile={setFile}
        onCroppedImage={handleCroppedImage}
      />
  <Profiles croppedImageData={file} />
    </>
  );
};

export default CropImage;
