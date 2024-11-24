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

document.addEventListener("DOMContentLoaded", () => {
  const contentTypeSelect = document.getElementById("content-type");
  const featureSection = document.getElementById("feature-section");
  const movieListSection = document.getElementById("movie-list-section");
  const orderSection = document.getElementById("order-content-section");
  const videoManagerSection = document.getElementById("video-manager-section");
  const deleteContent = document.getElementById("delete-container");

  // Đảm bảo 'content-type' có giá trị mặc định là 'feature'
  if (contentTypeSelect.value === "") {
    contentTypeSelect.value = "feature";
  }

  // Hiển thị phần nội dung tương ứng ngay khi trang tải
  handleContentVisibility(contentTypeSelect.value);

  // Xử lý sự kiện khi chọn loại nội dung
  contentTypeSelect.addEventListener("change", (event) => {
    const selectedType = event.target.value;
    handleContentVisibility(selectedType);
  });

  // Hàm xử lý việc hiển thị và ẩn các phần nội dung
  function handleContentVisibility(selectedType) {
    // Ẩn tất cả các phần
    featureSection.classList.remove("active");
    movieListSection.classList.remove("active");
    orderSection.style.display = "none"; // Ẩn phần order
    deleteContent.style.display = "none";
    videoManagerSection.classList.remove("active");

    // Hiển thị phần tương ứng với loại nội dung được chọn
    if (selectedType === "feature") {
      featureSection.classList.add("active");
    } else if (selectedType === "movie-list") {
      movieListSection.classList.add("active");
    } else if (selectedType === "order") {
      orderSection.style.display = "block"; // Hiển thị phần order
      loadOrderContent(); // Gọi hàm loadOrderContent để tải dữ liệu vào bảng
    } else if (selectedType === "add-video") {
      videoManagerSection.classList.add("active");
    } else if (selectedType === "delete") {
      deleteContent.style.display = "block"; // Hiển thị phần order
    }
  }
});

/**
 * Hàm kiểm tra xem tài liệu có tồn tại trong Firestore không.
 */
async function checkIfDocExists(collectionPath, docId) {
  try {
    const docRef = doc(db, collectionPath, docId); // Tham chiếu đến tài liệu
    const docSnap = await getDoc(docRef); // Lấy tài liệu từ Firestore

    if (docSnap.exists()) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

/**
 * Hàm lưu tài liệu vào Firestore, có thể ghi đè nếu cần.
 */
async function saveDoc(collectionPath, docId, data) {
  try {
    const exists = await checkIfDocExists(collectionPath, docId); // Kiểm tra tài liệu đã tồn tại
    if (exists) {
      const confirmOverwrite = confirm(
        "Tài liệu đã tồn tại. Bạn có muốn ghi đè không?"
      );
      if (!confirmOverwrite) {
        alert("Lưu tài liệu bị hủy.");
        return;
      }
    }

    const docRef = doc(db, collectionPath, docId); // Tham chiếu đến tài liệu
    await setDoc(docRef, data); // Lưu dữ liệu vào Firestore
    showToast("Lưu thành công");
    // Tham chiếu đến các select
    const selectMovieList = document.getElementById("select-movie-list");
    const selectFeature = document.getElementById("select-feature");
    const selectExistingVideo = document.getElementById(
      "select-existing-video"
    );
    const videoDropdown = document.getElementById("video-dropdown");
    const addVideoList = document.getElementById("add-video-to-list");
    // Tải dữ liệu vào các select
    loadMovieListOptions(selectMovieList);
    loadVideoOptions(videoDropdown);
    loadFeatureOptions(selectFeature);
    loadVideoOptions(selectExistingVideo);
    loadVideoOptions(addVideoList);
  } catch (error) {
    alert(`Lỗi khi lưu tài liệu: ${error.message}`);
  }
}

//
//
//
// Hàm xử lý một URL (chuyển thành thumbnail nếu là YouTube)
function processURL(url) {
  if (url && isYouTubeURL(url)) {
    showToast("Chuyển đổi thành công: " + url); // Thông báo trước khi trả về thumbnail
    return getYouTubeThumbnail(url); // Trả về thumbnail nếu là YouTube
  }
  return url; // Trả về URL gốc nếu không phải YouTube
}

// Hàm kiểm tra URL có phải là YouTube hay không (bao gồm cả youtu.be và youtube.com)
function isYouTubeURL(url) {
  const youtubePattern = /^(https?\:\/\/)?(www\.)?(youtube|youtu)\.(com|be)\//;
  if (youtubePattern.test(url)) {
    showToast("Là link YouTube, thử chuyển đổi");
    return true; // URL là YouTube
  }
  return false; // URL không phải YouTube
}

// Hàm lấy thumbnail của YouTube từ URL
function getYouTubeThumbnail(url) {
  let videoId = null;

  // Kiểm tra URL của YouTube theo các định dạng khác nhau
  const match1 = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/); // Kiểu URL: youtube.com/watch?v=videoId
  if (match1) {
    videoId = match1[1];
  }

  const match2 = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/); // Kiểu URL: youtu.be/videoId
  if (match2) {
    videoId = match2[1];
  }

  const match3 = url.match(/youtube\.com\/.*\/([a-zA-Z0-9_-]{11})/); // Kiểu URL: youtube.com/videoId (dạng URL ngắn)
  if (match3) {
    videoId = match3[1];
  }

  const match4 = url.match(/youtube\.com\/.*\/live\/([a-zA-Z0-9_-]{11})/); // Kiểu URL: youtube.com/live/videoId (dành cho livestreams)
  if (match4) {
    videoId = match4[1];
  }

  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; // Trả về URL thumbnail
  }

  showToast("Không thể chuyển đổi: " + url); // Thông báo không thể chuyển đổi nếu không tìm thấy video ID
  return url; // Nếu không phải YouTube, trả lại URL gốc
}

