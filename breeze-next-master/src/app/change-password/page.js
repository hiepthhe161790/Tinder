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
const ChangePassword = () => {
    const router = useRouter();
    const { user, error, changePassword } = userProfile({
        middleware: 'auth',
        redirectIfAuthenticated: '/change-password',
    });

    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState(null);
    const [current_password, setCurrentPassword] = useState(''); // Thay vì setcurrent_password, hãy sử dụng setCurrentPassword
    const [password, setPassword] = useState(''); // Thay vì setpassword, hãy sử dụng setPassword
    const [password_confirmation, setPasswordConfirmation] = useState(''); // Thay vì setpassword_confirmation, hãy sử dụng setPasswordConfirmation

    const submitPasswordForm = async (event) => {
        event.preventDefault();
        
        // Gọi hàm changePassword để cập nhật mật khẩu người dùng
        await changePassword({
            current_password,
            password,
            password_confirmation,
            setErrors,
            setStatus,
        });
    };

    if (error) {
        console.error('Error fetching profile data:', error);
        // Xử lý hiển thị lỗi nếu cần thiết
        return <div>Error fetching profile data</div>;
    }

    if (!user) {
        // Hiển thị trạng thái "Loading" trong quá trình lấy dữ liệu
        return <div>Loading...</div>;
    }
console.log(status)
console.log(errors)
console.log(errors.current_password)
console.log(errors.password)
console.log(errors.password_confirmation)

    return (
        <div className="change-password-form">
            {/* <div>Hello, {user?.name}</div>
            <div>Hello, {user?.email}</div> */}
            <div className='big-bold-text'>Change Password</div>
            <form onSubmit={submitPasswordForm}>
                <label>
                    Old Password:
                    <Input
                        type="password"
                        name="current_password"
                        value={current_password}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                    />
                </label>
                <InputError messages={errors.current_password} className="mt-2" />
                <br />
                <label>
                    New Password:
                    <Input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </label>
                <InputError messages={errors.password} className="mt-2" />
                <br />
                <label>
                    Confirm New Password:
                    <Input
                        type="password"
                        name="password_confirmation"
                        value={password_confirmation}
                        onChange={(event) => setPasswordConfirmation(event.target.value)}
                    />
                </label>
                <InputError messages={errors.password_confirmation} className="mt-2" />
                <br />
                <Button type="submit" className="ml-3">Change Password</Button>
            </form>
       
           
            {status === 'password-updated' && (
                <div className="mb-4 font-medium text-sm text-green-600">
                   Change passowrd sussessful
                   
                </div>
            )}

        </div>
    );
};


export default ChangePassword;
