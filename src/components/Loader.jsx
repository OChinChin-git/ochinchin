import React from "react";
import "../styles/Loader.css"; // Đảm bảo đường dẫn đúng
import "../styles/Animated.css"; // Đường dẫn tới file CSS của bạn

// Loader component hiển thị spinner và thông điệp
const Loader = ({ message, isVisible }) => {
  return (
    <div
      className={`loader-container ${isVisible ? "visible" : ""}`} // Nếu isVisible true, thêm class "visible"
    >
      <div className="ring"></div>
      <div className="ring"></div>
      <div className="ring"></div>
      <span className="loader-text animated1">{message}</span>
    </div>
  );
};

export default Loader;

