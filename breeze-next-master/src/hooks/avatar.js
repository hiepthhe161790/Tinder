import useSWR from 'swr'
import axios from '../lib/axios'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
export const userAvatar = ({ middleware, redirectIfAuthenticated, id: propId } = {}) => {
    const { id: paramsId } = useParams(); // Lấy userId từ URL

    const id = propId || paramsId; // Sử dụng id từ tham số hoặc từ URL params
    const { data: first_image_path, error, mutate } = useSWR(`user/${id}/first-image`, () =>
        axios
            .get(`user/${id}/first-image`)
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error;
            }),
    );  


    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const deleteMatch = async ({id, setErrors, setStatus }) => {
        await csrf();
      
        try {
          const response = await axios.delete(`/matches/${id}`);
          if (response.data.status === 'success') {
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
    //   useEffect(() => {
      
    // }, [first_image_path, error])
    return {
        first_image_path,
        error,
        mutate,
        deleteMatch

    };
};