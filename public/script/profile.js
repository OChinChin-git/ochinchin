import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
    handleUserLoggedIn(user, loggedUserNameElement, loggedUserEmailElement, dropdownMenu);
  } else {
    handleUserLoggedOut(loggedUserNameElement, loggedUserEmailElement, dropdownMenu);
  }
});

// Hàm xử lý khi người dùng đã đăng nhập
function handleUserLoggedIn(user, loggedUserNameElement, loggedUserEmailElement, dropdownMenu) {
  // Kiểm tra nếu người dùng đã đăng ký qua email và không có thông tin profile
  if (!user.displayName || !user.photoURL) {
    handleProfileUpdate(user, loggedUserNameElement, dropdownMenu);
  } else {
    updateUserDisplay(user, loggedUserNameElement, loggedUserEmailElement);
  }

  // Đặt nút thành "Logout" và thêm sự kiện đăng xuất
  authButton.innerText = "Logout";
  authButton.onclick = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  // Thêm sự kiện thay đổi ảnh và tên
  changeProfileButton.onclick = () => {
    handleChangeProfile(user, loggedUserNameElement);
  };
}

// Hàm xử lý khi người dùng chưa đăng nhập
function handleUserLoggedOut(loggedUserNameElement, loggedUserEmailElement, dropdownMenu) {
  loggedUserNameElement.innerText = "";
  loggedUserEmailElement.innerText = "";
  document.getElementById('name').style.display = "none";
  document.getElementById('email').style.display = "none";
  document.getElementById('changeProfileButton').style.display = "none";

  const statusMessage = document.createElement('div');
  statusMessage.innerText = "Chưa đăng nhập";
  statusMessage.style.fontWeight = "bold";
  dropdownMenu.insertBefore(statusMessage, dropdownMenu.firstChild);

  authButton.innerText = "Login";
  authButton.onclick = () => {
    window.location.href = '/login.html'; // Chuyển hướng đến trang đăng nhập
  };
}

// Hàm cập nhật giao diện khi người dùng đã có thông tin profile
function updateUserDisplay(user, loggedUserNameElement, loggedUserEmailElement) {
  loggedUserEmailElement.innerText = user.email || "No email available";
  loggedUserNameElement.innerText = user.displayName || "No name available";
  profilePicture.src = user.photoURL || "https://default-avatar-url.com";
}

// Hàm yêu cầu người dùng cập nhật thông tin profile (tên và ảnh đại diện)
function handleProfileUpdate(user, loggedUserNameElement, dropdownMenu) {
  const newName = prompt("Nhập tên:", user.displayName || "Your Name");
  const defaultPhotoURL = "https://www.dropbox.com/scl/fi/o0nyh6atfock3fxrjcu8j/andanh.png?rlkey=bgbperz5j18dden4j4vll416q&dl=1"; // Avatar mặc định

  // Cập nhật thông tin người dùng trên Firebase Auth
  updateProfile(user, {
    displayName: newName,
    photoURL: defaultPhotoURL
  })
  .then(() => {
    // Sau khi cập nhật, lưu thông tin vào Firestore
    saveUserProfileToFirestore(user.uid, newName, defaultPhotoURL);

    // Cập nhật lại giao diện sau khi thay đổi thông tin
    loggedUserNameElement.innerText = newName;
    profilePicture.src = defaultPhotoURL;
  })
  .catch((error) => {
    console.error('Error updating profile:', error);
  });
}

// Hàm thay đổi tên và ảnh đại diện
function handleChangeProfile(user, loggedUserNameElement) {
  event.preventDefault();
  const newName = prompt("Enter new name:", user.displayName);
  const newPhotoURL = prompt("Enter new profile picture URL:", user.photoURL);

  if (newName || newPhotoURL) {
    // Cập nhật thông tin trên Firebase Auth
    updateProfile(user, {
      displayName: newName || user.displayName,
      photoURL: newPhotoURL || user.photoURL
    }).then(() => {
      // Lưu thông tin vào Firestore
      saveUserProfileToFirestore(user.uid, newName || user.displayName, newPhotoURL || user.photoURL);

      // Cập nhật giao diện
      loggedUserNameElement.innerText = newName || user.displayName;
      profilePicture.src = newPhotoURL || user.photoURL;
    }).catch((error) => {
      console.error('Error updating profile:', error);
    });
  }
}

// Hàm lưu thông tin người dùng vào Firestore
async function saveUserProfileToFirestore(uid, displayName, photoURL) {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      displayName: displayName,
      photoURL: photoURL
    }, { merge: true }); // Dùng merge để cập nhật mà không ghi đè dữ liệu cũ

    console.log("User profile saved to Firestore.");
  } catch (error) {
    console.error("Error saving user profile to Firestore:", error);
  }
}
