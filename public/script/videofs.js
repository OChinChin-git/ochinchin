// Import Firestore functions from Firebase SDK
import { getFirestore, getDoc,setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3-atWTI6-LsEWb4N3uTlPQEP2ewgoh7Y",
  authDomain: "thanhchimbe-d29a4.firebaseapp.com",
  projectId: "thanhchimbe-d29a4",
  storageBucket: "thanhchimbe-d29a4.firebasestorage.app",
  messagingSenderId: "6613075327a95",
  appId: "1:661307532795:web:4a211686f935f6d1a2175e"
};

// Khởi tạo Firebase app và Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Khởi tạo Firestore với app đã khởi tạo

// Tạo ID duy nhất cho mỗi video dựa trên URL và title
function generateUniqueId(url, title) {
  return 'video-' + btoa(url + title); // Mã hóa kết hợp URL và title
}

document.addEventListener("click", (event) => {
  // Xử lý khi nhấn nút "Watch" trong phần Movie List
  if (event.target.classList.contains("movie-list-item-button")) {
    const movieItem = event.target.closest(".movie-list-item");
    const videoUrl = event.target.getAttribute("data-video-url");
    const videoTitle = movieItem.querySelector(".movie-list-item-title").textContent;

    // Tạo ID duy nhất cho video dựa trên URL và Title
    const videoId = generateUniqueId(videoUrl, videoTitle);

    // Tạo đối tượng video với các thông tin
    const videoData = {
      id: videoId,
      url: videoUrl,
      title: videoTitle
    };

    // Lưu thông tin video vào Firestore
    setDoc(doc(db, "videos", videoId), videoData) // Sử dụng setDoc và doc để lưu video
      .then(() => {
        console.log("Video đã được lưu vào Firestore!");

        // Chuyển hướng đến trang video.html với videoId
        window.location.href = `video.html?id=${videoId}`;
      })
      .catch((error) => {
        console.error("Lỗi khi lưu video vào Firestore: ", error);
      });
  }

  // Xử lý khi nhấn nút "Watch" trong phần Featured
  if (event.target.classList.contains("featured-button")) {
    const featuredContent = event.target.closest(".featured-content");
    const videoUrl = event.target.getAttribute("data-video-url");
    const videoTitle = featuredContent.querySelector(".featured-title-text").textContent;

    // Tạo ID duy nhất cho video dựa trên URL và Title
    const videoId = generateUniqueId(videoUrl, videoTitle);

    // Tạo đối tượng video với các thông tin
    const videoData = {
      id: videoId,
      url: videoUrl,
      title: videoTitle
    };

    // Lưu thông tin video vào Firestore
    setDoc(doc(db, "videos", videoId), videoData) // Sử dụng setDoc và doc để lưu video
      .then(() => {
        console.log("Video đã được lưu vào Firestore!");

        // Chuyển hướng đến trang video.html với videoId
        window.location.href =  `video.html?id=${videoId}`;
      })
      .catch((error) => {
        console.error("Lỗi khi lưu video vào Firestore: ", error);
      });
  }
});