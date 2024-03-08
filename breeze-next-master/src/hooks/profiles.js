import useSWR from 'swr';
import axios from '../lib/axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'

export const userProfiles = ( middleware, redirectIfAuthenticated ) => {
  const router = useRouter();

  // const fetchUserProfile = async () => {
  //   try {
  //     const response = await axios.get('/profiles');
  //     return response.data.profile;
  //   } catch (error) {
  //     console.error('Lỗi khi lấy thông tin hồ sơ người dùng:', error);
  //     throw error;
  //   }
  // };

  const { data: profile, error, mutate } = useSWR('/profiles', () =>
  axios
      .get('/profiles')
      .then(res => res.data.profile)
      .catch(error => {
          if (error.response.status !== 409) throw error

      }),
)


  const csrf = () => axios.get('/sanctum/csrf-cookie');


  const createProfiles = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    try {
      const response = await axios.post('/profiles', props);
      console.log(response);
      setStatus(response.data.status);
      // Gọi fetchUserProfile để cập nhật dữ liệu người dùng sau khi cập nhật hồ sơ
      await fetchUserProfile();
    } catch (error) {
      if (error.response.status !== 422) throw error;

      setErrors(error.response.data.errors);
    }
  };

  const updateProfiles = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    try {
      const response = await axios.put('/profiles', props);
      console.log(response);
      setStatus(response.data.status);
      // Gọi fetchUserProfile để cập nhật dữ liệu người dùng sau khi cập nhật hồ sơ
      await fetchUserProfile();
    } catch (error) {
      if (error.response.status !== 422) throw error;

      setErrors(error.response.data.errors);
    }
  };
  // const storeOrUpdateProfiles = async ({ setErrors, setStatus, ...props }) => {
  //   await csrf();

  //   setErrors([]);
  //   setStatus(null);

  //   try {
  //     const response = await axios.post('/store-or-update-profile', props);
  //     console.log(response);
  //     setStatus(response.data.status);
  //     // Gọi fetchUserProfile để cập nhật dữ liệu người dùng sau khi cập nhật hồ sơ
  //     await fetchUserProfile();
  //   } catch (error) {
  //     if (error.response.status !== 422) throw error;

  //     setErrors(error.response.data.errors);
  //   }
  // };

  const storeOrUpdateProfile = async ({ setErrors, setStatus, ...props }) => {
    await csrf()
    
    setErrors([])
    setStatus(null)
  
    axios
        .post('/store-or-update-profile', props)
        .then(response => {
            console.log(response)
            setStatus(response.data.status)})
        .catch(error => {
            if (error.response.status !== 422) throw error

            setErrors(error.response.data.errors)
        })
}

const addImageProfile = async ({ setErrors, setStatus, ...props }) => {
  await csrf()
  
  setErrors([])
  setStatus(null)

  axios
      .post('/addImageProfile', props)
      .then(response => {
          console.log(response)
          setStatus(response.data.status)})
      .catch(error => {
          if (error.response.status !== 422) throw error

          setErrors(error.response.data.errors)
      })
}

// const { data: getFirstNameAndFirstImage }  = async () => {
//   try {
//     const response = await axios.get('/first-name-and-image');
//     console.log(response.data);
//     return response.data;
//   } catch (error) {
//     if (error.response.status !== 409) throw error
//   }
// };
const { data: getFirstNameAndFirstImage, errors} = useSWR('/first-name-and-image', () =>
        axios
            .get('/first-name-and-image')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error
            }),
    )
    const updateImageProfile = async ({ id, index, new_image, setErrors, setStatus }) => {
      await csrf();
    
      try {
        const response = await axios.put(`/profiles/${id}/images/${index}`, { new_image });
        if (response.data.status === 'image-profile-updated') {
          mutate(); // Refresh profile data
          setStatus(response.data.status);
        }
      } catch (error) {
        if (error.response && error.response.status !== 422) {
          throw error;
        }
        setErrors(error.response.data.errors);
      }
    };
    
    const deleteImageProfile = async ({ id, index, setErrors, setStatus }) => {
      await csrf();
    
      try {
        const response = await axios.delete(`/profiles/${id}/images/${index}`);
        if (response.data.status === 'image-profile-deleted') {
          mutate(); // Refresh profile data
          setStatus(response.data.status);
        }
      } catch (error) {
        if (error.response && error.response.status !== 422) {
          throw error;
        }
        setErrors(error.response.data.errors);
      }
    };
useEffect(() => {
        if (!profile && error) {
            router.push('/setting-profile');
        }
    }, [profile, error]);


  return {
    profile,
    error,
    mutate,
    createProfiles,
    updateProfiles,
    // fetchUserProfile,
    storeOrUpdateProfile,
    addImageProfile,
    getFirstNameAndFirstImage,
    errors,
    deleteImageProfile,
    updateImageProfile,
  };
};
