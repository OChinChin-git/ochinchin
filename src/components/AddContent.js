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
  apiKey: "AIzaSyAqvFTdSubEm_vWeevlvUhkLgPBxdBasL0",
  authDomain: "ochinchin-7b3d8.firebaseapp.com",
  projectId: "ochinchin-7b3d8",
  storageBucket: "ochinchin-7b3d8.firebasestorage.app",
  messagingSenderId: "364411060998",
  appId: "1:364411060998:web:b7f31215e5cb0d0fbf1487",
  measurementId: "G-BFRZ15ZNEC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const typeRef = doc(db,"content","type");

async function getDocsId(type) {
  try {
    const colRef = collection(typeRef,type);
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
function getTypeRef(type){
  return collection(typeRef,type);
}
//Kiểm tra xem file tồn tại không
async function checkIfDocExists(type, docId) {
  try {
    const ref = getTypeRef(type);
    const docRef = doc(ref, docId); // Tham chiếu đến tài liệu
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
function isYoutubeUrl(url) {
  const youtubePattern = /^(https?\:\/\/)?(www\.)?(youtube|youtu)\.(com|be)\//;
  if (youtubePattern.test(url)) {
    
    return true; // URL là YouTube
  }
  return false; // URL không phải YouTube
}
function getYoutubeId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S+\/v\/|(?:\S+)?(?:[?&]v=|\S+\/))([a-zA-Z0-9_-]{11})|youtu\.be\/([a-zA-Z0-9_-]{11}))/;
  const match = url.match(regex);
  return match ? (match[1] || match[2]) : null;
}

function getYoutubeThumbnail(url) {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
export function processUrl(url) {
  if (url && isYoutubeUrl(url)) {
     
    return getYoutubeThumbnail(url) || url; 
  }
  return url;
}
//save 
export async function saveDoc(type, docId, data) {
  try {

     const ref=getTypeRef(type);
    const idRef = getTypeRef("videosId");
    const docRef = doc(ref, docId);
    const exists = await checkIfDocExists(type,docId); // Kiểm tra tài liệu đã tồn tại
    if(type=="videos"){
      if(!exists){
      const videoId ="v"+Date.now();
      const idDocRef = doc(idRef,videoId);
      data.videoId = videoId;
      const idData ={
        videoId:videoId,
        videoTitle: data.videoTitle,
      }
      await setDoc(idDocRef,idData)
      }

    }
    if(type=="feature"){
      if(!exists){
        const videoId ="f" +Date.now();
        const idDocRef = doc(idRef,videoId);
        data.videoId = videoId;
        const idData = {
          videoId:videoId,
          videoTitle:data.title,
        }
        await setDoc(idDocRef,idData)
      }
    }
    if (exists) {
      const confirmOverwrite = confirm(
        "Tài liệu đã tồn tại. Bạn có muốn ghi đè không?"
      );
      if (!confirmOverwrite) {
        return 'canceled';
      }
      await updateDoc(docRef, data); 
    }else{ 
      await setDoc(docRef, data); }
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
export async function loadDoc(type,docId){
  try{
    const ref = getTypeRef(type);
   const docRef = await doc(ref,docId);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      return docSnap.data();
    }else{
      alert(type+" "+docId +" Không tồn tại");
      return null;
    }
  }catch(error){
    alert(error);
  }
}

// Lấy giá trị hiện tại từ Firestore
async function getCurrentValuesFromFirestore(orderRef) {
  const orderDoc = await getDoc(orderRef);
  if (!orderDoc.exists()) return [];

  const data = orderDoc.data();
  return Object.keys(data).map((key) => data[key]);
}

// Lấy giá trị mới từ các collections
async function getNewValues() {
  const featureRef = await getTypeRef("feature");
  const movieListRef = await getTypeRef("movieList");
  const [featureDocs, movieListDocs] = await Promise.all([
    getDocs(featureRef),
    getDocs(movieListRef),
  ]);

  const newValues = [];

  featureDocs.forEach((doc) => {
    newValues.push(`feature ${doc.id}`);
  });

  movieListDocs.forEach((doc) => {
    newValues.push(`movieList ${doc.id}`);
  });

  return newValues;
}

// Hàm cập nhật Firestore với thứ tự giá trị đã xử lý
async function updateFirestore(orderRef, finalValues) {
  let updatedData = {};

  // Duyệt qua danh sách giá trị đã xử lý để tạo lại các field
  finalValues.forEach((value, index) => {
    updatedData[index + 1] = value; // Field là số thứ tự (1, 2, 3, ...)
  });

  // Ghi đè toàn bộ dữ liệu vào Firestore
  await setDoc(orderRef, updatedData);
}
export async function syncOrderData() {
  try {
    const orderRef = doc(db, "content", "order"); // Tham chiếu tới tài liệu `order`

    // Lấy giá trị hiện tại từ Firestore
    const currentValues = await getCurrentValuesFromFirestore(orderRef);

    // Lấy các giá trị mới từ feature và movieList
    const newValues = await getNewValues();

    // Dò và xử lý các giá trị
    let finalValues = [];

    // 1. Giữ nguyên giá trị có trong currentValues và newValues
    currentValues.forEach((value) => {
      if (newValues.includes(value)) {
        finalValues.push(value);
      }
    });

    // 2. Thêm các giá trị mới vào cuối
    newValues.forEach((value) => {
      if (!currentValues.includes(value)) {
        finalValues.push(value);
      }
    });

    // Cập nhật Firestore với danh sách giá trị đã xử lý
    await updateFirestore(orderRef, finalValues);

    console.log("Dữ liệu đã đồng bộ thành công!");
    
  } catch (error) {
    console.error("Lỗi khi đồng bộ dữ liệu:", error);
    
  }
}
export async function loadOrder(){
  try{
    const docRef = await doc(db,"content","order");
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      const data = docSnap.data();
      const result=[];
      for(const key in data){
        if(data.hasOwnProperty(key)){
          const value = data[key];
          const[type,...rest] = value.split(' ');
          const name = rest.join(' ');
          result.push({
            type:type,
            name:name,
          });
        }
      }
      return result;
    }else{
      alert("Không tồn tại ")
    }
  }catch(error){
    alert(error);
  }
}
export async function saveOrder(data){
  try{
      const docRef = await doc(db,"content","order");
  const saveData = [];
  data.map((v) =>{
    const value = v.type + ' ' +v.name;
    saveData.push(value)
  })
  await updateFirestore(docRef,saveData);
  }catch(error){
    alert(error)
  }

}
export async function deleteContent(type,name){
  try{
    const ref = getTypeRef(type);
    const docRef = doc(ref,name);
    await deleteDoc(docRef);
  }catch(error){
    alert(error)
  }
}
