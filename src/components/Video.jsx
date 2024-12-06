import React, { useState, useEffect } from 'react';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
  import{getFirestore, 
         setDoc, doc,getDoc,
         updateDoc,
         collection,
         getDocs,onSnapshot,
         Timestamp,
         deleteDoc,
         FieldValue,
         serverTimestamp} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
 
  const firebaseConfig = {
    apiKey: "AIzaSyAqvFTdSubEm_vWeevlvUhkLgPBxdBasL0",
    authDomain: "ochinchin-7b3d8.firebaseapp.com",
    projectId: "ochinchin-7b3d8",
    storageBucket: "ochinchin-7b3d8.firebasestorage.app",
    messagingSenderId: "364411060998",
    appId: "1:364411060998:web:b7f31215e5cb0d0fbf1487",
    measurementId: "G-BFRZ15ZNEC"
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

export const getTime = async () => {
  const userDoc = doc(db, "users", "user_id"); // Thay "user_id" bằng ID cụ thể
  try {
  await setDoc(userDoc, { createdAt: serverTimestamp() }, { merge: true });
} catch (error) {
  alert(`Lỗi khi lưu Firestore: ${error.message}`);
  console.error(error);
}


  // Lấy thời gian vừa lưu
  const docSnap = await getDoc(userDoc);
  if (docSnap.exists()) {

    const timestamp = docSnap.data()?.createdAt;

    if (timestamp && timestamp instanceof Timestamp) {

      const date = timestamp.toDate();

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

      const xyz = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

      return xyz;
    } else {
      alert("createdAt không phải là kiểu Timestamp!");
      console.error("createdAt không phải là Timestamp!");
      return null;
    }
  } else {
    alert("Không tìm thấy tài liệu trong Firestore");
    console.error("Không tìm thấy tài liệu!");
    return null;
  }
};
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
export const trackVisitor = () => {
  // Kiểm tra nếu visitorId đã tồn tại trong localStorage
  let visitorId = localStorage.getItem('visitorId');
  if (!visitorId) {
    visitorId = Date.now().toString(); // Tạo ID mới nếu chưa tồn tại
    localStorage.setItem('visitorId', visitorId); // Lưu vào localStorage
  }
  console.log("Tracking visitor with ID:", visitorId);

  const visitorRef = doc(db, 'activeVisitors', visitorId);
  setDoc(visitorRef, { active: true })
    .then(() => console.log("Visitor set as active in Firestore."))
    .catch((error) => console.log("Error setting visitor active status:", error));

  const handleBeforeUnload = () => {
    console.log("Removing visitor with ID:", visitorId);
    deleteDoc(visitorRef)
      .then(() => console.log("Visitor removed from Firestore."))
      .catch((error) => console.log("Error removing visitor:", error));
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    console.log("Removing 'beforeunload' event listener.");
    window.removeEventListener('beforeunload', handleBeforeUnload);
    deleteDoc(visitorRef)
      .then(() => console.log("Visitor removed during cleanup."))
      .catch((error) => console.log("Error removing visitor during cleanup:", error));

  };
};

export const getActiveVisitorsCount = (setActiveVisitors) => {
  const visitorsRef = collection(db, 'activeVisitors');
  console.log("Listening for changes in activeVisitors collection at path:", 'activeVisitors');

  const unsubscribe = onSnapshot(visitorsRef, (snapshot) => {
    const activeVisitorsCount = snapshot.size;  // Sử dụng snapshot.size để đếm số lượng tài liệu
    console.log("Active visitors count updated:", activeVisitorsCount);
    setActiveVisitors(activeVisitorsCount);

    setTimeout(()=>{
      trackVisitor();
    },1000)
      // Gọi hàm trackVisitor để theo dõi mỗi khi có sự thay đổi trong số lượng người dùng
  }, (error) => {
    console.log("Error getting active visitors count:", error);
  });

  return unsubscribe;
};
