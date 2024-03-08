import useSWR from 'swr';
import axios from '../lib/axios';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export const userRecent = ({ middleware, redirectIfAuthenticated } = {}) => {
    const { data: responseData, error, mutate } = useSWR(`/recent-messages`, () =>
        axios
            .get(`/recent-messages`)
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error;
            }),
    );

    // Trích xuất dữ liệu từ responseData
    const recentMessages = responseData?.recentMessages;

    return {
        recentMessages,
        error,
        mutate,
    };
};
