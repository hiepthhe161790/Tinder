// Import dependencies with correct paths
'use client'
import { userMatch } from '../../../src/hooks/match';
import { useRouter } from 'next/navigation'
import Message from "../../app/messages/[id]/page"
import { useEffect, useState } from 'react'
import Link from 'next/link';
import "./global.css"
import Navigation from '../../app/matching/Navigation'
const Matching = ({ onUserSelect,likesStatus,messageStatus } ) => {
    const router = useRouter();
    const { matchedUsers, error,mutate } = userMatch({
        middleware: 'auth',
    });

useEffect(() => {
    if (likesStatus) {
        console.log('Likes Status changed:', likesStatus);
        mutate(); // Cập nhật dữ liệu matchedUsers khi status thay đổi và có giá trị 'Liked'
    }
  
    // Call any function or perform any action when likesStatus changes
}, [likesStatus]);

useEffect(() => {
    if (messageStatus) {
        console.log('Likes Status changed:', messageStatus);
        mutate(); // Cập nhật dữ liệu message khi status thay đổi và có giá trị 'Liked'
    }
  
    // Call any function or perform any action when messageStatus changes
}, [messageStatus]);
    // const [selectedUserId, setSelectedUserId] = useState(null);

    if (error) {
        return <div>Error loading data</div>;
    }

    if (!matchedUsers) {
        return <div>Loading...</div>;
    }
    console.log("Likes Status in Matching:", likesStatus);
    console.log("Likes Status in Message:", messageStatus);
    return (
        <div className="matched-user">
            {matchedUsers.map(match => (
                <div key={match.id}>
                    <Navigation id={match.id}/>
                    <Link href={`/messages/${match.id}`} >
                     
                     <p>Name: {match.name}</p>
             
             </Link>
                    <p>Email: {match.email}</p>
                    {/* <button onClick={() => { setSelectedUserId(match.id); onUserSelect(match.id); }}>{match.id}</button> */}
                    <button onClick={() => {  onUserSelect(match.id); }}>{match.id}</button>
                </div>
            ))}
            {/* {selectedUserId && <Message id={selectedUserId} />} */}
        </div>
    );
};

export default Matching;