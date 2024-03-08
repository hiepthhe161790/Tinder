import useSWR from 'swr'
import axios from '../lib/axios'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'

// export const userInfo = ({ middleware, redirectIfAuthenticated, id} = {}) => {
  export const userInfo = ({ middleware, redirectIfAuthenticated, id: propId } = {}) => {
    const { id: paramsId } = useParams(); // Lấy userId từ URL

    const id = propId || paramsId;
    const { data: user, error, mutate } = useSWR(`/users/${id}`, () =>
        axios
            .get(`/users/${id}`)
            .then(res => res.data.user)
            .catch(error => {
                if (error.response.status !== 409) throw error;
            }),
    );  
  

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    

    return {
        user,
        error,
        mutate,
 
    };
};