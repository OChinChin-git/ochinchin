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
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";


const db = getFirestore();

const roomCol = collection(db, "content/type/rooms");
const idCol = collection(db, "content/type/videosId");
export const addRoom = async (name, pass, title, url) => {
  try {
    const docRef = doc(roomCol, name);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return "lỗi";
    } else {
      let visitorId = localStorage.getItem("visitorId");
      if (!visitorId) {
        visitorId = Date.now().toString(); // Tạo ID mới nếu chưa tồn tại
        localStorage.setItem("visitorId", visitorId); // Lưu vào localStorage
      }
      const idRoom = "r" + Date.now();
      const data = {
        host: visitorId,
        roomId: idRoom,
        roomName: name,
        roomPass: pass,
        title: title,
        videoUrl: url,
      };
      await setDoc(docRef, data);
      const idData = {
        videoId: idRoom,
        videoTitle: name,
      };
      await setDoc(doc(idCol, idRoom), idData);
      return idRoom;
    }
  } catch (error) {
    alert(error);
  }
};
export const updateRoom = async (name, host, pass, title, url) => {
  const docRef = doc(roomCol, name);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return "lỗi";
  }
  try {
    const data = {
      roomPass: pass,
      host: host,
      title: title,
      videoUrl: url,
    };
    await updateDoc(docRef, data);
    return "kimochi";
  } catch (error) {
    alert("update doc: " + error);
  }
};
export const getRoomsId = async (name) => {
  const data = await getDoc(doc(roomCol, name));
  const final = data.data();
  const xxx = final.roomId;
  return xxx;
};
