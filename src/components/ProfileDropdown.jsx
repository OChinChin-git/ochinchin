// src/components/ProfileDropdown.jsx
import React from 'react';

const ProfileDropdown = ({ isOpen, handleProfileOpen, handleLoginButton }) => {
  return (
    <div className="dropdownMenu" style={!isOpen ? { display: 'none' } : { display: 'block' }}>
      <div id="name">Name: <span id="loggedUserName"></span></div>
      <div id="email">Email: <span id="loggedUserEmail"></span></div>
      <div className="button-container">
        <button id="changeProfileButton">Change Profile</button>
        <button type="button" onClick={handleLoginButton}>Login</button>
      </div>
    </div>
  );
};

export default ProfileDropdown;

