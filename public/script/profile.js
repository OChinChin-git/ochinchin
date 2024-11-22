import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3-atWTI6-LsEWb4N3uTlPQEP2ewgoh7Y",
  authDomain: "thanhchimbe-d29a4.firebaseapp.com",
  projectId: "thanhchimbe-d29a4",
  storageBucket: "thanhchimbe-d29a4.firebasestorage.app",
  messagingSenderId: "6613075327a95",
  appId: "1:661307532795:web:4a211686f935f6d1a2175e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const authButton = document.getElementById('authButton');
const changeProfileButton = document.getElementById('changeProfileButton');
const profilePicture = document.getElementById('profilePicture');

// Kiểm tra trạng thái đăng nhập của người dùng
onAuthStateChanged(auth, (user) => {
  const loggedUserNameElement = document.getElementById('loggedUserName');
  const loggedUserEmailElement = document.getElementById('loggedUserEmail');
  const dropdownMenu = document.getElementById('dropdownMenu');
  
  if (user) {
    // Kiểm tra nếu người dùng đã đăng ký qua email và không có thông tin profile
    if (!user.displayName || !user.photoURL) {
      // Yêu cầu người dùng cập nhật thông tin nếu chưa có
      const newName = prompt("Nhập tên:", user.displayName || "Your Name");
      const defaultPhotoURL = "https://www.dropbox.com/scl/fi/o0nyh6atfock3fxrjcu8j/andanh.png?rlkey=bgbperz5j18dden4j4vll416q&dl=1"; // Avatar mặc định

      // Cập nhật thông tin người dùng
      updateProfile(user, {
        displayName: newName,
        photoURL: defaultPhotoURL
      }).then(() => {
        // Cập nhật lại giao diện sau khi thay đổi thông tin
        loggedUserNameElement.innerText = newName;
        profilePicture.src = defaultPhotoURL;
      }).catch((error) => {
        console.error('Error updating profile:', error);
      });
      setTimeout(() => {
  location.reload(); // Làm mới lại toàn bộ trang
}, 300); 
    } else {
         // Người dùng đã đăng nhập, hiển thị thông tin người dùng
    
        loggedUserEmailElement.innerText = user.email || "No email available";
        // Nếu có displayName và photoURL, hiển thị thông tin
        loggedUserNameElement.innerText = user.displayName || "No name available";
        profilePicture.src = user.photoURL || "https://default-avatar-url.com";
      
      }
    
    

    // Đặt nút thành "Logout" và thêm sự kiện đăng xuất
    authButton.innerText = "Logout";
    authButton.onclick = () => {
      signOut(auth)
        .then(() => {
          console.log("User signed out");
          
         
setTimeout(() => {
  location.reload(); // Làm mới lại toàn bộ trang
}, 300); 

        })
        .catch((error) => {
          console.error('Error signing out:', error);
        });
    };

    // Thêm sự kiện thay đổi ảnh và tên
    changeProfileButton.onclick = () => {
      const newName = prompt("Enter new name:", user.displayName);
      const newPhotoURL = prompt("Enter new profile picture URL:", user.photoURL);

      if (newName || newPhotoURL) {
        updateProfile(user, {
          displayName: newName || user.displayName,
          photoURL: newPhotoURL || user.photoURL
        }).then(() => {
          // Cập nhật thông tin người dùng trong giao diện
          loggedUserNameElement.innerText = newName || user.displayName;
          profilePicture.src = newPhotoURL || user.photoURL;
          loggedUserEmailElement.innerText = user.email || "No email available";

        }).catch((error) => {
          console.error('Error updating profile:', error);
        });
      }
    };
    
  } else {
    // Người dùng chưa đăng nhập, ẩn phần tử Name và Email
    document.getElementById('name').style.display = "none";
    document.getElementById('email').style.display = "none";
    document.getElementById('changeProfileButton').style.display = "none";
    // Tạo và hiển thị dòng "Chưa đăng nhập"
    const statusMessage = document.createElement('div');
    statusMessage.innerText = "Chưa đăng nhập";
    statusMessage.style.fontWeight = "bold";

    // Thêm dòng thông báo vào đầu phần tử dropdownMenu
    dropdownMenu.insertBefore(statusMessage, dropdownMenu.firstChild);  // Đặt dòng "Chưa đăng nhập" ở đầu

    // Đặt nút thành "Login" và thêm sự kiện chuyển hướng đến trang login
    authButton.innerText = "Login";
    authButton.onclick = () => {
      window.location.href = '/login.html'; // Chuyển hướng đến trang đăng nhập
    };
  }
});
