import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
 import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
 import{getFirestore, setDoc, doc,getDoc,updateDoc, onSnapshot,getDocs, collection} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
 
const firebaseConfig = {
  apiKey: "AIzaSyAqvFTdSubEm_vWeevlvUhkLgPBxdBasL0",
  authDomain: "ochinchin-7b3d8.firebaseapp.com",
  databaseURL: "https://ochinchin-7b3d8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ochinchin-7b3d8",
  storageBucket: "ochinchin-7b3d8.firebasestorage.app",
  messagingSenderId: "364411060998",
  appId: "1:364411060998:web:b7f31215e5cb0d0fbf1487",
  measurementId: "G-BFRZ15ZNEC"
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
    const docSnap = await getDoc(ref);
    if(docSnap.exists()){
       localStorage.setItem("loggedInUserId", user.uid);
      return "kimochi"
    }
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
export async function loginAnonymous(){
  try{
  const userCredential = await signInAnonymously(auth)
  const user = userCredential.user;
    const displayName = 'Ẩn danh 😎';
    const photoUrl = "https://www.dropbox.com/scl/fi/o0nyh6atfock3fxrjcu8j/andanh.png?rlkey=bgbperz5j18dden4j4vll416q&dl=1";
    const userData = {
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
  }catch(error){
    alert('login anonymous f' + error)
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
    const docSnap = await getDoc(ref)
    if(!docSnap.exists()){
      localStorage.removeItem('loggedInUserId');
      return 'yamate'
    }
    const data = await getDoc(ref);
    return data.data();
  }catch(error){
    alert(error);
  }
}
export async function changeUserProfile(uid,profile,type){
  try{
    const ref = doc(db,"users",uid);
    if(type=='displayName'){
    await updateDoc(ref, {
      displayName:profile,
    });
    }else if(type == 'avatar'){
          await updateDoc(ref, {
      avatar:profile,
    });
    }
  }catch(error){
    alert(error)}
};
export const shortenLinkConst = async(name,link)=>{
  try{
  const linkRef = doc(collection(db,'link'),name);
  const docSnap = await getDoc(linkRef)
  if(docSnap.exists()){
    return('exist');
  }
  const data={
    name:name,
    link:link
  }
  await setDoc(linkRef,data);
    return 'kimochi'
  }catch(error){
    return('fsdb',error);
  }
}
export const getLink = async(name)=>{
  try{
  const linkRef = doc(collection(db,'link'),name);
  const docSnap = await getDoc(linkRef)
  return docSnap.data()
  }catch(error){
    return('fsdb',error);
  }
}
