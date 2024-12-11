import React, { useEffect,useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import {getUserProfile,changeUserProfile,loginAnonymous} from './firebaseAuth.js'
import { useLoader } from "./LoaderContext"; 
import { useToast } from './ToastContext';
import {useDialog} from './DialogContext';
import {Login} from '../pages/Login'
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
  useEffect(() => {
    // Kiểm tra thay đổi trong localStorage mỗi 1000ms (1 giây)
    const intervalId = setInterval(() => {
      const newUid = localStorage.getItem("loggedInUserId");
      if (newUid !== uid) {
        setUid(newUid); // Cập nhật lại state nếu có sự thay đổi
      }
    }, 4000);

    // Dọn dẹp khi component unmount
    return () => clearInterval(intervalId);
  }, [uid]); 
  // Hàm chuyển hướng khi menu item được click
  const handleMenuItemClick = (item) => {
    if(item == 'Kimochi'){
      const isConfirm = confirm('Bạn chắc chứ 🤤')
    if(!isConfirm){
      return
    }
    window.location.href = 'https://ihentai.li/'
      return
    }
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
  const [isPopUp,setIsPopUp]=useState(false);
  const handleLoginButton = ()=>{
    setIsPopUp(true);
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
    if(!uid){
      setName("");
      setEmail('');
      setAvt('');
      return
    }
    const data = await getUserProfile(uid);
    if(data == 'yamate'){
      return
    }
    setName(data.displayName);
    setEmail(data.email || 'Ẩn danh');
    setAvt(data.avatar);
  }catch(error){
    alert('user profile'+error);
  }
}

  useEffect(() =>{
    
  isLog();
    if(uid){
      setIsPopUp(false);
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
        alert('change profile'+error)
      }hideLoader();
    }
    const handleLoginAnonymousButton = async()=>{
      try{
        showLoader('Đang đăng nhập ẩn danh')
        await loginAnonymous();
        setUid(localStorage.getItem("loggedInUserId"));
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
      <div className='loginPopUp'
        style={isPopUp ?{display:''}:{display:'none'}}
        >
        <button className='x-button-login' onClick={()=>setIsPopUp(false)}>x</button>
        <Login/>
      </div>
    </div>
  );
};

export default Navbar;
