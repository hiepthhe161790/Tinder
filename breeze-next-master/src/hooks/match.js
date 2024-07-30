import useSWR from 'swr'
import axios from '../lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const userMatch = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const { data: matchedUsers, error, mutate } = useSWR('/messages/matches', () =>
        axios
            .get('/messages/matches')
            .then(res => res.data.matchedUsers)
            .catch(error => {
                if (error.response.status !== 409) throw error
            }),
    )

    useEffect(() => {
        const csrf = async () => {
            await axios.get('/sanctum/csrf-cookie')
        }
        csrf()
    }, [])
    useEffect(() => {
      
    }, [matchedUsers, error]);
    return {
        matchedUsers,
        error,
        mutate
    }
}