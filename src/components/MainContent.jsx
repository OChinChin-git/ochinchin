import React, { lazy, Suspense,useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import { useLoader } from './LoaderContext'; // Import useLoader từ context
import Loader from './Loader'; // Import component Loader của bạn

const Edm = lazy(() => import('../pages/Edm'));
const EdmTest = lazy(() => import('../pages/EdmTest'));
const Content = lazy(() => import('../pages/AddContent'));
const ShortenLink = lazy(() => import('../pages/ShortenLink'));
const Kimochi = lazy(() => import('../pages/Kimochi'));
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Video = lazy(() => import('../pages/Video'));
const Room =lazy(()=> import('../pages/Room'));
const Quest = lazy(()=> import('../pages/Quest'))
import "../styles/MainContent.css";
import '../styles/Button.css';

const MainContent = ({ navbarRef }) => {
  const { showLoader, hideLoader } = useLoader(); // Lấy hàm từ context để hiển thị và ẩn loader

  // Hàm kích hoạt loader khi trang đang tải
  const handleRouteChange = () => {
    showLoader("Đang tải..."); // Hiển thị loader với thông điệp "Đang tải..."
  };
  useEffect(()=>{
    Number(localStorage.getItem('coin')) || 0;
    const interval = setInterval(()=>{
      const coin = Number(localStorage.getItem('coin')) +1 || 1;;
      localStorage.setItem('coin',coin);
    },1000)
    return()=> clearInterval(interval)
  },[])
  return (
    <div className="container">
      <div className="content-container">
        {/* Sử dụng Suspense để bọc Routes với fallback là loader */}
        <Suspense fallback={<Loader message="Đang tải..." isVisible={true} />}>
          <Routes>
            <Route
              path="/edm"
              element={<Edm />}
              onEnter={handleRouteChange}  // Lấy sự kiện để kích hoạt loader khi vào route này
            />
            <Route
              path="/edmtest"
              element={<EdmTest />}
              onEnter={handleRouteChange}  // Lấy sự kiện để kích hoạt loader khi vào route này
            />
            <Route path="/content" element={<Content />} />
            <Route path="/link" element={<ShortenLink />} />
            <Route path="/kimochi" element={<Kimochi />} />
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/video" element={<Video />} />
            <Route path="/room" element={<Room/>} />
            <Route path='/quest' element={<Quest navbarRef={navbarRef}/>}/>
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default MainContent;
