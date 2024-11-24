// Khai báo biến toàn cục
let videoUrl = ''; 
let videoTitle = ''; 

// Lấy video ID từ query string trên URL
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get('id');  // Lấy videoId từ query string, nếu có

showLoader();  // Hiển thị loader khi bắt đầu tải dữ liệu

if (videoId) {
  const videoDocRef = doc(db, "videos", videoId);  // Truy vấn video theo videoId
  getDoc(videoDocRef).then((docSnap) => {
    if (docSnap.exists()) {
      const videoData = docSnap.data();  // Lấy dữ liệu video từ Firestore

      videoUrl = videoData.url;  // Lấy URL video
      videoTitle = videoData.title;  // Lấy tiêu đề video

      // Cập nhật tiêu đề video lên trang
      document.getElementById('video-title').textContent = videoTitle;  // Cập nhật tiêu đề

      // Cập nhật video trên trang
      updateVideo(videoUrl);

      hideLoader();  // Ẩn loader sau khi dữ liệu đã được tải
    } else {
      alert("Không tìm thấy video trong Firestore.");
      hideLoader();  // Ẩn loader nếu không tìm thấy video
    }
  }).catch((error) => {
    console.error("Lỗi khi lấy dữ liệu video: ", error);
    hideLoader();  // Ẩn loader nếu có lỗi
  });
} else {
  alert("Không có ID video trong URL.");
  hideLoader();  // Ẩn loader nếu không có videoId
}

// Chuyển đổi URL YouTube thành URL nhúng
function convertToEmbedUrl(url) {
  const youtubeRegEx = /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:live\/|watch\?v=|embed\/|v\/|shorts\/|.*[?&]v=)|youtu\.be\/))([a-zA-Z0-9_-]{11})/;
  const match = url.match(youtubeRegEx);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`; // Trả về URL nhúng YouTube
  }
  return url;  // Nếu không phải URL YouTube, giữ nguyên URL ban đầu
}

// Kiểm tra và xử lý videoUrl nếu là Pornhub
function convertPornhubToEmbedUrl(url) {
  const pornhubRegEx = /^https:\/\/(?:[a-zA-Z0-9-]+\.)?pornhub\.com\/view_video\.php\?viewkey=([a-zA-Z0-9_-]+)/;
  const pornhubMatch = url.match(pornhubRegEx);
  
  if (pornhubMatch && pornhubMatch[1]) {
    const videoKey = pornhubMatch[1];
    return `https://www.pornhub.com/embed/${videoKey}`;  // Cập nhật URL nhúng cho Pornhub
  }
  return url; // Nếu không phải Pornhub URL, giữ nguyên URL ban đầu
}

// Cập nhật thông tin video
function updateVideo(videoUrl) {
  const videoIframe = document.getElementById('video-iframe');
  let embedUrl = convertToEmbedUrl(videoUrl); // Xử lý URL YouTube trước

  embedUrl = convertPornhubToEmbedUrl(embedUrl); // Nếu là Pornhub, chuyển đổi thành URL nhúng
  videoIframe.src = embedUrl;  // Cập nhật nguồn video iframe
}

// Hàm hiển thị loader
function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.remove("hidden"); // Hiển thị loader
  }
}

// Hàm ẩn loader
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("hidden"); // Ẩn loader
  }
}
