import React, { useState, useEffect } from "react";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
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
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3-atWTI6-LsEWb4N3uTlPQEP2ewgoh7Y",
  authDomain: "thanhchimbe-d29a4.firebaseapp.com",
  databaseURL: "https://thanhchimbe-d29a4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "thanhchimbe-d29a4",
  storageBucket: "thanhchimbe-d29a4.firebasestorage.app",
  messagingSenderId: "661307532795",
  appId: "1:661307532795:web:4a211686f935f6d1a2175e",
  measurementId: "G-ZKJF0FJ44X"
};

// Initialize Firebase
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
const getUserData = async (id) => {
  const docRef = doc(db, "users", id);
  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      const { displayName, avatar } = userData;
      return { displayName, avatar }; // Trả về thông tin người dùng
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

export const getChats = (id, callback) => {
  try {
    // Lắng nghe dữ liệu chat thay vì chỉ lấy một lần
    const unsubscribe = getChatsValue(id, async (chatList) => {
      const chatsWithUserData = await Promise.all(
        chatList.map(async (chat) => {
          const userData = await getUserData(chat.userId);
          const time = formatTime(chat.time);
          return {
            message: chat.message,
            time: time,
            displayName: userData ? userData.displayName : "",
            avatar: userData ? userData.avatar : "",
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
export const trackVisitor = async (id) => {
  try {
    // Kiểm tra nếu visitorId đã tồn tại trong localStorage
    let visitorId = localStorage.getItem("visitorId");
    if (!visitorId) {
      visitorId = Date.now().toString(); // Tạo một ID duy nhất cho người truy cập
      localStorage.setItem("visitorId", visitorId); // Lưu vào localStorage
    }

    const docRef = doc(db, "content/type/videosId", id);
    const collRef = collection(docRef, "activeVisitors");
    const visitorRef = doc(collRef, visitorId);

    let userId = localStorage.getItem("loggedInUserId") || "anonymous";

    // Dữ liệu cần ghi
    const newData = {
      userId: userId,
      active: true,
      timestamp: new Date() // Cập nhật timestamp nếu có sự thay đổi
    };

    // Kiểm tra dữ liệu hiện tại và chỉ ghi nếu có thay đổi
    const existingDoc = await getDoc(visitorRef);
    if (!existingDoc.exists() || existingDoc.data().userId !== userId || existingDoc.data().active !== newData.active) {
      await setDoc(visitorRef, newData); // Chỉ ghi lại khi dữ liệu thay đổi
    }

    // Hàm xử lý trước khi đóng trình duyệt
    const handleBeforeUnload = async () => {
      try {
        await deleteDoc(visitorRef); // Xóa visitor khi đóng trình duyệt
      } catch (error) {
        console.error("Error removing visitor on unload:", error);
      }
    };

    // Gắn sự kiện `beforeunload`
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Trả về hàm cleanup để xóa sự kiện và tài liệu khi cần
    return async () => {
      window.removeEventListener("beforeunload", handleBeforeUnload); // Hủy sự kiện khi cần
      try {
        await deleteDoc(visitorRef); // Xóa visitor khi cần cleanup
      } catch (error) {
        console.error("Error removing visitor during cleanup:", error);
      }
    };
  } catch (error) {
    console.error("Error in trackVisitor:", error);
  }
};

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

      // Track visitor sau một khoảng thời gian ngắn
      setTimeout(() => {
        trackVisitor(id); // Cập nhật visitor sau một khoảng thời gian ngắn
      }, 100);
    },
    (error) => {
      console.error("Error getting active visitors count:", error);
    }
  );

  return unsubscribe; // Trả về hàm unsubscribe để dừng theo dõi
};

export const getActiveVisitors = (setActiveVisitors, id) => {
  if (!id) {
    console.warn("getActiveVisitorsCount called with invalid id:", id);
    return () => {}; // Trả về một hàm no-op để tránh lỗi
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

  return unsubscribe;
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
  checkIsHost,
  videoInfo
) => {
  if (!roomId) {
    return;
  }
  const roomRef = doc(db, "content/type/rooms", roomId);
  const unsubscribe = onSnapshot(roomRef, (docSnapshot) => {
    const data = docSnapshot.data();
    handleSetRoom();
    checkIsHost();
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
      const userId = doc.data().userId; // Lấy userId từ doc
      const userData = await getUserData(userId); // Chờ lấy dữ liệu người dùng
      return {
        id: doc.id,
        userId: userData ? userData.displayName : "Unknown", // Hiển thị "Unknown" nếu không tìm thấy dữ liệu
      };
    })
  );

  return visitorIds;
};
