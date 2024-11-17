 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
 import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
 import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
 
 // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC3-atWTI6-LsEWb4N3uTlPQEP2ewgoh7Y",
    authDomain: "thanhchimbe-d29a4.firebaseapp.com",
    projectId: "thanhchimbe-d29a4",
    storageBucket: "thanhchimbe-d29a4.firebasestorage.app",
    messagingSenderId: "661307532795",
    appId: "1:661307532795:web:4a211686f935f6d1a2175e"
  };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Tạo provider cho Google
const provider = new GoogleAuthProvider();

// Hàm đăng nhập với Google
function signInWithGoogle() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("User Info:", user);

            // Lưu thông tin người dùng vào localStorage hoặc chuyển hướng người dùng
            localStorage.setItem("loggedInUserId", user.uid);
            window.location.href = '/';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error code:", errorCode, "Message:", errorMessage);

            // Hiển thị thông báo lỗi (nếu cần)
            alert("Đăng nhập thất bại! Vui lòng thử lại.");
        });
}

// Thêm sự kiện click cho nút đăng nhập Google
document.getElementById("googleSignInButton").addEventListener("click", signInWithGoogle);
// Thêm sự kiện click cho nút đăng nhập Google
document.getElementById("googleSignUpButton").addEventListener("click", signInWithGoogle);

 function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
 }
 const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const name = document.getElementById('name').value; // Sử dụng trường Name

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                name: name // Thay vì firstName và lastName
            };
            showMessage('Account Created Successfully', 'signUpMessage');
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    console.error("Error writing document", error);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode == 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists !!!', 'signUpMessage');
            } else {
                showMessage('Unable to create User', 'signUpMessage');
            }
        });
});

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Login is successful', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href = '/';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('Account does not exist', 'signInMessage');
            }
        });
});
