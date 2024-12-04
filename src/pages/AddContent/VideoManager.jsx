import React, { useState,useEffect,useRef } from 'react';
import "../../styles/AddContent.css";
import {loadOption,saveDoc,processUrl,loadDoc} from "/src/components/AddContent.js";
import {useToast} from "/src/components/ToastContext"
import {useLoader} from "/src/components/LoaderContext";

const VideoManager = () => {
  const {showToast} =useToast();
  const {showLoader,hideLoader} =useLoader();
  
  const [videoOptions, setVideoOptions] = useState([]);
  const [selectedVideo,setSelectedVideo] = useState("");
  const youtubeUrlRef = useRef();
  const videoThumbnailRef = useRef();
  const videoUrlRef = useRef();
  const videoTitleRef=useRef();
  const videoDescRef=useRef();
  const formRef = useRef();
  const [isSave,setIsSave] = useState(false);
  // Hàm xử lý khi tải video
  const fetchVideo = async() =>{
    try{const data= await loadOption("videos");
        setVideoOptions(data);
       }catch(error){
         
       }
  }
  useEffect(() => {
  fetchVideo(); // Gọi fetchVideo lần đầu
}, []);
  useEffect(() =>{
    if(isSave){
    fetchVideo();
    setIsSave(false)
    }
  },[isSave]);

  // Hàm xử lý khi tải URL Youtube
  const handleLoadUrl = () => {
    const url = youtubeUrlRef.current.value;
    videoUrlRef.current.value = url;
    videoThumbnailRef.current.value = url;
  };

  // Hàm xử lý gửi form
  const handleSubmit = async(event) => {
    event.preventDefault();
     
    const videoTitle = videoTitleRef.current.value;
    const videoUrl = videoUrlRef.current.value;
    const thumbnailUrl = processUrl(videoThumbnailRef.current.value);
    const data={
      videoTitle: videoTitle,
      videoDescription:videoDescRef.current.value,
      videoUrl:videoUrl,
      videoThumbnail: thumbnailUrl ,
    }
    
    showLoader("Đang lưu video: "+videoTitle);
    try{
    const result = await saveDoc("videos",videoTitle,data);
      if(result === 'canceled'){
        showToast("Đã hủy")
        return
      }
      showToast("Lưu thành công video: " +videoTitle,"success")
      formRef.current.reset();
      setIsSave(true);
    }catch(error){
    alert("lỗi rồi "+ error)}
    finally{
      hideLoader("");
    }
  };

    const handleLoadVideo = async() => {
    if(selectedVideo===""){
      const isConfirm = confirm("Chưa có video nào được chọn, làm trống các ô")
      if(!isConfirm){
        showToast("Đã hủy");
        return
      }
      formRef.current.reset();
      showToast("Đã làm trống ")
    }else{
      try{
        showLoader("Đang load video: "+ selectedVideo);
        const data = await loadDoc("videos",selectedVideo);
        if(data){
          videoTitleRef.current.value = data.videoTitle;
          videoUrlRef.current.value = data.videoUrl;
          videoThumbnailRef.current.value = data.videoThumbnail;
          videoDescRef.current.value= data.videoDescription;
        }
      }catch(error){
        alert(error)
      }finally{
        hideLoader();
      }
    }
  };
  return (
    <div id="video-manager-section" className="section">
      <h2 className="content-title">Video</h2>
      <p className="content-desc">Dán link youtube hoặc url vào, youtube sẽ tự chuyển đổi</p>

      {/* Dropdown để chọn video đã có */}
        <label className="selectLabel">Chọn video có sẵn:
        <select id="add-video-to-list" value={selectedVideo} onChange={(e) =>setSelectedVideo(e.target.value)}>
        <option value="">New</option>
          {videoOptions.length >0 ?(
          videoOptions.map((video) => (
          <option value={video} key={video}>
              {video}</option> ))):""}
        </select>
        <button id="load-video" onClick={handleLoadVideo}>Tải Video</button>
          </label>
      
      {/* Form thêm video mới */}
      <form id="new-video-form" ref={formRef} onSubmit={handleSubmit}>
        <div id="video-form">
          <label >Tiêu đề video:
          <input
            type="text"
            name="videoTitle"
            id="videoTitle"
            placeholder="Nhập tiêu đề video"
            ref={videoTitleRef}
          /></label>

          <label >Mô tả:
          <input
            type="text"
            name="videoDescription"
            id="videoDescription"
            placeholder="Nhập mô tả video"
            ref={videoDescRef}
          /></label>
            
          
            <label >
            <label className="selectLabel"><p className="content-desc">(Có thể bỏ qua) Dán link youtube vào đây cho cả Url Thumbnail và Video:</p>
            <button
            id="loadUrlButton"
            type="button"
            onClick={handleLoadUrl}
          >
            Load Youtube Url
          </button>
          </label>
          <input
            type="text"
            name="youtubeUrl"
            id="youtubeUrl"
            placeholder="Nhập URL youtube hoặc bỏ qua"
            ref={youtubeUrlRef}
          />
          </label>

            
         

          <label>URL Thumbnail:
          <input
            type="text"
            name="videoThumbnail"
            id="videoThumbnail"
            placeholder="Nhập URL thumbnail"
            ref={videoThumbnailRef}
          
          /></label>

          <label >URL Video:
          <input
            type="text"
            name="videoUrl"
            id="videoUrl"
            placeholder="Nhập URL video"
            ref={videoUrlRef}
            
          /></label>

          <button type="submit" className="save-content-button">Lưu Video</button>
        </div>
      </form>
    </div>
  );
};

export default VideoManager;
