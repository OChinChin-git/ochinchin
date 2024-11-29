import React, { useState } from 'react';
import "../styles/AddContent.css";

const DeleteContent = () => {
  const [isDeleteVisible, setIsDeleteVisible] = useState(false); // Kiểm tra xem phần xóa có hiển thị không
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Kiểm tra xem phần mật khẩu có hiển thị không
  const [selectedContentType, setSelectedContentType] = useState(''); // Loại nội dung được chọn để xóa
  const [password, setPassword] = useState(''); // Trạng thái lưu mật khẩu nhập vào

  // Hàm để toggle phần nhập mật khẩu
  const handleDeleteContentClick = () => {
    setIsDeleteVisible(!isDeleteVisible); // Chuyển trạng thái của phần xóa
  };

  // Hàm để toggle hiển thị phần mật khẩu
  const handlePasswordClick = () => {
    setIsPasswordVisible(!isPasswordVisible); // Chuyển trạng thái của phần mật khẩu
  };

  // Hàm để xử lý việc thay đổi loại nội dung khi người dùng chọn
  const handleContentTypeChange = (event) => {
    setSelectedContentType(event.target.value);
  };

  return (
    <div id="delete-container">
      {/* Phần chọn loại nội dung cần xóa */}
      <div>
        <label>Chọn loại nội dung cần xóa:
        <select 
          id="delete-content-type" 
          value={selectedContentType} 
          onChange={handleContentTypeChange}>
          <option value="feature">Feature</option>
          <option value="movie-list">Movie List</option>
          <option value="video">Video</option>
        </select>
          </label>
      </div>

      {/* Phần chọn nội dung cần xóa */}
      <div>
        <label>Chọn nội dung cần xóa:
        <select id="content-list">
          {/* Tùy chọn nội dung sẽ được thêm vào đây, có thể được load từ database */}
        </select>
          </label>
      </div>

      <button id="delete-content-btn" 
        onClick={handleDeleteContentClick} 
        className="save-content-button">
        Xóa nội dung
      </button>

      {/* Phần nhập mật khẩu xác nhận xóa */}
      {isDeleteVisible && (
        <div id="password-container">
          <label>Nhập mật khẩu:
          <input
            type="password"
            id="password"
            placeholder="Nhập mật khẩu để xác nhận xóa"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Lưu giá trị mật khẩu vào state
          />
          </label>
          <button id="confirm-delete-btn" 
            onClick={handlePasswordClick}
            className="save-content-button">
            Xác nhận xóa
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteContent;
