import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
 import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
 import{getFirestore, setDoc, doc,getDoc,updateDoc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
 
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
const db = getFirestore();
// Tạo provider cho Google
const provider = new GoogleAuthProvider();

// Hàm đăng nhập với Google
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const ref = doc(db,"users",user.uid);
      const displayName = user.displayName; // Tên hiển thị
  const photoURL = user.photoURL; // Ảnh đại diện
  const email = user.email; // Email
    const data ={
    displayName: displayName,
    name: displayName,
    avatar: photoURL,
    email: email,
    }
    await setDoc(ref,data)
    localStorage.setItem("loggedInUserId", user.uid);
    return "kimochi"
  } catch (error) {
  return error;
  }
}
export async function signUp(name, email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const displayName = name;
    const photoUrl = "https://www.dropbox.com/scl/fi/o0nyh6atfock3fxrjcu8j/andanh.png?rlkey=bgbperz5j18dden4j4vll416q&dl=1";
    const userData = {
      email: email,
      name: name,
      displayName: displayName,
      avatar: photoUrl,
    };
    const docRef = doc(db, "users", user.uid);
    
    try {
      await setDoc(docRef, userData);
      localStorage.setItem('loggedInUserId', user.uid);
      return "kimochi";
    } catch (error) {
      alert(`Error saving user data: ${error.message}`);  // Hiển thị thông báo lỗi khi lưu dữ liệu
    }

  } catch (error) {
    // Xử lý lỗi khi đăng ký người dùng (chẳng hạn email đã tồn tại)
    if (error.code === 'auth/email-already-in-use') {
      return "Đã tồn tại account"
    } else {
      alert(`Error: ${error.message}`);
    }
  }
}
export async function login(email,password){
  try{
    const userCredential = await signInWithEmailAndPassword(auth,email,password);
    const user = userCredential.user;
    localStorage.setItem('loggedInUserId', user.uid)
    return "kimochi"
  }catch(error){
    if(error.code === 'auth/invalid-credential'){
      return "Sai mật khẩu hoặc email"
    }else{
      return "Tài khoản không tồn tại"
    }
  }
}
export async function getUserProfile(uid){
  try{
    const ref = doc(db,"users",uid)
    const data = await getDoc(ref);
    return data.data();
  }catch(error){
    alert(error);
  }
}
export async function changeUserProfile(uid,name,avt){
  try{
    const ref = doc(db,"users",uid);
    await updateDoc(ref, {
      displayName:name,
      avatar:avt,
    });
  }catch(error){
    alert(error)}
};