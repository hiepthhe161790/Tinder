import useSWR from 'swr'
import axios from '../lib/axios'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
// export const userMessenger = ({ middleware, redirectIfAuthenticated,id } = {}) => {
//     hoặc const { id } = useParams(); // Lấy userId từ URL
export const userMessenger = ({ middleware, redirectIfAuthenticated, id: propId } = {}) => {
    const { id: paramsId } = useParams(); // Lấy userId từ URL

    const id = propId || paramsId; // Sử dụng id từ tham số hoặc từ URL params

    const { data: responseData, error, mutate } = useSWR(`/messages/${id}`, () =>
        axios
            .get(`/messages/${id}`)
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error;
            }),
    );  
    // Trích xuất dữ liệu từ responseData
    const conversation = responseData?.conversation;
    const loggedInUser = responseData?.loggedInUser;
    const matchedUser = responseData?.matchedUser;
    const match = responseData?.match;
    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const sendMessage = async ({ setErrors, setStatus, ...props }) => {
        await csrf();
        setErrors([]);
        setStatus(null);

        axios.post('/messages/send', props)
            .then(response => {
                console.log(response);
                setStatus(response.data.status);
            })
            .catch(error => {
                if (error.response.status !== 422) throw error;

                setErrors(error.response.data.errors);
            });
    };
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
    return {
        conversation,
        matchedUser,
        loggedInUser,
        match,
        error,
        mutate,
        sendMessage,
        deleteMatch,
    };
};