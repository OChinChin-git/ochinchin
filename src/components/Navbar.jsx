import React, { useEffect,useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import "../styles/Animated.css";

const Navbar = () => {
  const [activeItem, setActiveItem] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); 
  // Cập nhật activeItem khi đường dẫn thay đổi
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActiveItem("Home");
    } else if (path === "/edm") {
      setActiveItem("Edm");
    } else if (path === "/content") {
      setActiveItem("Content");
    } else if (path === "/data") {
      setActiveItem("Data");
    } else if (path === "/kimochi") {
      setActiveItem("Kimochi");
    } else {
      setActiveItem("");
    }
  }, [location]);

  // Hàm chuyển hướng khi menu item được click
  const handleMenuItemClick = (item) => {
    setActiveItem(item);
    const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
    navigate(path);
  };

  // Đăng ký sự kiện toggle khi component được render
  useEffect(() => {
    const ball = document.querySelector(".toggle-ball");
    if (ball) {
      const items = document.querySelectorAll("*");
      // Kiểm tra trạng thái "kimochi" từ localStorage khi trang tải lại
      const isKimochi = localStorage.getItem("kimochi") === "true";
      if (isKimochi) {
        items.forEach((item) => item.classList.add("kimochi"));
        if (ball) {
          ball.classList.add("active");
        }
      }
      // Đăng ký sự kiện toggle
      ball.addEventListener("click", () => {
        items.forEach((item) => {
          item.classList.toggle("kimochi");
        });
        ball.classList.toggle("active");
        const isActive = ball.classList.contains("active");
        localStorage.setItem("kimochi", isActive.toString()); // Lưu trạng thái vào localStorage
      });
    }

    // Cleanup để ngừng nghe sự kiện khi component bị hủy
    return () => {
      const ball = document.querySelector(".toggle-ball");
      if (ball) {
        ball.removeEventListener("click", () => {
          items.forEach((item) => {
            item.classList.toggle("active");
          });
          ball.classList.toggle("active");
        });
      }
    };
  }, []); // Chỉ chạy một lần khi component mount
  const handleProfileOpen=()=>{
    setIsOpen(!isOpen);
  }
  const handleLoginButton = ()=>{
    navigate('/login');
  }
  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <h1 className="logo animated4">OChinChin</h1>
        </div>
        <div className="menu-container">
          <ul className="menu-list">
            {["Home", "Edm", "Content", "Data", "Kimochi"].map((item) => (
              <li
                key={item}
                className={`menu-list-item ${
                  activeItem === item ? "active" : ""
                }`}
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
            <div onClick={handleProfileOpen} style={{cursor:"pointer"}}>
            <i className={`fas ${isOpen ?" fa-caret-up":"fa-caret-down"} toggleProfile`}></i>
              </div>
              <div className="dropdownMenu" style={!isOpen?{display:"none"}:{display:"block"}}>
    <div id="name">Name: <span id="loggedUserName"></span></div>
    <div id="email">Email: <span id="loggedUserEmail"></span></div>
    
    <div class="button-container">
      <button id="changeProfileButton">Change Profile</button>
      <button type="button" onClick={handleLoginButton}>Login</button>
    </div>
  </div>
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
