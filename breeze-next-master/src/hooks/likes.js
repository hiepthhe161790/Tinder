import useSWR from 'swr'
import axios from '../lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const userLikes = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const params = useParams()
    const { data: users, error, mutate } = useSWR('/users', () =>
    axios
        .get('/users')
        .then(res => res.data.users)
        .catch(error => {
            if (error.response.status !== 409) throw error
        }),
)

const csrf = () => axios.get('/sanctum/csrf-cookie')
const createLike = async ({ setErrors, setStatus, ...props }) => {
    await csrf()

    setErrors([])
    setStatus(null)

    axios
        .post('/likes', props)
        .then(response => {
            
            setStatus(response.data.status)})
        .catch(error => {
            if (error.response.status !== 422) throw error

            setErrors(error.response.data.errors)
        })
}


const showLikes = async (props) => {
    await csrf();

    axios
        .get('/likes', { params: props })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error(error);
        });
};
const userDetail = async ({ setErrors, setStatus, ...props }) => {
    await csrf()

    setErrors([])
    setStatus(null)

    axios
        .get('/users/${props.id}`', props)
        .then(response => {
            console.log(response)
            setStatus(response.data.status)})
        .catch(error => {
            if (error.response.status !== 422) throw error

            setErrors(error.response.data.errors)
        })
}
    return {
        users,error,mutate,createLike,showLikes,userDetail
    }
}