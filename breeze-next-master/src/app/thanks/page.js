"use client";


import { useState,useEffect } from "react";
import "../../styles/tinder.css"; // Import tệp CSS
import Button from '../../components/Button';
import { userPayment } from '../../../src/hooks/payment';

import '../../styles/dashboard.css'


const PaymentSuccess = () => {
    const { confirm_payment } = userPayment({ middleware: 'auth' });
    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState(null);
    const [apiCalled, setApiCalled] = useState(false); // Biến cờ để kiểm soát việc gọi API
    const [urlParams, setUrlParams] = useState(null); // Lưu trữ các tham số từ URL

    // Hàm xử lý thanh toán
    const handlePayment = async () => {
        if (!apiCalled && urlParams) {
            // Gọi API ở đây
            await confirm_payment({ setErrors, setStatus });
            console.log("Gọi API với các tham số từ URL:", urlParams);
            setApiCalled(true); // Đặt biến cờ thành true sau khi gọi API
        }
    };

    // Trích xuất các tham số từ URL và lưu vào state khi component mount
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const params = {};
        for (let [key, value] of searchParams) {
            params[key] = value;
        }
        setUrlParams(params);
    }, []);

    // Gọi hàm xử lý thanh toán khi các tham số trong URL thay đổi
    useEffect(() => {
        handlePayment();
    }, [urlParams]); // Sử dụng urlParams làm phần tử dependencies

    return (
        <div>
            {/* Giao diện của component */}
        </div>
    );
}

export default PaymentSuccess;