// Hàm kiểm tra và kiểm soát tính hợp lệ của Document ID
function isValidDocumentID(name) {
  const invalidPattern = /[/.#$[\]]/;
  return !invalidPattern.test(name); // Trả về true nếu tên hợp lệ, false nếu không hợp lệ
}
/**
 * Hàm xử lý khi nhấn nút "Lưu Video"
 */
async function handleSaveVideo(event) {
  event.preventDefault(); // Ngăn hành vi mặc định của form (không tải lại trang)

  // Lấy thông tin từ form
  const videoName = document.getElementById("videoName").value.trim();
  const videoTitle = document.getElementById("videoTitle").value.trim();
  const videoDescription = document
    .getElementById("videoDescription")
    .value.trim();
  const videoThumbnail = document.getElementById("videoThumbnail").value.trim();
  const videoUrl = document.getElementById("videoUrl").value.trim();

  if (!isValidDocumentID(videoName)) {
    showToast("Tên tài liệu không hợp lệ.");
    return; // Dừng lại nếu tên không hợp lệ
  }

  const processedThumbnailUrl = processURL(videoThumbnail);

  // Tạo đối tượng dữ liệu video
  const videoData = {
    videoName: videoName,
    videoTitle: videoTitle,
    videoDescription: videoDescription,
    videoThumbnail: processedThumbnailUrl,
    videoUrl: videoUrl,
  };

  try {
    await saveDoc("content/type/videos", videoName, videoData);

    document.getElementById("new-video-form").reset(); // Reset form
    document.getElementById("select-existing-video").selectedIndex = 0; // Reset select
  } catch (error) {
    alert("Có lỗi xảy ra khi lưu video: " + error.message);
  }
}

document
  .getElementById("new-video-form")
  .addEventListener("submit", handleSaveVideo); // Gọi hàm handleSaveVideo thay vì saveFeature

//
//
//
//
// Hàm lưu Feature vào Firestore
async function saveFeature(event) {
  event.preventDefault(); // Ngừng hành động mặc định của form

  const featureName = event.target.featureName.value;
  const title = event.target.title.value;
  const videoUrl = event.target.featureVideoUrl.value;
  const backgroundUrl = event.target.backgroundUrl.value;
  const featuredImgUrl = event.target.featuredImgUrl.value;
  const featuredDesc = event.target.featuredDesc.value;

  // Kiểm tra tính hợp lệ của tên tài liệu
  if (!isValidDocumentID(featureName)) {
    showToast("Tên tài liệu không hợp lệ.");
    return; // Dừng lại nếu tên không hợp lệ
  }

  // Xử lý các URL
  const processedFeaturedImgUrl = processURL(featuredImgUrl);
  const processedBackgroundUrl = processURL(backgroundUrl);

  // Tạo đối tượng dữ liệu cho Feature
  const featureData = {
    title: title,
    videoUrl: videoUrl,
    backgroundUrl: processedBackgroundUrl,
    featuredImgUrl: processedFeaturedImgUrl,
    featuredDesc: featuredDesc,
  };

  // Sử dụng hàm saveDoc để lưu dữ liệu
  await saveDoc("content/type/feature", featureName, featureData); // Ghi vào Firestore

  document.getElementById("new-feature-form").reset(); // Reset form
  document.getElementById("select-feature").selectedIndex = 0; // Reset select
}

// Lắng nghe sự kiện khi người dùng submit form
document
  .getElementById("new-feature-form")
  .addEventListener("submit", saveFeature);
//
//
//
//

// Lấy giá trị hiện tại từ Firestore
async function getCurrentValuesFromFirestore(orderRef) {
  const orderDoc = await getDoc(orderRef);
  if (!orderDoc.exists()) return [];

  const data = orderDoc.data();
  return Object.keys(data).map((key) => data[key]);
}

// Lấy giá trị mới từ các collections
async function getNewValues() {
  const featureCollectionRef = collection(db, "content/type/feature");
  const movieListCollectionRef = collection(db, "content/type/movieList");

  const [featureDocs, movieListDocs] = await Promise.all([
    getDocs(featureCollectionRef),
    getDocs(movieListCollectionRef),
  ]);

  const newValues = [];

  featureDocs.forEach((doc) => {
    newValues.push(`feature ${doc.id}`);
  });

  movieListDocs.forEach((doc) => {
    newValues.push(`movieList ${doc.id}`);
  });

  return newValues;
}

// Hàm cập nhật Firestore với thứ tự giá trị đã xử lý
async function updateFirestore(orderRef, finalValues) {
  let updatedData = {};

  // Duyệt qua danh sách giá trị đã xử lý để tạo lại các field
  finalValues.forEach((value, index) => {
    updatedData[index + 1] = value; // Field là số thứ tự (1, 2, 3, ...)
  });

  // Ghi đè toàn bộ dữ liệu vào Firestore
  await setDoc(orderRef, updatedData);
}

// Hàm đồng bộ dữ liệu
async function syncOrderData() {
  try {
    const orderRef = doc(db, "content", "order"); // Tham chiếu tới tài liệu `order`

    // Lấy giá trị hiện tại từ Firestore
    const currentValues = await getCurrentValuesFromFirestore(orderRef);

    // Lấy các giá trị mới từ feature và movieList
    const newValues = await getNewValues();

    // Dò và xử lý các giá trị
    let finalValues = [];

    // 1. Giữ nguyên giá trị có trong currentValues và newValues
    currentValues.forEach((value) => {
      if (newValues.includes(value)) {
        finalValues.push(value);
      }
    });

    // 2. Thêm các giá trị mới vào cuối
    newValues.forEach((value) => {
      if (!currentValues.includes(value)) {
        finalValues.push(value);
      }
    });

    // Cập nhật Firestore với danh sách giá trị đã xử lý
    await updateFirestore(orderRef, finalValues);

    console.log("Dữ liệu đã đồng bộ thành công!");
    showToast("Dữ liệu đã được đồng bộ thành công!");
  } catch (error) {
    console.error("Lỗi khi đồng bộ dữ liệu:", error);
    showToast("Đã xảy ra lỗi khi đồng bộ dữ liệu!");
  }
}

// Lắng nghe sự kiện 'keydown' toàn trang
document.addEventListener("keydown", (event) => {
  if (event.key === "o" || event.key === "O") {
    // Kiểm tra nếu phím "o" (hoặc "O") được nhấn
    syncOrderData();
  }
});
//
//
// Thêm sự kiện để đổi vị trí hàng khi nhấn
//
//
function addDragAndDropHandlers() {
  // Lấy tất cả các dòng trong bảng "order-table-body"
  const orderRows = document.querySelectorAll("#order-table-body tr");

  // Lấy tất cả các dòng trong bảng "movie-list-table"
  const movieListRows = document.querySelectorAll("#movie-list-table tbody tr");

  // Thêm sự kiện click cho các dòng trong bảng "order-table-body"
  orderRows.forEach((row) => {
    row.addEventListener("click", rowClick); // Thêm sự kiện click
  });

  // Thêm sự kiện click cho các dòng trong bảng "movie-list-table"
  movieListRows.forEach((row) => {
    row.addEventListener("click", rowClick); // Thêm sự kiện click
  });
}

let draggedRow = null; // Lưu hàng đang được chọn

// Khi nhấn vào một hàng
function rowClick(event) {
  const clickedRow = event.target.closest("tr");

  if (!draggedRow) {
    // Lưu hàng đầu tiên khi nhấn
    draggedRow = clickedRow;
    draggedRow.style.opacity = 0.5; // Giảm độ mờ của hàng đang chọn
    draggedRow.classList.add("highlight"); // Thêm hiệu ứng nổi bật cho hàng đầu tiên
  } else if (draggedRow !== clickedRow) {
    // Khi nhấn vào hàng thứ 2, đổi vị trí nếu không phải hàng đầu tiên
    const tbody = draggedRow.parentNode;
    const rows = Array.from(tbody.children);

    // Xác định vị trí đúng cho hàng
    if (rows.indexOf(clickedRow) < rows.indexOf(draggedRow)) {
      tbody.insertBefore(draggedRow, clickedRow); // Di chuyển hàng lên trên
    } else {
      tbody.insertBefore(draggedRow, clickedRow.nextSibling); // Di chuyển hàng xuống dưới
    }

    // Sau khi di chuyển, thêm viền xanh cho hàng thứ 2 và ẩn viền xanh của hàng đầu tiên
    clickedRow.classList.add("highlight"); // Thêm viền xanh cho hàng thứ 2
    draggedRow.classList.remove("highlight"); // Ẩn viền xanh của hàng đầu tiên

    draggedRow.style.opacity = 1; // Khôi phục độ mờ của hàng sau khi thay đổi

    // Ẩn viền xanh ngay lập tức sau khi đổi vị trí
    setTimeout(() => {
      clickedRow.classList.remove("highlight"); // Ẩn viền xanh sau khi đổi xong
    }, 200); // Thời gian chờ 200ms trước khi ẩn viền xanh

    draggedRow = null; // Đặt lại biến draggedRow sau khi hoàn thành
  }
}

//
//
//Hàm load order
//
//
async function loadOrderContent() {
  try {
    const orderRef = doc(db, "content", "order");
    const orderDoc = await getDoc(orderRef);

    if (orderDoc.exists()) {
      const orderData = orderDoc.data() || {}; // Lấy dữ liệu orderData từ Firestore

      const tbody = document.getElementById("order-table-body");
      tbody.innerHTML = ""; // Xóa các hàng cũ

      if (Object.keys(orderData).length === 0) {
        showToast("Không có dữ liệu để tải.");
        return; // Nếu không có dữ liệu thì dừng hàm
      }

      // Duyệt qua các key và giá trị trong orderData
      Object.keys(orderData).forEach((key) => {
        const value = orderData[key]; // Lấy giá trị theo key, không cần là object nữa
        const row = document.createElement("tr");
        row.draggable = true; // Cho phép kéo thả

        // Kiểm tra nếu giá trị là chuỗi bắt đầu với 'feature' hoặc 'movieList'
        if (value.startsWith("feature")) {
          row.innerHTML = `
            <td>Feature</td>
            <td>${value.replace("feature ", "")}</td>
          `;
        } else if (value.startsWith("movieList")) {
          row.innerHTML = `
            <td>Movie List</td>
            <td>${value.replace("movieList ", "")}</td>
          `;
        }

        // Thêm dòng vào bảng
        tbody.appendChild(row);
      });

      addDragAndDropHandlers(); // Thêm chức năng kéo thả vào các hàng
      showToast("Dữ liệu đã được tải thành công!");
    } else {
      showToast("Không tìm thấy tài liệu trong Firestore.");
    }
  } catch (error) {
    console.error("Error loading order content:", error);
    showToast("Đã xảy ra lỗi khi tải dữ liệu.");
  }
}

//
//
//save
async function saveOrder() {
  try {
    const orderData = {};
    const rows = document.querySelectorAll("#order-table-body tr");

    rows.forEach((row, index) => {
      const cells = row.getElementsByTagName("td");
      let type = cells[0].innerText.trim(); // Lấy nội dung từ cột đầu tiên ("Feature" hoặc "Movie List")
      const id = cells[1].innerText.trim(); // Lấy nội dung từ cột thứ hai (ID của feature hoặc movieList)

      // Thay đổi giá trị của 'type' nếu là "Feature" hoặc "Movie List"
      if (type === "Feature") {
        type = "feature"; // Thay "Feature" thành "feature"
      } else if (type === "Movie List") {
        type = "movieList"; // Thay "Movie List" thành "movieList"
      }

      // Lưu vào orderData với key là thứ tự dòng (index + 1)
      orderData[index + 1] = `${type} ${id}`; // Lưu theo dạng "feature abc" hoặc "movieList xyz"
    });

    showToast("Dữ liệu orderData:", orderData);

    // Lấy tham chiếu đến tài liệu `order`
    const orderRef = doc(db, "content", "order");

    // Cập nhật orderData vào Firestore mà không ghi đè các khóa cũ
    await setDoc(orderRef, orderData, { merge: true });

    showToast("Dữ liệu đã được lưu thành công!");
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu:", error);
    showToast("Đã xảy ra lỗi khi lưu dữ liệu!");
  }
}
//
document.getElementById("save-order-btn").addEventListener("click", () => {
  saveOrder(); // Gọi hàm saveOrder khi nhấn nút
});
async function saveMovieList() {
  event.preventDefault(); // Ngừng hành động mặc định của form
  const movieListTable = document.querySelector("#movie-list-table tbody");
  const movieList = [];

  // Duyệt qua các hàng trong bảng và lấy Video ID
  Array.from(movieListTable.children).forEach((row) => {
    movieList.push(row.dataset.videoId);
  });

  if (movieList.length === 0) {
    showToast("Danh sách Movie không có video.");
    return;
  }

  const movieListName = document.querySelector(
    'input[name="movieListName"]'
  ).value;
  const listName = document.querySelector('input[name="listName"]').value;

  // Kiểm tra thông tin đầu vào
  if (!movieListName || !listName) {
    showToast("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  // Dữ liệu sẽ được lưu vào Firestore
  const movieListData = {
    name: listName,
    videos: movieList,
    createdAt: new Date(), // Thời gian tạo
  };

  // Sử dụng hàm saveDoc để lưu vào Firestore
  await saveDoc("content/type/movieList", movieListName, movieListData);
  document.getElementById("new-movie-list-form").reset(); // Reset form
  document.getElementById("load-movie-list").selectedIndex = 0; // Reset select
  document.querySelector("#movie-list-table tbody").innerHTML = ""; // Reset bảng Movie List
}
document
  .getElementById("new-movie-list-form")
  .addEventListener("submit", saveMovieList);

/*
 *load list
 */
async function loadMovieListOptions(selectElement) {
  try {
    // Đảm bảo danh sách bắt đầu với tùy chọn "New"
    selectElement.innerHTML = '<option value="new">New</option>';

    const movieListCollectionRef = collection(db, "content/type/movieList");
    const movieListDocs = await getDocs(movieListCollectionRef);

    // Thêm các giá trị từ Firestore vào select
    movieListDocs.forEach((doc) => {
      const option = document.createElement("option");
      option.value = doc.id; // Sử dụng ID làm value
      option.textContent = doc.id; // Hiển thị tên của movie list
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("Lỗi tải danh sách movie list từ Firestore:", error);
  }
}

async function loadFeatureOptions(selectElement) {
  try {
    // Đảm bảo danh sách bắt đầu với tùy chọn "New"
    selectElement.innerHTML = '<option value="new">New</option>';

    const featureCollectionRef = collection(db, "content/type/feature");
    const featureDocs = await getDocs(featureCollectionRef);

    // Thêm các giá trị từ Firestore vào select
    featureDocs.forEach((doc) => {
      const option = document.createElement("option");
      option.value = doc.id; // Sử dụng ID làm value
      option.textContent = doc.id; // Hiển thị tên của feature
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("Lỗi tải danh sách feature từ Firestore:", error);
  }
}

async function loadVideoOptions(selectElement) {
  try {
    // Đảm bảo danh sách bắt đầu với tùy chọn "New"
    selectElement.innerHTML = '<option value="new">New</option>';

    // Lấy tham chiếu đến bộ sưu tập videos trong Firestore
    const videoCollectionRef = collection(db, "content/type/videos");
    const videoDocs = await getDocs(videoCollectionRef);

    // Thêm các video từ Firestore vào select
    videoDocs.forEach((doc) => {
      const option = document.createElement("option");
      option.value = doc.id; // Sử dụng ID làm giá trị của option
      option.textContent = doc.data().videoName || doc.id; // Hiển thị tên video hoặc ID nếu tên không có
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("Lỗi tải danh sách video từ Firestore:", error);
  }
}
// Tham chiếu đến các select
const selectMovieList = document.getElementById("select-movie-list");
const selectFeature = document.getElementById("select-feature");
const selectExistingVideo = document.getElementById("select-existing-video");
const videoDropdown = document.getElementById("video-dropdown");
const addVideoList = document.getElementById("add-video-to-list");
// Tải dữ liệu vào các select
loadMovieListOptions(selectMovieList);
loadVideoOptions(videoDropdown);
loadFeatureOptions(selectFeature);
loadVideoOptions(selectExistingVideo);
loadVideoOptions(addVideoList);
//
//
//
// Hàm tải dữ liệu Feature từ Firestore
async function loadFeatureData(selectedFeature) {
  if (selectedFeature === "new") {
    // Làm trống các ô nhập liệu trong Feature
    document.querySelector("input[name='featureName']").value = "";
    document.querySelector("input[name='title']").value = "";
    document.querySelector("input[name='featureVideoUrl']").value = "";
    document.querySelector("input[name='backgroundUrl']").value = "";
    document.querySelector("input[name='featuredImgUrl']").value = "";
    document.querySelector("input[name='featuredDesc']").value = "";
    showToast("Các ô Feature đã được làm trống.");
  } else if (selectedFeature) {
    try {
      // Truy vấn dữ liệu từ Firestore
      const docRef = doc(db, "content/type/feature", selectedFeature);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const feature = docSnap.data();

        // Cập nhật các trường trong form với dữ liệu từ Firestore
        document.querySelector("input[name='featureName']").value =
          selectedFeature;
        document.querySelector("input[name='title']").value =
          feature.title || "";
        document.querySelector("input[name='featureVideoUrl']").value =
          feature.videoUrl || "";
        document.querySelector("input[name='backgroundUrl']").value =
          feature.backgroundUrl || "";
        document.querySelector("input[name='featuredImgUrl']").value =
          feature.featuredImgUrl || "";
        document.querySelector("input[name='featuredDesc']").value =
          feature.featuredDesc || "";
      } else {
        showToast("Không tìm thấy Feature đã chọn.");
      }
    } catch (error) {
      console.error("Lỗi tải Feature từ Firestore:", error);
    }
    showToast("Load thành công feature: " + selectedFeature);
  } else {
    showToast("Vui lòng chọn Feature.");
  }
}
// Lắng nghe sự kiện khi người dùng nhấn nút "Tải Feature"
document.getElementById("load-feature").addEventListener("click", async () => {
  const selectFeature = document.getElementById("select-feature");
  const selectedFeature = selectFeature.value;

  // Gọi hàm loadFeatureData để xử lý tải dữ liệu
  await loadFeatureData(selectedFeature);
});
//
async function loadVideoData(selectedVideo) {
  if (selectedVideo === "new") {
    // Làm trống các ô nhập liệu trong Video
    document.querySelector("input[name='videoName']").value = "";
    document.querySelector("input[name='videoTitle']").value = "";
    document.querySelector("input[name='videoUrl']").value = "";
    document.querySelector("input[name='videoThumbnail']").value = "";
    document.querySelector("input[name='videoDescription']").value = "";
    showToast("Các ô Video đã được làm trống.");
  } else if (selectedVideo) {
    try {
      // Truy vấn dữ liệu từ Firestore
      const docRef = doc(db, "content/type/videos", selectedVideo);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const video = docSnap.data();

        // Cập nhật các trường trong form với dữ liệu từ Firestore
        document.querySelector("input[name='videoName']").value = selectedVideo;
        document.querySelector("input[name='videoTitle']").value =
          video.videoTitle || "";
        document.querySelector("input[name='videoUrl']").value =
          video.videoUrl || "";
        document.querySelector("input[name='videoThumbnail']").value =
          video.videoThumbnail || "";
        document.querySelector("input[name='videoDescription']").value =
          video.videoDescription || "";
      } else {
        showToast("Không tìm thấy Video đã chọn.");
      }
    } catch (error) {
      console.error("Lỗi tải video từ Firestore:", error);
      showToast("Lỗi khi tải video.");
    }
    showToast("Load thành công video: " + selectedVideo);
  } else {
    showToast("Vui lòng chọn Video.");
  }
}

// Lắng nghe sự kiện khi người dùng nhấn nút "Tải Video"
document.getElementById("load-video").addEventListener("click", async () => {
  const selectVideo = document.getElementById("select-existing-video");
  const selectedVideo = selectVideo.value;
  // Gọi hàm loadVideoData để xử lý tải dữ liệu
  await loadVideoData(selectedVideo);
});

async function loadVideoDataForFeature(selectedVideo) {
  if (selectedVideo === "new") {
    // Làm trống các ô nhập liệu trong video cho phần Feature
    document.querySelector("input[name='featureVideoUrl']").value = "";
    document.querySelector("input[name='backgroundUrl']").value = "";
    document.querySelector("input[name='featuredImgUrl']").value = "";
    document.querySelector("input[name='featuredDesc']").value = "";
    showToast("Các ô video trong Feature đã được làm trống.");
  } else if (selectedVideo) {
    try {
      // Truy vấn dữ liệu từ Firestore
      const docRef = doc(db, "content/type/videos", selectedVideo);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const video = docSnap.data();

        // Cập nhật các trường trong form Feature với dữ liệu từ Video
        document.querySelector("input[name='featureVideoUrl']").value =
          video.videoUrl || "";
        document.querySelector("input[name='backgroundUrl']").value =
          video.videoThumbnail || ""; // Ví dụ background là thumbnail
        document.querySelector("input[name='featuredImgUrl']").value =
          video.videoThumbnail || ""; // Ví dụ featured image là thumbnail
        document.querySelector("input[name='featuredDesc']").value =
          video.videoTitle || "";
        showToast("Thông tin video đã được tải vào Feature.");
      } else {
        showToast("Không tìm thấy Video đã chọn.");
      }
    } catch (error) {
      console.error("Lỗi tải video từ Firestore:", error);
      alert(
        "Có lỗi khi tải video. Vui lòng kiểm tra console để biết thêm chi tiết."
      );
      showToast("Lỗi khi tải video.");
    }
    showToast("Load thành công video: " + selectedVideo);
  } else {
    showToast("Vui lòng chọn Video.");
  }
}
// Lắng nghe sự kiện khi người dùng chọn video trong feature
document
  .getElementById("video-dropdown")
  .addEventListener("change", async (event) => {
    const selectedVideo = event.target.value;
    await loadVideoDataForFeature(selectedVideo);
  });
// Thêm video vào danh sách
async function addVideoToList(selectedVideo) {
  if (selectedVideo === "new") {
    const isConfirmed = confirm(
      "Thêm video mới, chuyển sang trang thêm video?"
    );
    if (!isConfirmed) {
      return; // Người dùng hủy xác nhận
    } else {
      // Chuyển đến trang thêm video bằng cách thay đổi giá trị select
      const contentTypeSelect = document.getElementById("content-type");
      contentTypeSelect.value = "add-video"; // Chọn mục "Video"

      // Gọi sự kiện change để áp dụng hành động tương ứng
      const event = new Event("change");
      contentTypeSelect.dispatchEvent(event);
    }
  } else {
    const movieListTable = document.querySelector("#movie-list-table tbody");

    // Kiểm tra xem video đã tồn tại chưa trong bảng
    if (
      Array.from(movieListTable.children).some(
        (row) => row.dataset.videoId === selectedVideo
      )
    ) {
      const isConfirmedAdd = confirm(
        "Video đã tồn tại, bạn có muốn thêm lần nữa?"
      );
      if (!isConfirmedAdd) {
        showToast("Đã hủy thêm video trùng");
        return; // Người dùng hủy xác nhận
      }
    }

    // Tạo phần tử mới hiển thị video trong bảng
    const row = document.createElement("tr");
    row.dataset.videoId = selectedVideo; // Gắn ID video để kiểm tra trùng lặp
    row.draggable = true; // Cho phép kéo và thả
    row.innerHTML = `
      <td>${selectedVideo}</td>
      <td><button type="button" class="remove-video">Xóa</button></td>
    `;
    movieListTable.appendChild(row);
    addDragAndDropHandlers();
    // Gắn sự kiện xóa cho nút "remove-video"
    row.querySelector(".remove-video").addEventListener("click", () => {
      const isConfirmedDelete = confirm("Xóa video khỏi list?");
      if (!isConfirmedDelete) {
        showToast("Đã hủy xóa video");
        return; // Người dùng hủy xác nhận
      }
      movieListTable.removeChild(row);
      showToast("Video đã được xóa khỏi danh sách.");
    });

    showToast("Video: " + selectedVideo + " đã .được thêm vào danh sách.");
  }
}
document
  .getElementById("add-to-list")
  .addEventListener("click", async (event) => {
    const selectElement = document.getElementById("add-video-to-list");
    const selectedVideo = selectElement.value;
    await addVideoToList(selectedVideo);
  });
async function loadMovieList(selectedMovieList) {
  if (selectedMovieList === "new") {
    // Làm trống các ô nhập liệu trong Movie List
    document.querySelector("input[name='movieListName']").value = "";
    document.querySelector("input[name='listName']").value = "";
    showToast("Các ô Movie List đã được làm trống.");

    // Làm trống bảng video
    const movieListTableBody = document.getElementById("movie-list-table-body");
    movieListTableBody.innerHTML = ""; // Xóa tất cả các video trong bảng
  } else if (selectedMovieList) {
    try {
      // Truy vấn dữ liệu từ Firestore
      const docRef = doc(db, "content/type/movieList", selectedMovieList);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const movieList = docSnap.data();

        // Cập nhật các trường trong form với dữ liệu từ Firestore
        document.querySelector("input[name='movieListName']").value =
          selectedMovieList;
        document.querySelector("input[name='listName']").value =
          movieList.name || "";

        // Tải mảng video liên quan đến Movie List
        const videoIds = movieList.videos || []; // Giả sử mảng video được lưu dưới key "videos"
        const movieListTableBody = document.getElementById(
          "movie-list-table-body"
        );
        movieListTableBody.innerHTML = ""; // Làm trống bảng trước khi thêm các video mới

        // Lặp qua mảng video và hiển thị từng video trong bảng
        videoIds.forEach((videoId) => {
          const row = document.createElement("tr");
          row.dataset.videoId = videoId; // Gắn ID video để dễ dàng xử lý sau này
          row.innerHTML = `
            <td>${videoId}</td>
            <td><button type="button" class="remove-video">Xóa</button></td>
          `;
          movieListTableBody.appendChild(row);

          // Gắn sự kiện xóa cho nút "remove-video"
          row.querySelector(".remove-video").addEventListener("click", () => {
            row.remove();
            showToast(`Video ${videoId} đã được xóa khỏi danh sách.`);
          });
        });

        showToast("Load thành công Movie List: " + selectedMovieList);
      } else {
        showToast("Không tìm thấy Movie List đã chọn.");
      }
    } catch (error) {
      console.error("Lỗi tải Movie List từ Firestore:", error);
      showToast("Lỗi khi tải Movie List.");
    }
  } else {
    showToast("Vui lòng chọn Movie List.");
  }
}
// Hàm tải dữ liệu vào content-list dựa trên loại nội dung đã chọn
async function loadContentList(selectedType) {
  const contentListSelect = document.getElementById("content-list");
  contentListSelect.innerHTML = ""; // Xóa hết các tùy chọn cũ

  let dataList = [];

  // Kiểm tra loại nội dung và tải dữ liệu tương ứng
  if (selectedType === "feature") {
    dataList = await loadFeatureOptions(contentListSelect); // Load dữ liệu Features
  } else if (selectedType === "movie-list") {
    dataList = await loadMovieListOptions(contentListSelect); // Load dữ liệu Movie Lists
  } else if (selectedType === "video") {
    dataList = await loadVideoOptions(contentListSelect); // Load dữ liệu Video
  }

  // Loại bỏ tùy chọn đầu tiên (nếu tồn tại) để không bị trùng
  if (
    contentListSelect.firstChild &&
    contentListSelect.firstChild.value === "new"
  ) {
    contentListSelect.removeChild(contentListSelect.firstChild); // Xóa tùy chọn "New" (hoặc tùy chọn đầu tiên)
  }
  // Thêm option "Chọn nội dung để xóa" vào đầu
  const noneOption = document.createElement("option");
  noneOption.textContent = "Chọn nội dung để xóa";
  noneOption.value = "none"; // Giá trị 'none' sẽ đại diện cho một lựa chọn không hợp lệ

  // Thêm "Chọn nội dung để xóa" vào đầu select, thay vì appendChild
  contentListSelect.insertBefore(noneOption, contentListSelect.firstChild);

  // Thêm các tùy chọn dữ liệu vào
  dataList.forEach((item) => {
    const option = document.createElement("option");
    option.textContent = item.name; // Tên item (Giả sử mỗi item có thuộc tính 'name')
    option.value = item.id; // Giá trị item (Giả sử mỗi item có thuộc tính 'id')
    contentListSelect.appendChild(option); // Thêm vào cuối
  });
}

// Lắng nghe sự kiện khi thay đổi loại nội dung cần xóa
document
  .getElementById("delete-content-type")
  .addEventListener("change", async (event) => {
    const selectedType = event.target.value;
    await loadContentList(selectedType); // Gọi hàm tải dữ liệu vào content-list khi thay đổi loại nội dung
  });
// Mặc định chọn "feature" khi trang tải
document.addEventListener("DOMContentLoaded", () => {
  const defaultType = "feature"; // Chọn mặc định là "feature"
  document.getElementById("delete-content-type").value = defaultType; // Đặt giá trị của select thành "feature"

  // Gọi hàm tải dữ liệu cho loại "feature"
  loadContentList(defaultType);
});
async function deleteContent(deleteContentType, contentList) {
  // Hiển thị hộp thoại xác nhận xóa
  const isConfirmed = confirm("Chắc chắn xóa nội dung này?");

  // Nếu người dùng không xác nhận, dừng lại
  if (!isConfirmed) {
    showToast("Đã hủy xóa.");
    return;
  }

  if (deleteContentType === "feature") {
    const docRef = doc(db, "content/type/feature", contentList);
    await deleteDoc(docRef);
    showToast("Đã xóa thành công feature " + contentList);
  }
  if (deleteContentType === "movie-list") {
    const docRef = doc(db, "content/type/movieList", contentList);
    await deleteDoc(docRef);
    showToast("Đã xóa thành công movieList " + contentList);
  }
  if (deleteContentType === "video") {
    const docRef = doc(db, "content/type/videos", contentList);
    await deleteDoc(docRef);
    showToast("Đã xóa thành công video: " + contentList);
  }
  document.getElementById("password-container").style.display = "none";
  const selectedType = document.getElementById("delete-content-type").value;
  await loadContentList(selectedType); // Gọi hàm tải dữ liệu vào content-list khi thay đổi loại nội dung
}
document
  .getElementById("confirm-delete-btn")
  .addEventListener("click", async () => {
    const passwordInput = document.getElementById("password");

    if (passwordInput.value !== "ochinchin") {
      alert("Mật khẩu không đúng.");
      return;
    }

    const deleteContentTypeSelect = document.getElementById(
      "delete-content-type"
    );
    const deleteContentType = deleteContentTypeSelect.value;
    const contentListSelect = document.getElementById("content-list");
    const contentList = contentListSelect.value;

    await deleteContent(deleteContentType, contentList);
  });
document.getElementById("delete-content-btn").addEventListener("click", () => {
  const passwordContainer = document.getElementById("password-container");
  passwordContainer.style.display = "block";
});
