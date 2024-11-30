import {
  getFirestore,
  getDocs,
  getDoc,
  collection,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  deleteField,
  writeBatch,
  onSnapshot,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3-atWTI6-LsEWb4N3uTlPQEP2ewgoh7Y",
  authDomain: "thanhchimbe-d29a4.firebaseapp.com",
  projectId: "thanhchimbe-d29a4",
  storageBucket: "thanhchimbe-d29a4.firebasestorage.app",
  messagingSenderId: "661307532795",
  appId: "1:661307532795:web:4a211686f935f6d1a2175e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const typeRef = doc(db,"content","type");
function getCol(ref,col){
  return collection(ref,col);
}

async function getDocsId(type) {
  try {
    const colRef = getCol(typeRef, type);
    const docIds = [];
    
    // Lấy tài liệu từ Firestore
    const contentTypeId = await getDocs(colRef);
    
    // Dùng map để tạo mảng mới, lấy ra doc.id
    contentTypeId.forEach((doc) => {
      if (doc.exists()) {
        docIds.push(doc.id);  // Đảm bảo chỉ thêm id của các document tồn tại
      }
    });
    
    return docIds;
  } catch (error) {
    alert("Lỗi khi lấy danh sách tài liệu: " + error.message, "error");
    return [];
  }
}

//Kiểm tra xem file tồn tại không
async function checkIfDocExists(collectionPath, docId) {
  try {
    const docRef = doc(db, collectionPath, docId); // Tham chiếu đến tài liệu
    const docSnap = await getDoc(docRef); // Lấy tài liệu từ Firestore

    if (docSnap.exists()) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

//save 
export async function saveDoc(collectionPath, docId, data) {
  try {
    const exists = await checkIfDocExists(collectionPath, docId); // Kiểm tra tài liệu đã tồn tại
    if (exists) {
      const confirmOverwrite = confirm(
        "Tài liệu đã tồn tại. Bạn có muốn ghi đè không?"
      );
      if (!confirmOverwrite) {
        alert("Lưu tài liệu bị hủy.");
        return false;
      }
    }
    
    const docRef = doc(db, collectionPath, docId); // Tham chiếu đến tài liệu
    await setDoc(docRef, data); // Lưu dữ liệu vào Firestore
    
    const selectMovieList = document.getElementById("select-movie-list");
    const selectFeature = document.getElementById("select-feature");
    const selectExistingVideo = document.getElementById(
      "select-existing-video"
    );
    const videoDropdown = document.getElementById("video-dropdown");
    const addVideoList = document.getElementById("add-video-to-list");

    return true;
  } catch (error) {
    alert(`Lỗi khi lưu tài liệu: ${error.message}`);
  }
}
//load Option
export async function loadOption(contentType){
  try{
    if(contentType === "feature"){
      return await getDocsId("feature");
    }
    if(contentType === "movieList"){
      return await getDocsId("movieList")
    }
    if(contentType === "videos"){
      return await getDocsId("videos")
    }
    return []
  }catch(error){
    return [];
    
  }
}
