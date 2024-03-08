// Import dependencies with correct paths
'use client'
import { userProfile } from '../../../hooks/profile';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import AuthSessionStatus from '../../../app/(auth)/AuthSessionStatus';
import InputError from '../../../components/InputError';
import Label from '../../../components/Label'
const Profile = () => {
    const router = useRouter()
    const { user, error, updateProfile } = userProfile({
        middleware: 'auth',
        redirectIfAuthenticated: '/profile',
    });

    const [email, setEmail] = useState(user?.email || ''); // Set initial value to user's email or an empty string
    const [name, setName] = useState(user?.name || ''); // Set initial value to user's name or an empty string

    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        // Set the form fields when user data is available
        if (user) {
            setEmail(user.email || '');
            setName(user.name || '');
        }
    }, [user]);


    const submitForm = async (event) => {
        event.preventDefault();

        // Update logic may vary based on your backend implementation

        // Call the updateProfile function to update the user profile
        await updateProfile({
            email,
            name,
            setErrors,
            setStatus,
        });


    };

    if (error) {
        console.error('Error fetching profile data:', error);
        // Handle error display if necessary
        return <div>Error fetching profile data</div>;
    }

    if (!user) {
        // Show a loading state while fetching data
        return <div>Loading...</div>;
    }
    console.log(status);
    const handleBack = () => {
        router.back(); // Sử dụng router của Next.js để quay lại trang trước đó
      };
    return (
        <div>
            {/* <div>Hello, {user?.name}</div>
            <div>Hello, {user?.email}</div> */}
            <b className=" flex sm:justify-center items-center "> Account setup </b>
            <form onSubmit={submitForm}>
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input type="text" name="name" value={name} className="block mt-1 w-full" onChange={event => setName(event.target.value)} />

                    <InputError messages={errors.name} className="mt-2" />
                </div>
                <div className="mt-4">
                    <Label htmlFor="email">Email</Label>
                    <Input type="text" name="email" value={email} className="block mt-1 w-full" onChange={event => setEmail(event.target.value)} />

                    <InputError messages={errors.email} className="mt-2" />
                </div>
                <div className="mt-4">
                <Label htmlFor="note">Note: Changing email requires re-verification</Label>
                    </div>
                    <div className="mt-2">
                <Button>Save</Button>
                
                <Button onClick={handleBack}>Back</Button>
                </div>
            </form>
                
            {status === 'profile-updated' && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    Change profile sussessful

                </div>
            )}


        </div>
    );
};

export default Profile;
