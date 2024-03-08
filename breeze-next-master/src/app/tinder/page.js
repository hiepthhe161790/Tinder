
"use client";

import MessengerComponent from "../recent-messages/page";
import Matching from "../matching/page";
import { useState,useEffect } from "react";
import "../../styles/tinder.css"; // Import tệp CSS
import Message from "../messages/[id]/page";
import User from "../profile/[id]/page";
import Likes from "../users/page"
// import '../../styles/dashboard.css'
import Navigation from '../../app/tinder/Navigation'
const Tinder = () => {
    const [showMatching, setShowMatching] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [likesStatus, setLikesStatus] = useState(null); // State để lưu trữ status của likes
    const [messageStatus, setMessageStatus] = useState(null);
    // Load previous state from sessionStorage
    useEffect(() => {
      const showMatchingState = sessionStorage.getItem("showMatching");
      if (showMatchingState !== null) {
          setShowMatching(showMatchingState === "true");
      }
  }, []);

  const toggleComponent = () => {
      const newShowMatching = !showMatching;
      setShowMatching(newShowMatching);
      sessionStorage.setItem("showMatching", newShowMatching.toString());
  };

    const handleUserSelect = (userId) => {
        setSelectedUserId(userId);
        console.log("Selected User ID:", userId);
    };
    const handleLikesStatusChange = (status) => {
        setLikesStatus(status); // Cập nhật status của likes từ component con
        console.log("Likes Status:", status); // Console log ra status của likes
    };
    const handleMessageStatusChange = (status) => {
        setMessageStatus(status); // Cập nhật status của Message từ component con
        console.log("Message Status:", status);
      };
    return (
        <div className="">
            <div className="">
                <div className="">
                    <div className="bg-white  border-gray-200 containers"> 
                        <div className="container-tinder">
                            <Navigation/>
                            <div>
                                <nav className="nav">
                                    <ul>
                                        <li>
                                            <button className={showMatching ? "active" : ""} onClick={toggleComponent}>Show Matching</button>
                                        </li>
                                        <li>
                                            <button className={!showMatching ? "active" : ""} onClick={toggleComponent}>Show Messenger</button>
                                        </li>
                                    </ul>
                                </nav>
                                {showMatching ? <Matching onUserSelect={handleUserSelect}  messageStatus={messageStatus} likesStatus={likesStatus}/> : <MessengerComponent onUserSelect={handleUserSelect} messageStatus={messageStatus} />}
                            </div>
                        </div>
                        <div className="like">
                            {selectedUserId ? 
                                <div  className="message-container">
                                   <div className="message-close"><Message id={selectedUserId} onStatusChange={handleMessageStatusChange} /> 
                                   <button className="close-button" onClick={() => setSelectedUserId(null)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    </div> 
                                   <div> <User id={selectedUserId} /></div>  
                                   
                                </div> 
                                :  <Likes onStatusChange={handleLikesStatusChange} />}
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tinder;