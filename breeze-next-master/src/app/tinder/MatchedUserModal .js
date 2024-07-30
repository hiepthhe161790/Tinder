import React from 'react';

const MatchedUserModal = ({ matchedUser, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Matched User</h2>
        <div>
          <p>ID: {matchedUser.id}</p>
          <p>Name: {matchedUser.name}</p>
          {/* Add additional user information here */}
        </div>
      </div>
    </div>
  );
};

export default MatchedUserModal;
