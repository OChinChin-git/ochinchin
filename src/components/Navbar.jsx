// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate
import './Navbar.css'; // Import CSS cho Navbar

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('');
  const navigate = useNavigate(); // Hook dùng để điều hướng
  const location = useLocation(); // Hook dùng để lấy đường dẫn hiện tại

  // Cập nhật activeItem khi đường dẫn thay đổi
  useEffect(() => {
    const path = location.pathname; // Lấy đường dẫn hiện tại
    // Kiểm tra các path và cập nhật activeItem
    if (path === '/') {
      setActiveItem('Home'); // Nếu đường dẫn là '/', đánh dấu Home là active
    } else if (path === '/edm') {
      setActiveItem('Edm');
    } else if (path === '/content') {
      setActiveItem('Content');
    } else if (path === '/data') {
      setActiveItem('Data');
    } else if (path === '/kimochi') {
      setActiveItem('Kimochi');
    } else {
      setActiveItem(''); // Không có mục active nếu không khớp
    }
  }, [location]); // Chạy khi đường dẫn thay đổi

  const handleMenuItemClick = (item) => {
    setActiveItem(item);
    // Nếu item là 'Home', điều hướng về trang chủ '/'
    const path = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
    navigate(path); // Sử dụng navigate để chuyển hướng
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
                onClick={() => handleMenuItemClick(item)} // Gọi hàm handle khi click
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
        <div className="toggle">
          <i className="fas fa-moon toggle-icon"></i>
          <i className="fas fa-sun toggle-icon"></i>
          <div className="toggle-ball"></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
