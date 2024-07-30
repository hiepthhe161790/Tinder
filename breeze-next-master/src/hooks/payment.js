import useSWR from 'swr'
import axios from '../lib/axios'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'

// export const userInfo = ({ middleware, redirectIfAuthenticated, id} = {}) => {
  export const userPayment = ({ middleware, redirectIfAuthenticated } = {}) => {
  
  

    const csrf = () => axios.get('/sanctum/csrf-cookie');
    
    const vnpay_payment = async ({ setErrors, setStatus, ...props }) => {
        await csrf()
    
        setErrors([])
        setStatus(null)
    
        axios
            .post('/vnpay_payment', props, { responseType: 'json' })
            .then(response => {
                window.location.href = response.data.code === '00' && response.data.status === 'success' ? response.data.data : null;
                setStatus(response.data.status);
            })
            .catch(error => {
                if (error.response.status !== 422) throw error;
                setErrors(error.response.data.errors);
            });
    }
const confirm_payment = async ({ setErrors, setStatus, ...props }) => {
    await csrf();
    setErrors([])
    setStatus(null)

    // Lấy URL từ window.location hoặc tham số khác nếu bạn có URL từ nguồn khác
    const urlParams = new URLSearchParams(window.location.search);

    // Lấy giá trị các tham số từ URL
    const vnp_Amount = urlParams.get('vnp_Amount');
    const vnp_BankCode = urlParams.get('vnp_BankCode');
    const vnp_BankTranNo = urlParams.get('vnp_BankTranNo');
    const vnp_CardType = urlParams.get('vnp_CardType');
    const vnp_OrderInfo = urlParams.get('vnp_OrderInfo');
    const vnp_PayDate = urlParams.get('vnp_PayDate');
    const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');
    const vnp_TmnCode = urlParams.get('vnp_TmnCode');
    const vnp_TransactionNo = urlParams.get('vnp_TransactionNo');
    const vnp_TransactionStatus = urlParams.get('vnp_TransactionStatus');
    const vnp_TxnRef = urlParams.get('vnp_TxnRef');
    const vnp_SecureHash = urlParams.get('vnp_SecureHash');

    // Gửi các tham số này đến backend
    const data = {
        vnp_Amount,
        vnp_BankCode,
        vnp_BankTranNo,
        vnp_CardType,
        vnp_OrderInfo,
        vnp_PayDate,
        vnp_ResponseCode,
        vnp_TmnCode,
        vnp_TransactionNo,
        vnp_TransactionStatus,
        vnp_TxnRef,
        vnp_SecureHash
    };

    await axios.post('/thanks', data)
        .then(response => {
            setStatus(response.data.status);
        })
        .catch(error => {
            if (error.response.status !== 422) throw error;
            setErrors(error.response.data.errors);
        });
}

    

    return {
        vnpay_payment,confirm_payment,

 
    };
};