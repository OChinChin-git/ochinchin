// src/components/MainContent.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Import Routes và Route để quản lý các route trong MainContent
import './MainContent.css'; // Import CSS cho MainContent
// Import các trang từ thư mục pages
import Edm from '../pages/Edm';
import Content from '../pages/Content';
import Data from '../pages/Data';
import Kimochi from '../pages/Kimochi';
import Home from '../pages/Home';
const MainContent = () => {
  return (
    <div className="container">
      <div className="content-container">
        <Routes>
          {/* Thêm các route vào đây để thay đổi nội dung trong MainContent */}
          <Route path="/edm" element={<Edm />} />
          <Route path="/content" element={<Content />} />
          <Route path="/data" element={<Data />} />
          <Route path="/kimochi" element={<Kimochi />} />
          <Route path="/" element={<Home/>} />
          <Route path="/home" element={<Home/>} />
        </Routes>
      </div>
    </div>
  );
};

export default MainContent;
