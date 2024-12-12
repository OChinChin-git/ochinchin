import React, { useState, useEffect } from "react";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  onSnapshot,
  Timestamp,
  deleteDoc,
  FieldValue,
  serverTimestamp,query,where,orderBy,startAfter,limit
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const db = getFirestore();

const getDocValue = async (type, name) => {
  const typeRef = collection(db, "content/type", type);
  const docRef = doc(typeRef, name);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    const finalData = await getTypeValue(type, data);
    return finalData;
  }
};
const getTypeValue = async (type, data) => {
  let finalData = {};
  if (type == "feature") {
    finalData = {
      title: data.title,
      url: data.videoUrl,
    };
  }
  if (type == "videos") {
    finalData = {
      title: data.videoTitle,
      url: data.videoUrl,
    };
  }
  if (type == "rooms") {
    finalData = {
      title: data.title,
      url: data.videoUrl,
      host: data.host,
      roomName: data.roomName,
      roomPass: data.roomPass,
      currentTime: data.currentTime || 0,
      playbackState: data.playbackState || 'Paused',
    };
  }
  return finalData;
};

export const getVideo = async (id) => {
  const docRef = doc(db, "content/type/videosId", id);
  const docSnap = await getDoc(docRef);
  let data;
  if (docSnap.exists()) {
    data = docSnap.data();
  }
  let finalData;
  if (id.startsWith("v")) {
    finalData = await getDocValue("videos", data.videoTitle);
  }
  if (id.startsWith("f")) {
    finalData = await getDocValue("feature", data.videoTitle);
  }
  if (id.startsWith("r")) {
    finalData = await getDocValue("rooms", data.videoTitle);
  }
  return finalData;
};

