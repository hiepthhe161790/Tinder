'use client';
import { userLikes } from '../../../src/hooks/likes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import AuthSessionStatus from '../../app/(auth)/AuthSessionStatus';
import InputError from '../../components/InputError';
import './global.css';
// Không cần import './TinkerCard'; vì không sử dụng trong component này
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

const Likes = ({ onStatusChange, onMatchedUser  }) => {
  const router = useRouter();

  const { users, error, createLike } = userLikes({
    middleware: 'auth',
    redirectIfAuthenticated: '/dashboard',
  });
  const [status, setStatus] = useState(null);
  const [currentLikedUser, setCurrentLikedUser] = useState(null);
 
  useEffect(() => {
    if (status === 'Match-created-successfully') {
      onStatusChange(`${status} by ${currentLikedUser ? currentLikedUser.id : ''}`);
      if (currentLikedUser) {
        onMatchedUser(currentLikedUser); // Gửi thông tin người dùng vừa được match lên component cha
      }
    }
  }, [status, currentLikedUser, onStatusChange, onMatchedUser]);
  const [likedUsers, setLikedUsers] = useState([]);
  const [errors, setErrors] = useState([]);
  // const [status, setStatus] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Thêm state để theo dõi chỉ số của card hiện tại
  const [showProfile, setShowProfile] = useState(false);
  const [showDetailButton, setShowDetailButton] = useState(false); // State để kiểm soát việc hiển thị nút tắt thông tin chi tiết
  // const [currentLikedUser, setCurrentLikedUser] = useState(null); // State để lưu trữ thông tin người dùng hiện tại đã thích
  const [showDislikeText, setShowDislikeText] = useState(false);
  const [showLikeText, setShowLikeText] = useState(false);
  useEffect(() => {
    if (error) {
      // Xử lý lỗi nếu có
      console.error("Error:", error.message);
    }
  }, [error]);

  const handleLike = async (liked_user) => {
    // setLikedUsers([...likedUsers, liked_user.id]);
    setShowLikeText(true);
    try {
      // Thực hiện hành động like và xử lý lỗi nếu có
      await createLike({ liked_user_id: liked_user.id, setErrors, setStatus });
      // Lưu toàn bộ thông tin của người dùng đã thích vào state
      setCurrentLikedUser({ id: liked_user.id, name: liked_user.name });
      // Sau khi like thành công, chuyển sang card tiếp theo (nếu có)
      // console.log('Liked User:', liked_user);
      setTimeout(() => {
        // Sau khi đã chờ 3 giây, chuyển trạng thái đang đợi về false và chuyển sang card tiếp theo
        setShowLikeText(false);
        setCurrentCardIndex(currentCardIndex + 1);
      }, 1000);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };


  const handleDislike = (liked_user_id) => {
    setShowDislikeText(true); // Hiển thị chữ "Dislike" khi dislike
    // Xử lý hành động dislike
    // Chuyển sang card tiếp theo (nếu có)
    setTimeout(() => {
      // Sau khi đã chờ 3 giây, chuyển trạng thái đang đợi về false và chuyển sang card tiếp theo
      setShowDislikeText(false); // Ẩn chữ "Dislike" sau khi đã chuyển sang card tiếp theo
      setCurrentCardIndex(currentCardIndex + 1);
    }, 1000);
  };

  const handleUserDetail = () => {
    setShowProfile(true);
    setShowDetailButton(true); // Hiển thị nút tắt thông tin chi tiết khi click vào "View Details"
  };

  const handleCloseDetail = () => {
    setShowProfile(false);
    setShowDetailButton(false); // Ẩn nút tắt thông tin chi tiết khi click vào nút đó
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  //  console.log("Đã like người dùng: " + JSON.stringify(currentLikedUser));

  return (
    <div className="frame">
      {users ? (
        <div>
          {users.map((user, index) => (
            index === currentCardIndex && !likedUsers.includes(user.id) ? ( // Chỉ hiển thị card hiện tại
              <div className="card" key={user.id}>
                {showDislikeText && <div className="dislike-text">Dislike</div>} {/* Hiển thị chữ "Dislike" */}
                {showLikeText && <div className="dislike-text">Liked</div>}
                <div>
                  {user.profile && user.profile.image_path && (
                    <div>
                      <p>Images:</p>
                      {user.profile.image_path.includes(',') ? (
                        <Slider {...settings}>
                          {user.profile.image_path.split(',').map((image, index) => (
                            <img
                              key={index}
                              src={`http://127.0.0.1:8000/${image}`}
                              alt={`Image ${index}`}
                              style={{ maxWidth: '300px' }}
                            />
                          ))}
                        </Slider>
                      ) : (
                        <img
                          src={`http://127.0.0.1:8000/${user.profile.image_path}`}
                          alt="Image"
                          style={{ maxWidth: '300px' }}
                        />
                      )}
                    </div>
                  )}

                  {(!user.profile || !user.profile.image_path) && ( // Thêm điều kiện kiểm tra nếu không có ảnh
                    <div>
                      <p>Images:</p>
                      <img
                        src="/images/misc/user.png" // Đường dẫn đến hình ảnh placeholder
                        alt="Default Image"
                        style={{ maxWidth: '300px' }}
                      />
                    </div>
                  )}
                  <div>
                  <div className="big-bold-text">{user.name}</div>
                    <div> {user.email}</div>
                    {showProfile && user.profile && (
                      <div>
                        Profile:
                        <ul>
                          <li>Age: {user.profile.age}</li>
                          <li>Gender: {user.profile.gender === 1 ? "Male" : "Female"}</li>
                          {/* Add additional fields as needed */}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="icons">
                    <img src="/images/misc/like.png" alt="Like" onClick={() => handleLike(user)} />
                    <img src="/images/misc/dislike.png" alt="Dislike" onClick={() => handleDislike(user.id)} />
                  </div>
                  {showDetailButton ? (
                    <Button onClick={handleCloseDetail}>Close Detail</Button> // Nút tắt thông tin chi tiết
                  ) : (
                    <Button onClick={handleUserDetail}>View Details</Button>
                  )}
                </div>
              </div>
            ) : null
          ))}
          {status && (
            <div>
              {status} {status && currentLikedUser && `by ${currentLikedUser.name}`}
            </div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Likes;