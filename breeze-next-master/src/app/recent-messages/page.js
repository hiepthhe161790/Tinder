
'use client'
import { userRecent } from '../../hooks/recent';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link';
import "./global.css"
import Message from "../../app/messages/[id]/page"
import Navigation from '../../app/matching/Navigation'
const MessengerComponent = ({ onUserSelect, messageStatus }) => {
    const { recentMessages, error, mutate } = userRecent({  
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard', // Thêm dấu ')' ở cuối đây
    });
    useEffect(() => {
        if (messageStatus) {
            console.log('Likes Status changed in New messege:', messageStatus);
            mutate(); // Cập nhật dữ liệu message khi status thay đổi và có giá trị 'Liked'
        }
      
        // Call any function or perform any action when messageStatus changes
    }, [messageStatus]);
    // const [selectedUserId, setSelectedUserId] = useState(null);
    if (error) {
        return <div>Error fetching recent messages: {error.message}</div>;
    }

    if (!recentMessages) {
        return <div>Loading...</div>;
    }
const messagesArray = Object.values(recentMessages);

return (
    <div className="messenger-container">
        <h2 className="messenger-header">Recent Messages</h2>
        <ul className="message-list">
            {messagesArray.map((message, index) => (
                <li key={index} className="message-item">
                      <Navigation id={message.user.id} />
                    <Link href={`/messages/${message.user.id}`}>
                        <div className="user-names">User: {message.user.name}</div>
                    </Link>
                    <div className="last-message">Last Message: {message.last_message.content}</div>
                    {/* <button onClick={() => { setSelectedUserId(message.user.id); onUserSelect(message.user.id); }}>{message.user.id}</button> */}
                    <button onClick={() => {onUserSelect(message.user.id); }}>{message.user.id}</button>
                </li>
            ))}
              {/* {selectedUserId && <Message id={selectedUserId} />} */}
        </ul>
    </div>
);
};


export default MessengerComponent;