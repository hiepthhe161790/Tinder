// Import dependencies with correct paths
'use client'
import { userProfile } from '../../../src/hooks/profile';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Button from '../../components/Button';
import Input from '../../components/Input';
import AuthSessionStatus from '../../app/(auth)/AuthSessionStatus';
import InputError from '../../components/InputError';
import "./global.css"
const Destroy = () => {
    const router = useRouter();
    const { user, error, destroy } = userProfile({
        middleware: 'auth',
    });

    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState(null);
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false); // State để điều khiển việc hiển thị modal
    const [hasError, setHasError] = useState(false); // State để kiểm tra xem có lỗi không

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const submitForm = async (event) => {
        event.preventDefault();

        try {
            await destroy({
                password,
                setErrors,
                setStatus,
            });
           
        } catch (error) {
            // Nếu có lỗi, đặt hasError thành true để giữ lại modal
            setHasError(true);
        }
    };

    return (
        <div className="change-password-form">
            <div>Hello, {user?.name}</div>
            <div>Hello, {user?.email}</div>
            <Button onClick={openModal} className="ml-3">Change Password</Button> {/* Nút để mở modal */}
            {showModal && ( // Kiểm tra nếu showModal là true hoặc có lỗi (hasError) thì hiển thị modal
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Change Password</h2>
                        <form onSubmit={submitForm}>
                            <label>
                                Password:
                                <Input
                                    type="text"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>
                            <InputError messages={errors.password} className="mt-2" />
                            <div className="modal-buttons">
                                <Button type="submit">Submit</Button>
                                <Button onClick={closeModal}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Destroy;
