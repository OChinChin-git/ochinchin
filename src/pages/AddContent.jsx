import React, { useState } from 'react';
import FeaturedContent from './FeaturedContent';
import MovieList from './MovieList';
import VideoManager from './VideoManager';
import OrderContent from './OrderContent';
import DeleteContent from './DeleteContent';
import "../styles/AddContent.css";

const AddContent = () => {
  const [contentType, setContentType] = useState(''); // Theo dõi lựa chọn từ dropdown

  // Hàm xử lý thay đổi giá trị lựa chọn
  const handleContentChange = (event) => {
    setContentType(event.target.value); // Cập nhật trạng thái khi người dùng chọn một loại nội dung
  };

  // Hàm render các nội dung tùy thuộc vào lựa chọn
  const renderContent = () => {
    switch (contentType) {
      case 'feature':
        return <FeaturedContent />;
      case 'movie-list':
        return <MovieList />;
      case 'add-video':
        return <VideoManager />;
      case 'order':
        return <OrderContent />;
      case 'delete':
        return <DeleteContent />;
      default:
        return <p>Vui lòng chọn loại nội dung.</p>;
    }
  };

  return (
    <div className="add-content-page">
      <h1 className="add-content-title animated3">Thêm Content</h1>

      {/* Dropdown cho phép chọn loại nội dung */}
      <label className="selectLabel">Chọn loại nội dung:
      <select
        id="content-type"
        value={contentType}
        onChange={handleContentChange}
      >
        <option value="">-- Chọn --</option>
        <option value="feature">Featured Content</option>
        <option value="movie-list">Movie List</option>
        <option value="add-video">Video Manager</option>
        <option value="order">Sắp xếp</option>
        <option value="delete">Delete Content</option>
      </select>
      </label>
      {/* Hiển thị phần tương ứng với loại nội dung đã chọn */}
      <div className="content-display">
        {renderContent()}
      </div>
    </div>
  );
};

export default AddContent;
