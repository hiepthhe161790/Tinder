'use client';

import React, { useState } from "react";
import { userLikes } from '../../../src/hooks/likes';

const App = () => {
  const { users, error, createLike } = userLikes({
    middleware: 'auth',
    redirectIfAuthenticated: '/dashboard',
  });

  const containerStyles = {
    width: "500px",
    height: "280px",
    margin: "0 auto",
    position: "relative",
    overflow: "hidden",
  };

  const slideStyles = {
    width: "500px",
    height: "280px",
    borderRadius: "10px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "absolute",
    transition: "transform 0.5s ease",
  };

  const sliderStyles = {
    display: "flex",
    height: "100%",
  };

  const dotsContainerStyles = {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const dotStyle = {
    margin: "0 3px",
    cursor: "pointer",
    fontSize: "20px",
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? users.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === users.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div>
      {users ? (
        <div>
          <h1>Hello monsterlessons</h1>
          <div style={containerStyles}>
            <div style={{ ...sliderStyles, transform: `translateX(-${currentIndex * 500}px)` }}>
              {users.map((user, index) => (
                <div key={index} style={{ ...slideStyles, backgroundImage: user.profile && user.profile.image_path ? `url(http://127.0.0.1:8000/${user.profile.image_path.split(',')[0]})` : 'none', left: `${index * 500}px` }}></div>
              ))}
            </div>
            <div style={dotsContainerStyles}>
              {users.map((user, index) => (
                <div
                  key={index}
                  style={dotStyle}
                  onClick={() => goToSlide(index)}
                >
                  ●
                </div>
              ))}
            </div>
            <div onClick={goToPrevious} style={{ ...dotStyle, position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", fontSize: "45px" }}>❰</div>
            <div onClick={goToNext} style={{ ...dotStyle, position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)", fontSize: "45px" }}>❱</div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default App;
