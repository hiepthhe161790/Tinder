import useSWR from 'swr'
import axios from '../lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const userPlan = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const params = useParams()
    const { data: subscriptionPlans, error, mutate } = useSWR('/subscription_plans', () =>
    axios
        .get('/subscription_plans')
        .then(res => res.data.subscriptionPlans)
        .catch(error => {
            if (error.response.status !== 409) throw error
        }),
)
const csrf = () => axios.get('/sanctum/csrf-cookie')
const updatePlan = async ({ setErrors, setStatus, ...props }) => {
    await csrf()

    setErrors([])
    setStatus(null)

    axios
        .put('/subscription_plans/{id}', props)
        .then(response => {
            // console.log(response)
            setStatus(response.data.status)})
        .catch(error => {
            if (error.response.status !== 422) throw error

            setErrors(error.response.data.errors)
        })
}
const createPlan = async ({ setErrors, setStatus, ...props }) => {
    await csrf()

    setErrors([])
    setStatus(null)

    axios
        .post('/subscription_plans/create', props)
        .then(response => {
            // console.log(response)
            setStatus(response.data.status)})
        .catch(error => {
            if (error.response.status !== 422) throw error

            setErrors(error.response.data.errors)
            console.log(error)
            
        })
}
const destroyPlan = async ({ password, setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
        .delete('/subscription_plans/{id}', { data: { password, ...props } })
        .then(response => {
            setStatus(response.data.status);
             //   window.location.pathname = '/login';
        })
        .catch(error => {
            if (error.response.status !== 422) throw error;
            setErrors(error.response.data.errors);
        });
};


    return {
        subscriptionPlans,
        error,
        mutate,
        updatePlan,
        createPlan,
        destroyPlan,
    }
}