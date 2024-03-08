const Status = ({status}) => {
    return (
      <> 
       {/* storeOrUpdateProfiles */}
          {status === 'profile-stored' && (
          <div className="status-message success">
            Profile updated successfully
          </div>
        )}
        {status === 'error-maximum' && (
          <div className="status-message error">
          Fail! Số ảnh không vượt quá 9 ảnh
          </div>
        )}
        {status === 'error-login' && (
          <div className="status-message error">
           Please login again
          </div>
        )}

        {/* addImageProfile */}
           {status === 'image-profile-added' && (
          <div className="status-message success">
          Image profile added sussessful
          </div>
        )}
        {/* updateImageProfile */}
       
       {status === 'image-profile-updated' && (
          <div className="status-message success">
           Updated image profile susscess
          </div>
        )}

           {/* deleteImageProfile */}
            
        {status === 'profile-deleted' && (
          <div className="status-message success">
           Deleted image profile sussesss
          </div>
        )}
      </>
    );
  };
  
  export default Status;
  