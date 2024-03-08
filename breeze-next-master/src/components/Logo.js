import React from 'react';
import '../styles/logo.css'; // Import tập tin CSS

const Logo = () => (
  <div className="logo-container">
    <div>
      <img src="/images/misc/logo.png" alt="Tinder Logo" />
    </div>
    <div className="logo-text">Tinder</div>
  </div>
);

export default Logo;
