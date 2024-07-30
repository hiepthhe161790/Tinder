import useSWR from 'swr'
import axios from '../lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const params = useParams()

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }) => {
        try {
            await csrf();
    
            setErrors([]);
    
            await axios.post('/register', props)
                .then(() => mutate());
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.log('Too many requests! Please try again later.');
            }  else if(error.response && error.response.status === 404 ){
                console.log('404 lỗi rồi! Please try again later.');
            } else if (error.response && error.response.status !== 422) {
                throw error;
            } else {
                setErrors(error.response.data.errors);
            }
        }
    };
    
    const login = async ({ setErrors, setStatus, ...props }) => {
        try {
            await csrf();
    
            setErrors([]);
            setStatus(null);
    
            await axios.post('/login', props)
                .then(() => mutate());
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.log('Too many requests! Please try again later.');  
            }else if(error.response && error.response.status === 403 ){
                console.log('403 Sai tai khoan! Please try again later.');   
            }  else if(error.response && error.response.status === 404 ){
                console.log('404 lỗi rồi! Please try again later.');
            } else if (error.response && error.response.status !== 422) {
                throw error;
            } else {
                setErrors(error.response?.data.errors);
            }
        }
    };
    
    
    
    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/reset-password', { token: params.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        )
            router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
        if (middleware === 'auth' && user && !user.email_verified_at) {
            router.push('/verify-email');
        }
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
