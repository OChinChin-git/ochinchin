import React, { useEffect, useState,useRef,useCallback } from "react";
import { useLoader } from "../components/LoaderContext"; // Import useLoader từ context
import "../styles/Home.css"
import { useToast } from '../components/ToastContext';
import {
  getFirestore,
  getDocs,
  getDoc,
  collection,
  doc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3-atWTI6-LsEWb4N3uTlPQEP2ewgoh7Y",
  authDomain: "thanhchimbe-d29a4.firebaseapp.com",
  databaseURL: "https://thanhchimbe-d29a4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "thanhchimbe-d29a4",
  storageBucket: "thanhchimbe-d29a4.firebasestorage.app",
  messagingSenderId: "661307532795",
  appId: "1:661307532795:web:4a211686f935f6d1a2175e",
  measurementId: "G-ZKJF0FJ44X"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const Home = () => {
  const [content, setContent] = useState([]); // Lưu nội dung từ Firestore
  const { showLoader, hideLoader } = useLoader(); // Use loader context
  const { showToast } = useToast();
  // Hàm lấy dữ liệu 'order'
  const fetchOrderData = async () => {
    try {
      const docRef = doc(db, "content", "order");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.error("No such document!");
        return {};
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu order:", error);
      return {};
    }
  };

  // Hàm load nội dung dựa trên 'order'
const loadContent = async () => {
  try {
    showLoader("Đang tải, vui lòng chờ..."); // Hiển thị loader với thông báo
    const orderData = await fetchOrderData();

    // Tạo promises để tải đồng thời các mục feature và movieList
    const contentPromises = Object.entries(orderData).map(async ([key, value]) => {
      const [type, ...nameParts] = value.split(" ");
      const name = nameParts.join(" ");

      if (type === "feature") {
        const featureData = await fetchFeatureData(name);
        return featureData ? { type: "feature", data: featureData } : null;
      } else if (type === "movieList") {
        const movieListData = await fetchMovieListData(name);
        return movieListData ? { type: "movieList", data: movieListData } : null;
      } else {
        return null;
      }
    });

    // Chờ tất cả dữ liệu được tải
    const resolvedContent = await Promise.all(contentPromises);
    setContent(resolvedContent.filter((item) => item !== null)); // Loại bỏ null

  } catch (error) {
    console.error("Lỗi khi tải nội dung:", error);
  } finally {
    // Ẩn loader sau khi dữ liệu đã được tải xong
    hideLoader("Chúc bạn 1 ngày vui!", 600); // Bạn có thể điều chỉnh delay ở đây
  }
};

  // Hàm lấy dữ liệu feature
  const fetchFeatureData = async (featureId) => {
    try {
      const docRef = doc(db, "content/type/feature", featureId);
      const docSnap = await getDoc(docRef);

      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error(`Lỗi khi lấy feature ${featureId}:`, error);
      return null;
    }
  };

  // Hàm lấy dữ liệu movie list
  const fetchMovieListData = async (movieListId) => {
    try {
      const docRef = doc(db, "content/type/movieList", movieListId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const videoPromises = (data.videos || []).map(fetchVideoData);

        // Lấy thông tin tất cả video
        const videos = await Promise.all(videoPromises);
        return { ...data, videos: videos.filter((video) => video !== null) };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Lỗi khi lấy movie list ${movieListId}:`, error);
      return null;
    }
  };

  // Hàm lấy dữ liệu video
  const fetchVideoData = async (videoId) => {
    try {
      const docRef = doc(db, "content/type/videos", videoId);
      const docSnap = await getDoc(docRef);

      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error(`Lỗi khi lấy video ${videoId}:`, error);
      return null;
    }
  };

  // Gọi loadContent khi component được render
  useEffect(() => {
    loadContent();
  }, []);

  // Render nội dung
return (
  
  <div className="home-container">
    
    {/* Kiểm tra nếu chưa có nội dung, sẽ hiển thị loader của bạn */}
    {content.length === 0 ? (
      // Không cần div loader nữa vì loader của bạn sẽ hiển thị từ `useLoader`
      null
    ) : (
      content.map((item, index) => {
        if (item.type === "feature") {
          return <Feature key={index} data={item.data} />;
        } else if (item.type === "movieList") {
          return <MovieList key={index} data={item.data} />;
        } else {
          return null;
        }
      })
    )}
  </div>
);

};

// Component hiển thị Feature
const Feature = ({ data }) => {
  const handleWatchVideo = (event)=>{
    const id = event.target.getAttribute("id");
    window.location.href = "/video?" + id;
  }
  return (
    <div
      className="featured-content"
      style={{
        background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)), url('${data.backgroundUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <img className="featured-title" src={data.featuredImgUrl} alt={data.title} loading="lazy" />
      <div className="featured-info">
        <span className="featured-title-text  animated3">{data.title}</span>
        <p className="featured-desc">{data.featuredDesc}</p>
      </div>
      <button className="featured-button" 
        id={data.videoId}
        onClick={handleWatchVideo}
        >
        WATCH
      </button>
    </div>
  );
};


const MovieList = ({ data }) => {
  const { name, videos } = data;
  const movieListRef = useRef(null); // Tham chiếu tới danh sách video
  const [isArrowClickable, setIsArrowClickable] = useState(true); // Trạng thái click mũi tên

    const setArrowCooldown = () => {
      setIsArrowClickable(false);
      setTimeout(() => {
        setIsArrowClickable(true); // Cho phép click lại sau 1 giây
      }, 1000); // Đặt thời gian cooldown là 1 giây
    };
    const handleLeftArrow = useCallback(() => {
      if (!isArrowClickable) return;
      setArrowCooldown();
      const movieList = movieListRef.current;
      const itemWidth = 290;
      const currentX = getCurrentTranslateX(movieList);
      movieList.style.transition = "transform 1s ease-in-out"; 
      if (currentX < 0) {
        movieList.style.transform = `translateX(${currentX + itemWidth}px)`;
      } else {
        movieList.style.transform = "translateX(0)";
      }
    }, [isArrowClickable]);

    const handleRightArrow = useCallback(() => {
      if (!isArrowClickable) return;
       setArrowCooldown(); 
      const movieList = movieListRef.current;
      const itemWidth = 290;
      const containerWidth = movieList.offsetWidth;
      const itemsWidth = videos.length * itemWidth;
      const currentX = getCurrentTranslateX(movieList);
      movieList.style.transition = "transform 1s ease-in-out"; 
      if (Math.abs(currentX) + containerWidth < itemsWidth) {
        movieList.style.transform = `translateX(${currentX - itemWidth}px)`;
      } else {
        movieList.style.transform = "translateX(0)";
      }
    }, [isArrowClickable,videos]);


    // Hàm lấy giá trị translateX hiện tại
    const getCurrentTranslateX = (element) => {
      const matrix = window.getComputedStyle(element).transform;
      if (matrix === "none") return 0;
      const values = matrix.split(",");
      return parseFloat(values[4]) || 0;
    };
    const handleWatchButton = ()=>{
      const id = event.target.getAttribute("video-id");
      window.location.href = "/video?"+id;
    }
  return (
    <div className="movie-list-container">
      {/* Tiêu đề với hiệu ứng */}
      <h1 className="movie-list-title animated4">{name}</h1>

      <div className="movie-list-wrapper">
        {/* Bao bọc video trong "movie-list" */}
        <div className="movie-list" ref={movieListRef}>
          {videos.map((video, index) => (
            <div key={index} className="movie-list-item">
              <img
                className="movie-list-item-img"
                src={video.videoThumbnail}
                alt={video.videoTitle}
                loading="lazy"
              />
              <span className="movie-list-item-title">{video.videoTitle}</span>
              <p className="movie-list-item-desc">{video.videoDescription}</p>
              <button
                className="movie-list-item-button"
                video-id={video.videoId}
                onClick={handleWatchButton}
              >
                Watch
              </button>
            </div>
          ))}
        </div>

        {/* Mũi tên điều hướng */}
        <i
          className="fas fa-chevron-right arrow"
          onClick={handleRightArrow}
        ></i>
        <i
          className="fas fa-chevron-left arrow-left"
          onClick={handleLeftArrow}
        ></i>
      </div>
    </div>
  );
};



export default Home;
