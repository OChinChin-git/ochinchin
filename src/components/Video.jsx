import React from 'react';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
  import{getFirestore, setDoc, doc,getDoc,updateDoc,collection,getDocs,onSnapshot,Timestamp} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
 
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
const db = getFirestore();

const getDocValue = async(type,name)=>{
  const typeRef= collection(db,"content/type",type)
  const docRef = doc(typeRef,name);
  const docSnap = await getDoc(docRef);
  if(docSnap.exists()){
    const data = docSnap.data(); 
    const finalData = await getTypeValue(type,data)
    return finalData
  }
}
const getTypeValue = async(type,data)=>{
  let finalData ={}
  if(type=="feature"){
     finalData={
      title:data.title,
      url: data.videoUrl,
    }
  }
  if(type=="videos"){
      finalData={
      title:data.videoTitle,
      url: data.videoUrl,
    }
  }
  return finalData;
}

export const getVideo = async(id)=>{
  const docRef = doc(db,"content/type/videosId",id);
  const docSnap = await getDoc(docRef);
  let data
  if(docSnap.exists()){
    data = docSnap.data();
  }
  let finalData
  if(id.startsWith("v")){
    finalData = await getDocValue("videos",data.videoTitle);
  }
  if(id.startsWith("f")){
    finalData = await getDocValue("feature",data.videoTitle);
  }
  return finalData;
}

export const getTime = () => {
  const timestamp = Timestamp.now();

  // Chuyển đổi timestamp thành thời gian dễ đọc
  const date = timestamp.toDate(); // Chuyển timestamp thành đối tượng Date của JavaScript
  const hours = String(date.getHours()).padStart(2, '0');  // Đảm bảo giờ có 2 chữ số
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Đảm bảo phút có 2 chữ số
  const seconds = String(date.getSeconds()).padStart(2, '0'); // Đảm bảo giây có 2 chữ số
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0'); // Đảm bảo mili giây có 3 chữ số
  const day = String(date.getDate()).padStart(2, '0'); // Đảm bảo ngày có 2 chữ số
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Đảm bảo tháng có 2 chữ số
  const year = date.getFullYear();

  // Chuyển đổi thành chuỗi số, định dạng: "YYYYMMDDHHMMSSMMM"
  const formattedTime = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
  return formattedTime;
}

const getUserData = async (id) => {
  const docRef = doc(db, "users", id);
  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      const { displayName, avatar } = userData;
      return { displayName, avatar };  // Trả về thông tin người dùng
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

const getChatsValue = (id, callback) => {
  try {
    // Tạo tham chiếu tới document của videoId
    const idDocRef = doc(db, "content/type/videosId", id);

    // Tạo tham chiếu tới collection con "chats" trong document
    const chatColRef = collection(idDocRef, "chats");

    // Lắng nghe các thay đổi trong collection chats
    const unsubscribe = onSnapshot(chatColRef, (chatSnapshot) => {
      const chatList = chatSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Gọi callback để cập nhật dữ liệu mới
      callback(chatList);
    });

    // Trả về unsubscribe để bạn có thể hủy đăng ký khi không cần lắng nghe nữa
    return unsubscribe;

  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu chats:", error);
    return [];
  }
};
const formatTime = (chatTime) => {
  // Nếu chatTime quá dài, cắt bớt độ dài để chỉ lấy phần timestamp chính
  const chatTimeMillis = parseInt(chatTime.slice(0, 13), 10); // Lấy 13 ký tự đầu tiên

  if (isNaN(chatTimeMillis)) {
    return "Thời gian không hợp lệ";
  }

  // Tạo đối tượng Date từ chatTimeMillis (thời gian chat)
  const chatDate = new Date(chatTimeMillis);

  // Kiểm tra nếu chatDate không hợp lệ
  if (isNaN(chatDate.getTime())) {
    return "Thời gian không hợp lệ";
  }

  // Tính toán các giá trị chênh lệch (giây, phút, giờ, ngày, tháng, năm)
  const seconds = (Date.now() - chatTimeMillis) / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const months = days / 30; // 1 tháng = 30 ngày
  const years = days / 365; // 1 năm = 365 ngày

  let formattedTime = "";

  // Nếu dưới 24 giờ, hiển thị thời gian theo giờ phút giây của "hôm nay"
  if (days < 1) {
    // Cắt chuỗi timestamp để lấy giờ, phút, giây
    const hours = chatTime.slice(8, 10); // Lấy 2 ký tự đầu tiên sau ngày (Giờ)
    const minutes = chatTime.slice(10, 12); // Lấy 2 ký tự sau giờ (Phút)
    const seconds = chatTime.slice(12, 14); // Lấy 2 ký tự sau phút (Giây)
    
    formattedTime = `${hours}:${minutes}:${seconds} hôm nay`;
  } 
  // Nếu dưới 48 giờ, hiển thị "Hôm qua"
  else if (days < 2) {
    formattedTime = "Hôm qua";
  } 
  // Nếu dưới 30 ngày, hiển thị "X ngày trước"
  else if (days < 30) {
    formattedTime = `${Math.floor(days)} ngày trước`;
  } 
  // Nếu dưới 12 tháng, hiển thị "X tháng trước"
  else if (months < 12) {
    formattedTime = `${Math.floor(months)} tháng trước`;
  } 
  // Nếu trên 1 năm, hiển thị "X năm trước"
  else {
    formattedTime = `${Math.floor(years)} năm trước`;
  }

  return formattedTime;
};


export const getChats = (id, callback) => {
  try {
    // Lắng nghe dữ liệu chat thay vì chỉ lấy một lần
    const unsubscribe = getChatsValue(id, async (chatList) => {
      const chatsWithUserData = await Promise.all(
        chatList.map(async (chat) => {
          const userData = await getUserData(chat.userId); 
          const time = formatTime(chat.time);
          return {
            message:chat.message,
            time:time,
            displayName: userData ? userData.displayName : '',
            avatar: userData ? userData.avatar : ''
          };
        })
      );

      // Cập nhật dữ liệu chat với thông tin người dùng
      callback(chatsWithUserData);
    });

    // Trả về unsubscribe nếu cần dừng lắng nghe thay đổi sau này
    return unsubscribe;

  } catch (error) {
    alert(error);
  }
};

export const sendChats = async(id,time,userId,message) =>{
  try{
  const chatDoc = doc(db,"content/type/videosId",id)
  const chatCol = collection(chatDoc,"chats");
  const chatData = doc(chatCol,time)
  const data = {
    time:time,
    userId:userId,
    message:message,
  }
  await setDoc(chatData,data)
  }catch(error){
    alert(error);
  }
}