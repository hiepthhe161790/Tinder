// Import dependencies with correct paths
'use client'
import { userProfile } from '../../../src/hooks/profile';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Button from '../../components/Button';
import Input from '../../components/Input';
import AuthSessionStatus from '../../app/(auth)/AuthSessionStatus';
import InputError from '../../components/InputError';
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
    // console.log(status);
    return (
        <div>
            {/* <div>Hello, {user?.name}</div>
            <div>Hello, {user?.email}</div> */}
                     <div className='big-bold-text'>Account setup </div>
            <form onSubmit={submitForm}>
                <label>
                    Name:
                    <Input type="text" name="name" value={name}  onChange={event => setName(event.target.value)} />
                </label>
                <InputError messages={errors.name} className="mt-2" />
                <br />
                <label>
                    Email:
                    <Input type="text" name="email" value={email}  onChange={event => setEmail(event.target.value)}/>
                </label>
                <InputError messages={errors.email} className="mt-2" />
                <br />
                <span> Note: Changing email requires re-verification</span>
                <div className="mt-2">
                <Button>Save</Button>
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
