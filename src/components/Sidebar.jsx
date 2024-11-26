// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate và useLocation
import './Sidebar.css'; // Import CSS cho Sidebar

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(''); // Lưu trữ mục đang được chọn
  const navigate = useNavigate(); // Hook dùng để điều hướng
  const location = useLocation(); // Hook dùng để lấy đường dẫn hiện tại

  // Cập nhật activeItem khi đường dẫn thay đổi
  useEffect(() => {
    const path = location.pathname; // Lấy đường dẫn hiện tại
    if (path === '/') {
      setActiveItem('home'); // Nếu đường dẫn là '/', đánh dấu Home là active
    } else if (path === '/edm') {
      setActiveItem('edm');
    } else if (path === '/upload') {
      setActiveItem('upload');
    } else if (path === '/data') {
      setActiveItem('data');
    } else if (path === '/video') {
      setActiveItem('video');
    } else {
      setActiveItem('');
    }
  }, [location]);

  const handleMenuClick = (path, item) => {
    setActiveItem(item); // Cập nhật mục đang chọn
    navigate(path); // Điều hướng đến path tương ứng khi click
  };

  return (
    <div className="sidebar">
      {/* Các biểu tượng sẽ giữ nguyên CSS, chỉ thêm sự kiện onClick */}
      <i
        className={`left-menu-icon fas fa-search ${activeItem === 'search' ? 'active' : ''}`}
        data-tooltip="Search"
        onClick={() => handleMenuClick('/search', 'search')} // Điều hướng đến /search
      ></i>
      <i
        className={`left-menu-icon fas fa-home ${activeItem === 'home' ? 'active' : ''}`}
        data-tooltip="Home"
        onClick={() => handleMenuClick('/', 'home')} // Điều hướng đến trang chủ
      ></i>
      <i
        className={`left-menu-icon fas fa-music ${activeItem === 'edm' ? 'active' : ''}`}
        data-tooltip="Edm"
        onClick={() => handleMenuClick('/edm', 'edm')} // Điều hướng đến /edm
      ></i>
      <i
        className={`left-menu-icon fas fa-upload ${activeItem === 'upload' ? 'active' : ''}`}
        data-tooltip="Upload files"
        onClick={() => handleMenuClick('/upload', 'upload')} // Điều hướng đến /upload
      ></i>
      <i
        className={`left-menu-icon fas fa-file ${activeItem === 'data' ? 'active' : ''}`}
        data-tooltip="Data"
        onClick={() => handleMenuClick('/data', 'data')} // Điều hướng đến /data
      ></i>
      <i
        className={`left-menu-icon fas fa-film ${activeItem === 'video' ? 'active' : ''}`}
        data-tooltip="Video"
        onClick={() => handleMenuClick('/video', 'video')} // Điều hướng đến /video
      ></i>
    </div>
  );
};

export default Sidebar;
