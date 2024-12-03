import React from 'react';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
  import{getFirestore, setDoc, doc,getDoc,updateDoc,collection} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
 
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