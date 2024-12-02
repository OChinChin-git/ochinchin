import React, { useEffect, useState } from "react";
import { useLoader } from "../components/LoaderContext"; // Import useLoader từ context

import { useToast } from '../components/ToastContext';
import {
  getFirestore,
  getDocs,
  getDoc,
  collection,
  doc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC3-atWTI6-LsEWb4N3uTlPQEP2ewgoh7Y",
  authDomain: "thanhchimbe-d29a4.firebaseapp.com",
  projectId: "thanhchimbe-d29a4",
  storageBucket: "thanhchimbe-d29a4.firebasestorage.app",
  messagingSenderId: "661307532795",
  appId: "1:661307532795:web:4a211686f935f6d1a2175e",
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
    showToast("Hello tôi là ochinchin, chào mừng bạn đến với trang web của tôi");
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
    <link href="/src/styles/Home.css" rel="stylesheet"/>
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
      <button className="featured-button" data-video-url={data.videoUrl}>
        WATCH
      </button>
    </div>
  );
};

// Component hiển thị danh sách Movie
const MovieList = ({ data }) => {
  const { name, videos } = data;

  return (
    <div className="movie-list-container">
      {/* Tiêu đề với hiệu ứng */}
      <h1 className="movie-list-title animated4">{name}</h1>

      <div className="movie-list-wrapper">
        {/* Bao bọc video trong "movie-list" */}
        <div className="movie-list">
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
              <button className="movie-list-item-button" data-video-url={video.videoUrl}>
                Watch
              </button>
            </div>
          ))}
        </div>

        {/* Mũi tên điều hướng */}
        <i className="fas fa-chevron-right arrow"></i>
        <i className="fas fa-chevron-left arrow-left"></i>
      </div>
    </div>
  );
};
export default Home;