export const getTime = async () => {
  const userDoc = doc(db, "content", "serverTime"); // Thay "user_id" bằng ID cụ thể
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
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

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
export const formatTime = (chatTime) => {
  // Lấy 13 ký tự đầu (timestamp chính)
  const chatTimeMillis = Date.parse(
    `${chatTime.slice(0, 4)}-${chatTime.slice(4, 6)}-${chatTime.slice(6, 8)}T` +
      `${chatTime.slice(8, 10)}:${chatTime.slice(10, 12)}:${chatTime.slice(
        12,
        14
      )}.${chatTime.slice(14, 17)}Z`
  );

  if (isNaN(chatTimeMillis)) {
    return "Thời gian không hợp lệ";
  }

  // Tạo đối tượng Date từ timestamp
  const chatDate = new Date(chatTimeMillis);
  if (isNaN(chatDate.getTime())) {
    return "Thời gian không hợp lệ";
  }

  // Tính chênh lệch thời gian
  const seconds = (Date.now() - chatTimeMillis) / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const months = days / 30;
  const years = days / 365;

  let formattedTime = "";

  if (days < 1) {
    // Cắt chuỗi timestamp để lấy giờ, phút, giây
    const hours = chatTime.slice(8, 10); // Lấy 2 ký tự đầu tiên sau ngày (Giờ)
    const minutes = chatTime.slice(10, 12); // Lấy 2 ký tự sau giờ (Phút)
    const seconds = chatTime.slice(12, 14); // Lấy 2 ký tự sau phút (Giây)

    formattedTime = `${hours}:${minutes}:${seconds} hôm nay`;
  } else if (days < 2) {
    formattedTime = "Hôm qua";
  } else if (days < 30) {
    formattedTime = `${Math.floor(days)} ngày trước`;
  } else if (months < 12) {
    formattedTime = `${Math.floor(months)} tháng trước`;
  } else {
    formattedTime = `${Math.floor(years)} năm trước`;
  }

  return formattedTime;
};
export const sendChats = async (id, time, userId, message) => {
  try {
    const chatDoc = doc(db, "content/type/videosId", id);
    const chatCol = collection(chatDoc, "chats");
    const chatData = doc(chatCol, time);
    const data = {
      time: time,
      userId: userId,
      message: message,
    };
    await setDoc(chatData, data);
  } catch (error) {
    alert(error);
  }
};
export const getUsersData = (callback) => {
  const userRef = collection(db, 'users');
  const unsubscribe = onSnapshot(userRef, (snapshot) => {
    const newData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // So sánh dữ liệu trước và sau khi nhận được mới
    callback((prevData) => {
      if (JSON.stringify(prevData) !== JSON.stringify(newData)) {
        return newData;
      }
      return prevData;
    });
  });
  return unsubscribe;
};
function subtractOneHour(serverTime) {
  // Chuyển serverTime thành đối tượng Date
  const year = parseInt(serverTime.slice(0, 4), 10);
  const month = parseInt(serverTime.slice(4, 6), 10) - 1; // Tháng bắt đầu từ 0
  const day = parseInt(serverTime.slice(6, 8), 10);
  const hour = parseInt(serverTime.slice(8, 10), 10);
  const minute = parseInt(serverTime.slice(10, 12), 10);
  const second = parseInt(serverTime.slice(12, 14), 10);

  // Tạo đối tượng Date
  const date = new Date(year, month, day, hour, minute, second);

  // Trừ đi 1 giờ
  date.setHours(date.getHours() - 1);

  // Chuyển lại thành chuỗi theo định dạng "YYYYMMDDHHmmssSSS"
  const newTime = date.getFullYear().toString() +
                  ('0' + (date.getMonth() + 1)).slice(-2) + // Tháng (1-12)
                  ('0' + date.getDate()).slice(-2) +          // Ngày
                  ('0' + date.getHours()).slice(-2) +         // Giờ
                  ('0' + date.getMinutes()).slice(-2) +       // Phút
                  ('0' + date.getSeconds()).slice(-2) +       // Giây
                  '000';                                      // Mili giây (đã mặc định là 000)

  return newTime;
}
export const getChats = async(id)=>{
  const chatColRef = collection(doc(db,'content/type/videosId',id),'chats');
  const serverTime = await getTime();

  const timeValue = subtractOneHour(serverTime);
  const chatQuery= query(
  chatColRef,
    orderBy('__name__'),
    startAfter(timeValue)
  )
  const data = await getDocs(chatQuery)
  if (data.size == 0) {
    const chatsData = await getDocs(chatColRef);

    // Tạo mảng các promise từ các thao tác delete
    const deletePromises = chatsData.docs.map((chat) => {
      return deleteDoc(doc(chatColRef, chat.id));  // Mỗi deleteDoc sẽ trả về một promise
    });

    // Đợi tất cả các promise hoàn thành (xóa tất cả các document cùng lúc)
    await Promise.all(deletePromises);
  }

  const final = data.docs.map((chat)=>({
    ...chat.data(),
    id:chat.id
  }))
  return final
}
export const getAllChats = async(id)=>{
  const chatColRef = collection(doc(db,'content/type/videosId',id),'chats');
  const data = await getDocs(chatColRef)
  const final = data.docs.map((chat)=>({
    ...chat.data(),
    id:chat.id
  }))
  return final
}
export const getNewChats = (id, latest, callback) => {
  const chatColRef = collection(doc(db, 'content/type/videosId', id), 'chats');
  if(latest == 0){

    const unsubscribe = onSnapshot(chatColRef, (snapshot) => {
    // Kiểm tra nếu có dữ liệu trả về từ Firebase
    if (!snapshot.empty) {
      const data = snapshot.docs.map((chat) => ({
        ...chat.data(),
        id: chat.id
      }));

      // Gọi callback để cập nhật state với dữ liệu mới
      callback(prevMessages => [...prevMessages, ...data]);
    }
  });

  return unsubscribe;
  }
  const chatQuery = query(
    chatColRef,
    orderBy('__name__'), // order by __name__ (id doc)
    startAfter(latest.id)
  );

  const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
    // Kiểm tra nếu có dữ liệu trả về từ Firebase
    if (!snapshot.empty) {
      const data = snapshot.docs.map((chat) => ({
        ...chat.data(),
        id: chat.id
      }));

      // Gọi callback để cập nhật state với dữ liệu mới
      callback(prevMessages => [...prevMessages, ...data]);
    }
  });

  return unsubscribe;
}

