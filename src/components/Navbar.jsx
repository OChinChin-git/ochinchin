import React, { useEffect,useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import {getUserProfile,changeUserProfile,loginAnonymous} from './firebaseAuth.js'
import { useLoader } from "./LoaderContext"; 
import { useToast } from './ToastContext';
import {useDialog} from './DialogContext';
const Navbar = () => {
  const { showLoader, hideLoader } = useLoader(); // Use loader context
  const { showToast } = useToast();
  const { showPrompt } = useDialog();
  const [activeItem, setActiveItem] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); 
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const[isLoggedIn,setIsLoggedIn] = useState(false);
  
  const [uid, setUid] = useState(localStorage.getItem("loggedInUserId"));
  const [avt,setAvt] = useState("");
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
    const isConfirm = confirm("Chuyển đến trang đăng nhập ?")
    if(!isConfirm){
      return
    }
    navigate('/login');
  }

  const isLog=()=>{
if(uid == null){
    setIsLoggedIn(false);
    return
    }
   setIsLoggedIn(true);
}  
const userProfile = async()=>{
  try{
    const data = await getUserProfile(uid);
    if(data == 'yamate'){
      return
    }
    setName(data.displayName);
    setEmail(data.email || 'Ẩn danh');
    setAvt(data.avatar);
  }catch(error){
    alert(error);
  }
}

  useEffect(() =>{
    
  isLog();
        if(!isLoggedIn){
      return
    }
    userProfile();
  },[uid,isLoggedIn])
  
  useEffect(()=>{
    isLog();
    if(!isLoggedIn){
      return
    }
    userProfile();
  },[]);
    const handleLogoutButton = async()=>{
    const isConfirm1 = confirm("Đăng xuất chứ ?")
      if(!isConfirm1){
        return
      }
      localStorage.removeItem("loggedInUserId");
      setIsLoggedIn(false);
      setUid(null);
      setAvt("")
    const isConfirm = confirm("Chuyển đến trang đăng nhập ?")
    if(!isConfirm){
      return
    }
   navigate('/login');
  }
    const changeProfile = async()=>{
      const nameChange = await showPrompt("Nhập tên mới 😎",name);
      const avtChange = await showPrompt("Nhập url avatar mới 😎",avt);
      try{
        showLoader("Đang lưu ...")
        await changeUserProfile(uid,nameChange,avtChange);
        userProfile();
        showToast("Thay đổi thành công","success")
      }catch(error){
        alert(error)
      }hideLoader();
    }
    const handleLoginAnonymousButton = async()=>{
      try{
        showLoader('Đang đăng nhập ẩn danh')
        await loginAnonymous();
        setUid(localStorage.getItem("loggedInUserId"));
        setIsLoggedIn(true);
      }catch(error){
        alert("handle login anonymous"+error)
      }finally{
        hideLoader();
      }
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
          <img className="profile-picture" alt="Profile" src={avt} />
          <div className="profile-text-container">
            <span className="profile-text">Profile</span>
            <div onClick={handleProfileOpen} style={{cursor:"pointer"}}>
            <i className={`fas ${isOpen ?" fa-caret-up":"fa-caret-down"} toggleProfile`}></i>
              </div>
              <div className="dropdownMenu" style={!isOpen ? { display: 'none' } : { display: 'block' }}>
      <div style={!isLoggedIn ?{ display: 'none'} : {display: ''}}>
      <div >Name: <span value={name}>{name}</span></div>
      <div >Email: <span value={email}> {email}</span></div>
      <div className="button-container">
        <button type="button" onClick={changeProfile}>Change Profile</button>
        <button type="button" onClick={handleLogoutButton}>Logout</button>
      </div>
      </div>
      
      <div style={isLoggedIn ?{ display: 'none'} : {display: ''}}>
        <div><span >Chưa đăng nhập </span></div>
      <div className="button-container">
        <button type="button" onClick={handleLoginButton}>Login</button>
        <button type="button" onClick={handleLoginAnonymousButton}>Login Ẩn danh</button>
      </div>
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
