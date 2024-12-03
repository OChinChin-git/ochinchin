import React,{useState,useEffect} from 'react';
import {useLocation} from 'react-router-dom'
import {getVideo} from '../components/Video'
import { useLoader } from "../components/LoaderContext"; 
import { useToast } from '../components/ToastContext';
import {useDialog} from '../components/DialogContext';

const Video =()=>{
  const { showLoader, hideLoader } = useLoader(); // Use loader context
  const { showToast } = useToast();
  const { showPrompt } = useDialog();

  const location = useLocation();
  const query = location.search;
  const [videoUrl,setVideoUrl] = useState("");
  const [videoTitle,setVideoTitle] =useState("");
  
  const videoId = query.substring(1); // Lấy giá trị sau `?v`
  
const convertToEmbedUrl = (url) => {
  const youtubeRegEx = /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[?&]v=)|youtu\.be\/))([a-zA-Z0-9_-]{11})(?:[&?][^#]*)?/;
  const match = url.match(youtubeRegEx);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`; 
  }
  return url; 
}


const convertPornhubToEmbedUrl = (url) => {
  const pornhubRegEx = /^https:\/\/(?:[a-zA-Z0-9-]+\.)?pornhub\.com\/view_video\.php\?viewkey=([a-zA-Z0-9_-]+)/;
  const pornhubMatch = url.match(pornhubRegEx);
  
  if (pornhubMatch && pornhubMatch[1]) {
    const videoKey = pornhubMatch[1];
    return `https://www.pornhub.com/embed/${videoKey}`; 
  }
  return url; 
}

const convertUrl = (url) => {
  try {
    let convertedUrl = convertToEmbedUrl(url); // Convert to YouTube embed URL
    convertedUrl = convertPornhubToEmbedUrl(convertedUrl); // Convert to Pornhub embed URL if applicable
    return convertedUrl;
  } catch (error) {
    alert(error);
  }
}

  const videoInfo = async()=>{
    try{
      showLoader("Đang tải video");
      const data = await getVideo(videoId);
      const url=data.url
      const title = data.title;
      const embedUrl = await convertUrl(url);
      setVideoUrl(embedUrl);
      setVideoTitle(title);
    }catch(error){
      alert(error)
    }finally{
      hideLoader();
    }
    
  }
  useState(()=>{
    videoInfo();
},[])
//
//
//
//
  return(
    <div className="video-block">
      <link rel="stylesheet" href="src/styles/Video.css"></link>
      <div className="video-container">
        <iframe frameborder="0" allowfullscreen allowtransparency="true" src={videoUrl} className="video"></iframe>
        <div className="title animated2" value={videoTitle}>{videoTitle}</div>
      </div>
      
      <div className="chat" >
        <div className="avatar">
        </div>
        <div className="chat-content">
        </div>
      </div>
    </div>
  )
}
export default Video;