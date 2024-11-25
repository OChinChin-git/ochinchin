import {
  getFirestore,
  getDocs,
  getDoc,
  collection,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  deleteField,
  writeBatch,
  onSnapshot,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3-atWTI6-LsEWb4N3uTlPQEP2ewgoh7Y",
  authDomain: "thanhchimbe-d29a4.firebaseapp.com",
  projectId: "thanhchimbe-d29a4",
  storageBucket: "thanhchimbe-d29a4.firebasestorage.app",
  messagingSenderId: "661307532795",
  appId: "1:661307532795:web:4a211686f935f6d1a2175e",
};

const db = getFirestore();

const renderFeature = (featureData) => {
  const featureHtml = `
    <div class="featured-content" style="background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)), url('${featureData.backgroundUrl}'); background-size: 100%; background-position: center center; background-repeat: no-repeat;">
      <img class="featured-title" src="${featureData.featuredImgUrl}" alt="${featureData.title}" loading="lazy"/>
      <div class="featured-info">
        <span class="featured-title-text animated-title3">${featureData.title}</span>
        <p class="featured-desc">${featureData.featuredDesc}</p>
      </div>
      <button class="featured-button" data-video-url="${featureData.videoUrl}">WATCH</button>
    </div>
  `;
  return featureHtml;
};

// Hàm hiển thị Movie List
const renderMovieList = (videoDataArray) => {
  const movieListHtml = `
    <div class="movie-list-container">
      <h1 class="movie-list-title animated-title1">Movie List</h1>
      <div class="movie-list-wrapper">
        <div class="movie-list">
          ${videoDataArray.map(video => {
            return `
              <div class="movie-list-item">
                <img class="movie-list-item-img" src="${video.videoThumbnail}" alt="${video.videoTitle}" loading="lazy" />
                <span class="movie-list-item-title">${video.videoTitle}</span>
                <p class="movie-list-item-desc">${video.videoDescription}</p>
                <button class="movie-list-item-button" data-video-url="${video.videoUrl}">Watch</button>
              </div>
            `;
          }).join("")}
        </div>
        <i class="fas fa-chevron-right arrow"></i>
        <i class="fas fa-chevron-left arrow-left"></i>
      </div>
    </div>
  `;
  return movieListHtml;
};

// Hàm lấy dữ liệu 'order' từ Firestore (document "order" trong collection "content")
const fetchOrderData = async () => {
  const docRef = doc(db, "content", "order");  // Truy cập document "order" trong collection "content"
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data(); // Trả về các trường trong document "order"
  } else {
    console.log("No such document!");
    return {};  // Nếu không tìm thấy document
  }
};

// Hàm lấy dữ liệu 'feature' từ Firestore theo ID (từ collection "content/type/feature")
const fetchFeatureDataFromFirestore = async (featureId) => {
  const docRef = doc(db, "content/type/feature", featureId); // Truy cập document "featureId" trong collection "content/type/feature"
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data(); // Trả về dữ liệu feature
  } else {
    console.log(`Feature với ID ${featureId} không tìm thấy.`);
    return null;  // Nếu không tìm thấy document
  }
};
// Hàm để load và render tính năng từ Firestore
const loadFeatureContent = async (featureId) => {
  // Lấy dữ liệu từ Firestore
  const featureData = await fetchFeatureDataFromFirestore(featureId);
  if (!featureData) {
    console.log(`Feature với ID ${featureId} không tìm thấy.`);
    return;
  }

  // Render HTML từ dữ liệu tính năng
  const featureHtml = renderFeature(featureData);
  const contentContainer = document.getElementById("content-container");
  contentContainer.innerHTML += featureHtml;  // Thêm vào nội dung của trang
};
// Hàm lấy dữ liệu 'movieList' từ Firestore theo ID (từ collection "content/type/movieLists")
const fetchMovieListDataFromFirestore = async (movieListId) => {
  const docRef = doc(db, "content/type/movieList", movieListId); // Truy cập đúng collection "movieLists"
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data(); // Trả về dữ liệu movieList
  } else {
    console.log(`Movie List với ID ${movieListId} không tìm thấy.`);
    return null;  // Nếu không tìm thấy document
  }
};

// Hàm lấy dữ liệu 'video' từ Firestore chỉ lấy những trường cần thiết
const fetchVideoDataFromFirestore = async (videoId) => {
  const docRef = doc(db, "content/type/videos", videoId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const { videoThumbnail, videoTitle, videoDescription, videoUrl } = docSnap.data(); // Lấy những trường cần thiết
    return { videoThumbnail, videoTitle, videoDescription, videoUrl };
  } else {
    console.log(`Video với ID ${videoId} không tìm thấy.`);
    return null;
  }
};

// Hàm để load và render danh sách phim từ Firestore, sử dụng Promise.all để tải song song
const loadMovieListContent = async (movieListId) => {
  // Lấy dữ liệu từ Firestore cho movieList
  const movieListData = await fetchMovieListDataFromFirestore(movieListId);
  if (!movieListData) {
    console.log(`Movie List với ID ${movieListId} không tìm thấy.`);
    return;
  }

  // Lấy mảng video IDs từ movieList
  const videoIds = movieListData.videos || [];

  // Tạo một mảng các promise lấy video
  const videoPromises = videoIds.map(videoId => fetchVideoDataFromFirestore(videoId));

  // Chờ tất cả các video được tải về
  const videoDataArray = await Promise.all(videoPromises);

  // Lọc các video hợp lệ (không bị lỗi hoặc null)
  const validVideoData = videoDataArray.filter(videoData => videoData !== null);

  // Kiểm tra và render video sau khi đã đối chiếu
  if (validVideoData.length > 0) {
    const movieListHtml = renderMovieList(validVideoData);
    const contentContainer = document.getElementById("content-container");
    contentContainer.innerHTML += movieListHtml;  // Thêm vào nội dung của trang
  } else {
    console.log("Không có video nào trong Movie List.");
  }
};

// Hàm tổng hợp để load tất cả các nội dung
const loadContent = async () => {
  // Lấy dữ liệu order từ Firestore
  const orderData = await fetchOrderData();
  console.log("Dữ liệu Order đã lấy từ Firestore:", orderData);

  const contentContainer = document.getElementById("content-container");

  // Duyệt qua các trường (1, 2, 3, ...) của document `order`
  for (let key in orderData) {
    const entry = orderData[key]; // Ví dụ: "feature abc" hoặc "movieList xyz"
    const [type, name] = entry.split(' '); // Tách ra type ("feature"/"movieList") và name (ID)

    // Xử lý theo type và gọi các hàm tương ứng
    if (type === "feature") {
      // Load và render feature từ Firestore
      await loadFeatureContent(name);
    } else if (type === "movieList") {
      await loadMovieListContent(name);
    }
  }
};
// Gọi hàm loadContent để hiển thị tất cả nội dung
loadContent();
