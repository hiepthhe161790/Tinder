import Link from "next/link";
import { useState } from "react";
import "../../styles/tinder.css"; // Import tệp CSS
import { userProfiles } from '../../../src/hooks/profiles';
import Likes from "../users/page"
import '../../styles/dashboard.css'
import Loading from '../../app/tinder/Loading'
// Define the Header component
const Navigation = ( ) => {
    const { getFirstNameAndFirstImage } = userProfiles({ middleware: 'auth' });
    
    return (
        <header className="header">
            <div className="header-container">
                <div className="user-profile">
                {getFirstNameAndFirstImage ? (
                        <img src={`http://127.0.0.1:8000/${getFirstNameAndFirstImage?.first_image_path}`} alt='profile.image_path' className="rounded-image" />
                    ) : (
                        <Loading />
                    )}
                    <span className="user-name">{getFirstNameAndFirstImage?.last_name}</span>
                </div>
                <Link href={`/setting-profile`} >
                    <p>Setting Profile</p>
                </Link>
            </div>
        </header>
    );
}
export default Navigation;