export const getActiveVisitorsCount = (setActiveVisitors, id) => {
  if (!id) {
    console.warn("getActiveVisitorsCount called with invalid id:", id);
    return () => {}; // Trả về hàm no-op nếu id không hợp lệ
  }

  const visitorsRef = collection(
    doc(db, "content/type/videosId", id),
    "activeVisitors"
  );

  const unsubscribe = onSnapshot(
    visitorsRef,
    (snapshot) => {
      const activeVisitorsCount = snapshot.size;
      setActiveVisitors(activeVisitorsCount);
    },
    (error) => {
      console.error("Error getting active visitors count:", error);
    }
  );

  return unsubscribe; // Trả về hàm unsubscribe để dừng theo dõi
};

export const resetActiveVisitors = async (id) => {
  try {
    // Truy cập tập hợp activeVisitors bên trong tài liệu videosId
    const visitorsRef = collection(
      doc(db, "content/type/videosId", id),
      "activeVisitors"
    );
    // Lấy tất cả tài liệu bên trong tập hợp activeVisitors
    const snapshot = await getDocs(visitorsRef);

    // Nếu có tài liệu trong collection, tiến hành xóa
    if (snapshot.docs.length > 0) {
      const deletePromises = snapshot.docs.map((doc) => {
        return deleteDoc(doc.ref);
      });

      // Chờ cho tất cả các tài liệu được xóa
      await Promise.all(deletePromises);
    } else {
      console.log("No active visitors to delete.");
    }
  } catch (error) {
    console.error("Error resetting active visitors:", error);
  }
};
export const trackUpdateRoom = (
  roomId,
  handleSetRoom,
  videoInfo
) => {
  if (!roomId) {
    return;
  }
  const roomRef = doc(db, "content/type/rooms", roomId);
  const unsubscribe = onSnapshot(roomRef, (docSnapshot) => {
    const data = docSnapshot.data();
    handleSetRoom();
    videoInfo();
    
  });
  return unsubscribe;
};
export const getRoomVisitors = async (id) => {
  const roomIdDocRef = doc(db, "content/type/videosId", id);
  const roomIdColRef = collection(roomIdDocRef, "activeVisitors");
  const allVisitor = await getDocs(roomIdColRef);

  // Sử dụng Promise.all để xử lý các hàm async
  const visitorIds = await Promise.all(
    allVisitor.docs.map(async (doc) => {

      return {
        id: doc.id,
        ...doc.data(),
      };
    })
  );
  console.log(visitorIds);
  return visitorIds;
};
export const addVisitor = async(id)=>{
  try{
    const visitor = localStorage.getItem('visitorId') ||Date.now().toString();
    const userId = localStorage.getItem('loggedInUserId'||'anonymous')
    const visitorsRef = doc(collection(doc(db,'content/type/videosId',id),'activeVisitors'),visitor);
    const data={
      userId:userId,
    }
    await setDoc(visitorsRef,data);
  }catch(error){
    alert('add visitor' +error)
  }
}
export const removeVisitor = async(id)=>{
  try{
    const visitor = localStorage.getItem('visitorId') ;
    if(!visitor){
      return
    }
    const visitorsRef = doc(collection(doc(db,'content/type/videosId',id),'activeVisitors'),visitor);
    await deleteDoc(visitorsRef);
  }catch(error){
    alert('remove'+error)
  }
}
export const syncYoutubeIframe =async(id,playbackState,currentTime)=>{
  const roomDoc = doc(db,'content/type/rooms',id)
  const data={
    playbackState:playbackState,
    currentTime:currentTime,
  }
  await updateDoc(roomDoc,data);
}