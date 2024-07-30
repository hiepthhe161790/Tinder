
"use client";


import { useState } from "react";
import "../../styles/tinder.css"; // Import tệp CSS
import Button from '../../components/Button';
import { userPayment } from '../../../src/hooks/payment';
import { userPlan } from '../../../src/hooks/plan';
import '../../styles/plan.css'

const Payment = () => {
    const { vnpay_payment } = userPayment({ middleware: 'auth' });
    const { subscriptionPlans } = userPlan({ middleware: 'auth' });

    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [planType, setPlanType] = useState(null); // Thêm biến planType

    const handlePayment = async (event, plan, type) => { // Thêm tham số type vào hàm handlePayment
        event.preventDefault();
        setPlanType(type); // Cập nhật giá trị của biến planType khi người dùng chọn loại kế hoạch

        // Lấy thông tin từ kế hoạch được chọn
        const order_info = plan.name;
        const subscription_plan_id = plan.id;

        // Chọn giá theo loại kế hoạch
        let amount;
        if (type === 'weekly') {
            amount = plan.weekly_price;
        } else if (type === 'monthly') {
            amount = plan.monthly_price;
        } else if (type === 'yearly') {
            amount = plan.yearly_price;
        }

        await vnpay_payment({ 
            order_info,
            order_type: 'week', // Update order_type
            amount,
            subscription_plan_id,
            setErrors,
            setStatus 
        });
    };

    const PlanArray = subscriptionPlans ? Object.values(subscriptionPlans) : [];

    return (
        <div>
            <div className="payment-container">
                {PlanArray.map(plan => (
                    <div className="payment-details" key={plan.id}>
                        <h3 onClick={() => setSelectedPlan(plan)}>{plan.name}</h3>
                        {selectedPlan && selectedPlan.id === plan.id && (
                            <div className="plan-details">
                                <div className="left-column">
                                    <p>Description: {plan.description}</p>
                                    <p>Weekly Price: {plan.weekly_price}</p>
                                    <p>Monthly Price: {plan.monthly_price}</p>
                                    <p>Yearly Price: {plan.yearly_price}</p>
                                </div>
                                <div className="right-column">
                                    <Button onClick={(e) => handlePayment(e, plan, 'weekly')}>Select Weekly Plan</Button>
                                    <Button onClick={(e) => handlePayment(e, plan, 'monthly')}>Select Monthly Plan</Button>
                                    <Button onClick={(e) => handlePayment(e, plan, 'yearly')}>Select Yearly Plan</Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Payment;