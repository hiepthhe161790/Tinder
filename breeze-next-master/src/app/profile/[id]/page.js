// Import dependencies with correct paths
'use client'
import { userInfo } from '../../../hooks/Info';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import '../../users/global.css';
const User = ({ id }) => {
    const { user, error, mutate } = userInfo({ middleware: 'auth', redirectIfAuthenticated: `/users/${id}`, id });
// console.log("User infor: ", user);
const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
return (
    <div className="frame">
        {user ? (
            <div>
                <div className="card" key={user.id}>
                    <div>
                        <p>Images:</p>
                        {user.profile.image_path.includes(',') ? (
                        <Slider {...settings}>
                            {user.profile.image_path.split(',').map((image, index) => (
                                <img
                                    key={index}
                                    src={`http://127.0.0.1:8000/${image}`}
                                    alt={`Image ${index}`}
                                    style={{ maxWidth: '300px' }}
                                />
                            ))}
                        </Slider>
                         ) : (
                            <img
                              src={`http://127.0.0.1:8000/${user.profile.image_path}`}
                              alt="Image"
                              style={{ maxWidth: '300px' }}
                            />
                          )}
                    </div>
                    <div>
                        <div>Hello, {user.name}</div>
                        <div>Email: {user.email}</div>
                        <div>Age: {user.profile.age}</div>
                        <div>Gender: {user.profile.gender === 1 ? "Male" : "Female"}</div>
                        {/* Add additional fields as needed */}
                    </div>
                    
                    {/* Add additional UI elements or buttons */}
                </div>
            </div>
        ) : (
            <div>Loading...</div>
        )}
    </div>
);
};

export default User; 