// src/components/Navbar.jsx
import React, { useState } from 'react';
import './Navbar.css'; // Import CSS cho Navbar

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('');

  const handleMenuItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <h1 className="logo">OChinChin</h1>
        </div>
        <div className="menu-container">
          <ul className="menu-list">
            {['Home', 'Edm', 'Content', 'Data', 'Kimochi'].map((item) => (
              <li
                key={item}
                className={`menu-list-item ${activeItem === item ? 'active' : ''}`}
                onClick={() => handleMenuItemClick(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="profile-container">
          <img className="profile-picture" alt="Profile" />
          <div className="profile-text-container">
            <span className="profile-text">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
