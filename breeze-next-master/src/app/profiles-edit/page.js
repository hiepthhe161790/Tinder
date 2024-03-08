"use client";

import ChangePassword from "../change-password/page";
import Profile from "../profile/page";
import Destroy from "../destroy/page";
import { useState } from "react";
import "../../styles/tinder.css"; // Import tệp CSS
import Link from "next/link";
import { userProfiles } from '../../../src/hooks/profiles';
import Profiles from "../store-or-update-profile/page"
import '../../styles/dashboard.css'
const Setting = () => {
    const [showMatching, setShowMatching] = useState(true);
    const { getFirstNameAndFirstImage } = userProfiles({ middleware: 'auth' });
    const toggleComponent = () => {
        setShowMatching(!showMatching);
    };
  

    return (
  
                    <div className="bg-white border-b border-gray-200 containers" >
                        <div className="scrollable-content">
                            <div className="container-tinder">
                                <header className="header">
                                    <div className="header-container">
                                        <div className="user-profile">
                                            <img src={`http://127.0.0.1:8000/${getFirstNameAndFirstImage?.first_image_path}`} alt='profile.image_path' className="rounded-image" />
                                            <span className="user-name">{getFirstNameAndFirstImage?.last_name}</span>
                                        </div>
                                        <Link href={`/dashboard`} >
                                            <p>Home</p>
                                        </Link>
                                    </div>
                                </header>
                                <div className="p-3"> {/* Thêm lớp p-3 cho các component */}
                                    <div className="p-3"> {/* Thêm lớp p-3 cho các component */}
                                        <Profile />
                                    </div>
                                    <div className="p-3"> {/* Thêm lớp p-3 cho các component */}
                                        <ChangePassword />
                                    </div>
                                    <div className="p-3"> {/* Thêm lớp p-3 cho các component */}
                                        <Destroy />
                                    </div>
                                </div>
                            </div>
                        </div>  

                    </div>
          
    );
}

export default Setting;