// Import dependencies with correct paths
'use client'
import { userMessenger } from '../../../hooks/messege';
import { useRouter } from 'next/navigation'
import { useEffect, useState,useRef } from 'react'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import InputError from '../../../components/InputError'
import './global.css'
import DestroyMatch from '../deleteMatch'
import Pusher from 'pusher-js';
const Message = ({ id , onStatusChange }) => {
    const { conversation, matchedUser, loggedInUser, match, error, sendMessage, mutate } = userMessenger({ middleware: 'auth', redirectIfAuthenticated: `/messages/${id}`, id });


    const [content, setContent] = useState('');
    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState(null);
    const [newMessage, setNewMessage] = useState(null);

    useEffect(() => {
        Pusher.logToConsole = true;

        const pusher = new Pusher('e974a70ed739866f2773', {
            cluster: 'eu'
        });

        const channel = pusher.subscribe('my-channel');
        channel.bind('my-event', function(data) {
            setNewMessage(data);
        });

        return () => {
            channel.unbind('my-event');
            pusher.unsubscribe('my-channel');
        };
    }, []);

    useEffect(() => {
        if (newMessage) {
            // Update conversation state with new message
            mutate();
        }
    }, [newMessage]);
    const receiverId = matchedUser?.id || id;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        
      
    // // Lấy giá trị của receiver_id dựa vào điều kiện có matchedUser hay không
    // const receiverId = matchedUser ? matchedUser.id : id;
        await sendMessage({
            receiver_id: receiverId,
            content,
            setErrors,
            setStatus,
        });
    
        setContent('');
    };
    
    useEffect(() => {
        // Cập nhật dữ liệu tin nhắn sau khi gửi tin nhắn thành công
        if (status === 'success') {
            mutate();
            onStatusChange(`${status} by ${receiverId}`);
        }
    }, [status]);
    useEffect(() => {
        // Cuộn xuống tin nhắn mới nhất khi tin nhắn được gửi hoặc nhận
        const chatList = document.querySelector('.chat-list');
        chatList.scrollTop = chatList.scrollHeight;
    }, [conversation]); // Kích hoạt lại mỗi khi số lượng tin nhắn trong cuộc trò chuyện thay đổi
    const date = match?.created_at.slice(0, 10);
    return (
        <div className="container">
            <div>
            <h1 className="header-message">Conversation with {matchedUser?.name} on {date}</h1>
            <DestroyMatch id={matchedUser?.id} />
            <ul className="chat-list">
                {conversation && conversation.map(message => (
                    <li className={loggedInUser?.id === message.sender_id ? 'sent-message' : 'received-message'} key={message.id}>
                        <strong>{loggedInUser?.id === message.sender_id ? loggedInUser?.name : matchedUser?.name}:</strong> {message.content}
                    </li>
                ))}
            </ul>
            {status === 'success' && (
                <div className="mb-4 font-medium text-sm text-green-600 text-right">
                    Send sussessful

                </div>
            )}
            
            <form onSubmit={handleSubmit} className="message-form">
                <Input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your message..."
                />
                <InputError messages={errors.content} className="mt-2" />
                <InputError messages={errors.receiver_id} className="mt-2" />
                <Button type="submit">Send Message</Button>
            </form>
            {status === 'error' && (
               <div className="mb-4 font-medium text-sm text-red-600 text-right">
                    You can only send messages to matched users.

                </div>
            )}
            </div>
        </div>
    );
};

export default Message; 