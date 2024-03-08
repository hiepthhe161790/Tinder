import useSWR from 'swr'
import axios from '../lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const userProfile = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const params = useParams()
    const { data: user, error, mutate } = useSWR('/api/profile', () =>
    axios
        .get('/api/profile')
        .then(res => res.data.user)
        .catch(error => {
            if (error.response.status !== 409) throw error
        }),
)
const csrf = () => axios.get('/sanctum/csrf-cookie')
const updateProfile = async ({ setErrors, setStatus, ...props }) => {
    await csrf()

    setErrors([])
    setStatus(null)

    axios
        .put('/profile', props)
        .then(response => {
            console.log(response)
            setStatus(response.data.status)})
        .catch(error => {
            if (error.response.status !== 422) throw error

            setErrors(error.response.data.errors)
        })
}
const changePassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf()

    setErrors([])
    setStatus(null)

    axios
        .put('/password', props)
        .then(response => {
            console.log(response)
            setStatus(response.data.status)})
        .catch(error => {
            if (error.response.status !== 422) throw error

            setErrors(error.response.data.errors)
            console.log(error)
            
        })
}
const destroy = async ({ password, setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
        .delete('/profile', { data: { password, ...props } })
        .then(response => {
            setStatus(response.data.status);
                window.location.pathname = '/login';
        })
        .catch(error => {
            if (error.response.status !== 422) throw error;
            setErrors(error.response.data.errors);
        });
};


    return {
        user,error,mutate,updateProfile,changePassword,destroy,
    }
}