// Import dependencies with correct paths
'use client';
import { userProfiles } from '../../../src/hooks/profiles';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import AuthSessionStatus from '../../app/(auth)/AuthSessionStatus';
import InputError from '../../components/InputError';

const Profiles = () => {
  const router = useRouter();
  const { profile,error, createProfiles, updateProfiles } = userProfiles({
    middleware: 'auth',
    redirectIfAuthenticated: '/profiles',
  });

  const [image_path, setImage_path] = useState(profile?.image_path || []);
  const [age, setAge] = useState(profile?.age || '');
  const [gender, setGender] = useState(profile?.gender || '1');
  const [location, setLocation] = useState(profile?.location || '');
  const [interests, setInterests] = useState(profile?.interests || '');
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (profile) {
      setImage_path(profile.image_path || []);
      setAge(profile.age || '');
      setGender(profile.gender || '1');
      setLocation(profile.location || '');
      setInterests(profile.interests || '');
    }
  }, [profile]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const paths = Array.from(files).map((file) => URL.createObjectURL(file));
    setImage_path(paths);
  };

  const submitForm = async (event) => {
    event.preventDefault();

    const profileData = {
      image_path,
      age,
      gender,
      location,
      interests,
    };
    const submitForm = event => {
      event.preventDefault()

      register({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
          setErrors,
      })
  }

    // Call the createProfiles function to create a new profile or updateProfiles to update the existing one
    await createProfiles({
      ...profileData,
      setErrors,
      setStatus,
    });
  };

  if (error) {
    console.error('Error fetching profile data:', error);
    // Handle error display if necessary
    return <div>Error fetching profile data</div>;
  }

  if (!profile) {
    // Show a loading state while fetching data
    return <div>Loading...</div>;
  }

  console.log(status);

  console.log(profile);
  console.log(profile.image_path);
  return (
    <div>
      <div>
        
          <div >
            <img src={`http://127.0.0.1:8000/images/${profile.image_path}`} alt='profile.image_path' />
          </div>

        <div>Age: {profile.age}</div>
        <div>Gender: {profile.gender ? 'Male' : 'Female'}</div>
        <div>Location: {profile.location}</div>
        <div>Interests: {profile.interests || 'N/A'}</div>
      </div>
      <form onSubmit={submitForm}>
        <label>
          Image Path:
          {/* Input cho nhiều file */}
          <input type="file" name="image_path" multiple onChange={handleFileChange} />
        </label>
        <InputError messages={errors.image_path} className="mt-2" />
        <label>
          Age:
          <Input type="number" name="age" value={age} onChange={(event) => setAge(event.target.value)} />
        </label>
        <InputError messages={errors.age} className="mt-2" />
        <label>
          Gender:
          <select name="gender" value={gender} onChange={(event) => setGender(event.target.value)}>
            <option value="1">Male</option>
            <option value="0">Female</option>
          </select>
        </label>
        <InputError messages={errors.gender} className="mt-2" />
        <label>
          Location:
          <Input type="text" name="location" value={location} onChange={(event) => setLocation(event.target.value)} />
        </label>
        <InputError messages={errors.location} className="mt-2" />
        <label>
          Interests:
          <Input type="text" name="interests" value={interests} onChange={(event) => setInterests(event.target.value)} />
        </label>
        <InputError messages={errors.interests} className="mt-2" />
        <Button className="ml-3">Save</Button>
      </form>
      {status === 'profile-stored' && (
        <div className="mb-4 font-medium text-sm text-green-600">
          Change profile successful
        </div>
      )}
        {status === 'profile-stored' && (
        <div className="mb-4 font-medium text-sm text-green-600">
          Change profile successful
        </div>
      )}
    </div>
  );
};

export default Profiles;