// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate và useLocation
import '../styles/Sidebar.css'; // Import CSS cho Sidebar
import {useDialog} from './DialogContext'
const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(''); // Lưu trữ mục đang được chọn
  const navigate = useNavigate(); // Hook dùng để điều hướng
  const location = useLocation(); // Hook dùng để lấy đường dẫn hiện tại
  const {showPrompt} = useDialog();

  // Cập nhật activeItem khi đường dẫn thay đổi
  useEffect(() => {
    const path = location.pathname; // Lấy đường dẫn hiện tại
    if (path === '/') {
      setActiveItem('home'); // Nếu đường dẫn là '/', đánh dấu Home là active
    } else if (path === '/edm') {
      setActiveItem('edm');
    } else if (path === '/upload') {
      setActiveItem('upload');
    } else if (path === '/room') {
      setActiveItem('room');
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
  const handleSearch =async()=>{
    const promptInput = await showPrompt('Tìm gì đó...','Cẩn thận nhé 🤤');
    const isConfirm = confirm('Bạn chắc chứ 🤤')
    if(!isConfirm){
      return
    }
    window.location.href = 'https://ihentai.li/search?s=' +promptInput
  }
  return (
    <div className="sidebar">
      {/* Các biểu tượng sẽ giữ nguyên CSS, chỉ thêm sự kiện onClick */}
      <i
        className={`left-menu-icon fas fa-search ${activeItem === 'search' ? 'active' : ''}`}
        data-tooltip="Search"
        onClick={handleSearch} // Điều hướng đến /search
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
        className={`left-menu-icon fas fa-door-open ${activeItem === 'room' ? 'active' : ''}`}
        data-tooltip="Room"
        onClick={() => handleMenuClick('/room', 'room')} // Điều hướng đến /data
      ></i>
      <i
        className={`left-menu-icon fas fa-film ${activeItem === 'video' ? 'active' : ''}`}
        data-tooltip="Video"
      ></i>
    </div>
  );
};

export default Sidebar;
