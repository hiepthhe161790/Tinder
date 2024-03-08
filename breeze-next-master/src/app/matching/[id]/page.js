'use client'
import Link from "next/link";
import { useState } from "react";
import "../../../styles/tinder.css"; // Import tệp CSS
import { userAvatar } from '../../../hooks/avatar';
import Likes from "../../users/page"
import '../../../styles/dashboard.css'
import Loading from '../../../app/tinder//Loading'
// Define the Header component
const Navigation = ( {id}) => {
    const { first_image_path } = userAvatar({ middleware: 'auth',id });
    
    return (
     
   
                <div className="user-profile">
                        {first_image_path ? (
                    <img src={`http://127.0.0.1:8000/${first_image_path?.first_image_path}`} alt='profile.image_path' className="rounded-image" />
                    ) : (
                        <Loading />
                    )}
                </div>
               

 
    );
}
export default Navigation;
