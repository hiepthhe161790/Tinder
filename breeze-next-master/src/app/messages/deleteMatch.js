// Import dependencies with correct paths
'use client'
import { userMessenger } from '../../hooks/messege';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import InputError from '../../components/InputError'
import './[id]/global.css'

const DestroyMatch = ({ id }) => {
    const { deleteMatch } = userMessenger({ middleware: 'auth', redirectIfAuthenticated: `/matches/${id}`, id });
    const [showModal, setShowModal] = useState(false); // State để quản lý trạng thái của modal
    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState(null);

    const handleDeleteMatch = async () => {
        await deleteMatch({
             id, 
            setErrors,
            setStatus, });
        setShowModal(false); // Sau khi xóa, đóng modal
    };

    const handleModalClose = () => {
        setShowModal(false); // Đóng modal khi người dùng bấm "No"
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowModal(true); // Hiển thị modal khi người dùng nhấn nút "Destroy Match"
    };
  
    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                {/* Form inputs and buttons can be added here */}
                <Button type="submit">Destroy Match</Button>
            </form>

            {/* Modal */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>Are you sure you want to delete this match?</p>
                        <Button onClick={handleDeleteMatch}>Yes</Button>
                        <Button onClick={handleModalClose}>No</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DestroyMatch;