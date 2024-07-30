"use client";


import { useState } from "react";
import "../../styles/tinder.css"; // Import tệp CSS
import Button from '../../components/Button';
import { userPayment } from '../../../src/hooks/payment';
import CropImage from '../../components/crop/App';
import '../../styles/dashboard.css'

const Payment = () => {

    const { vnpay_payment } = userPayment({ middleware: 'auth' });
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState(null);
    const handlePayment = async (event) => {
        
            event.preventDefault();
            // Gọi hàm vnpay_payment để thực hiện thanh toán
            await vnpay_payment({ setErrors, setStatus });
            // Xử lý thành công
            setIsPaymentSuccess(true);
    };

    return (
        <div className="bg-white border-b border-gray-200 containers">
            <div className="scrollable-content">
                <div className="container-tinder">
                <CropImage/>
                        <div className="p-3">
                            {/* Phần tử UI để kích hoạt thanh toán */}
                            <Button onClick={handlePayment}>Thanh toán</Button>
                       
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default Payment;
