import React, { useState,useEffect } from 'react';
import "../../styles/AddContent.css";
import {loadOption} from "/src/components/AddContent.js";
const VideoManager = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoOptions, setVideoOptions] = useState([]);
  const [selectedVideo,setSelectedVideo] = useState();
  // Hàm xử lý khi tải video
  const fetchVideo = async() =>{
    try{const data= await loadOption("videos");
        setVideoOptions(data);
       }catch(error){
         
       }
  }
  useEffect(() =>{
    fetchVideo();
  },[]);
  const handleLoadVideo = () => {
    videoOptions.current.value
    
  };

  // Hàm xử lý khi tải URL Youtube
  const handleLoadUrl = () => {
    // Logic xử lý tải URL Youtube, nếu có
  };

  // Hàm xử lý gửi form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic lưu video, ví dụ: gửi form tới API hoặc Firestore
    console.log({
      videoTitle,
      videoDescription,
      youtubeUrl,
      videoThumbnail,
      videoUrl,
    });
  };

  return (
    <div id="video-manager-section" className="section">
      <h2 className="content-title">Video</h2>
      <p className="content-desc">Dán link youtube hoặc url vào, youtube sẽ tự chuyển đổi</p>

      {/* Dropdown để chọn video đã có */}
        <label className="selectLabel">Chọn video có sẵn:
        <select id="add-video-to-list" value={selectedVideo}>
        <option value="">New</option>
          {videoOptions.length >0 ?(
          videoOptions.map((video) => (
          <option value={video} key={video}>
              {video}</option> ))):""}
        </select>
        <button id="load-video" onClick={handleLoadVideo}>Tải Video</button>
          </label>
      
      {/* Form thêm video mới */}
      <form id="new-video-form" onSubmit={handleSubmit}>
        <div id="video-form">
          <label >Tiêu đề video:
          <input
            type="text"
            name="videoTitle"
            id="videoTitle"
            placeholder="Nhập tiêu đề video"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
          /></label>

          <label >Mô tả:
          <input
            type="text"
            name="videoDescription"
            id="videoDescription"
            placeholder="Nhập mô tả video"
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
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
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
          </label>

            
         

          <label>URL Thumbnail:
          <input
            type="text"
            name="videoThumbnail"
            id="videoThumbnail"
            placeholder="Nhập URL thumbnail"
            value={videoThumbnail}
            onChange={(e) => setVideoThumbnail(e.target.value)}
          /></label>

          <label >URL Video:
          <input
            type="text"
            name="videoUrl"
            id="videoUrl"
            placeholder="Nhập URL video"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          /></label>

          <button type="submit" className="save-content-button">Lưu Video</button>
        </div>
      </form>
    </div>
  );
};

export default VideoManager;
