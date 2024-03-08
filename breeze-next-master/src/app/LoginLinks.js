'use client'
import { useState } from 'react';
import Link from 'next/link'
import { useAuth } from '../hooks/auth'
import Login from './(auth)/login/page'
import Register from './(auth)/register/page'
import '../styles/loginLinks.css'
const LoginLinks = () => {
    const { user } = useAuth({ middleware: 'guest',redirectIfAuthenticated: '/dashboard', })
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const openLoginModal = () => {
        closeRegisterModal(); // Đảm bảo rằng modal của màn hình đăng ký đã đóng trước khi mở màn hình đăng nhập
        setShowLoginModal(true);
    };

    const closeLoginModal = () => {
        setShowLoginModal(false);
    };

    const openRegisterModal = () => {
        closeLoginModal(); // Đảm bảo rằng modal của màn hình đăng nhập đã đóng trước khi mở màn hình đăng ký
        setShowRegisterModal(true);
    };

    const closeRegisterModal = () => {
        setShowRegisterModal(false);
    };

    return (
        <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block">
            {user ? (
                <Link
                    href="/dashboard"
                    className="ml-4 text-sm text-gray-700 underline"
                >
                    Dashboard
                </Link>
            ) : (
                <>
                    <button
                        onClick={openLoginModal}
                        className="text-sm text-white underline"
                    >
                        Login
                    </button>
                    {showLoginModal && (
                        <div className="modal">
                            <button onClick={closeLoginModal} className="close-button">X</button>
                            <Login closeModal={closeLoginModal} />
                        </div>
                    )}

                    <button
                        onClick={openRegisterModal}
                        className="ml-4 text-sm text-white underline"
                    >
                        Register
                    </button>
                    {showRegisterModal && (
                        <div className="modal">
                            <button onClick={closeRegisterModal} className="close-button">X</button>
                            <Register closeModal={closeRegisterModal} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default LoginLinks;