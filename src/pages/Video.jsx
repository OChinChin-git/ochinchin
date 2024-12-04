import React,{useState,useEffect,useRef} from 'react';
import {useLocation} from 'react-router-dom'
import {getVideo} from '../components/Video'
import { useLoader } from "../components/LoaderContext"; 
import { useToast } from '../components/ToastContext';
import {useDialog} from '../components/DialogContext';
import {sendChats,getTime,getChats,trackVisitor, getActiveVisitorsCount} from '/src/components/Video';
import "../styles/Video.css"
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
  const [isCloseChat,setIsCloseChat] = useState(false);
  const messageRef = useRef();
  const [messages,setMessages] = useState([]);
  const [isCloseLatestChat,setIsCloseLatestChat] = useState(true);
  const latestMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const chatContainerRef = useRef(null); // Tham chiếu đến container chứa tin nhắn
  const audioRef = useRef(null); // Tham chiếu đến âm thanh

  const handleCloseChat = ()=>{
    setIsCloseChat(!isCloseChat)
  };
  const handleSendMessage = async()=>{
    try{
      if(messageRef.current.value.length ==""){
        messageRef.current.focus();
        return
      }
    const userId = localStorage.getItem("loggedInUserId") || "9njjU8JwUWeO0DqITxs3Q6Ldtvq1";
    const time = await getTime();
    await sendChats(videoId,time,userId,messageRef.current.value);
    messageRef.current.value="";
    }catch(error){
      alert(error);
    }
  }
  const handleKeyDown = (e) =>{
    if(e.key ==="Enter"){
      e.preventDefault();
      handleSendMessage();
    }
  }
  const handleCloseLatestChat = ()=>{
    setIsCloseLatestChat(true);
  }
  useEffect(()=>{
     if(messages.length >0){
    setIsCloseLatestChat(false);
     }
  },[latestMessage])
  const chatStyle = !isCloseChat
    ? isCloseLatestChat
      ? { display: "none" }
      : { display: "" }
    : { display: "none" };
  // Hàm cập nhật tin nhắn
const updateChats = (newChats) => {
  setMessages(newChats);

  // Cuộn xuống cuối khi có tin nhắn mới
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth', // Thêm tùy chọn cuộn mượt
    });
  }

  // Phát âm thanh khi có tin nhắn mới
  if (audioRef.current) {
    audioRef.current.play();
  }
};

  useEffect(() => {
    // Gọi getChats với videoId và callback updateChats để cập nhật dữ liệu chat
    const unsubscribe = getChats(videoId, updateChats);
    // Hủy đăng ký khi component unmount để tránh memory leaks
    return () => unsubscribe();
  }, [videoId]);
//
//
//
//
  const [activeVisitors, setActiveVisitors] = useState(0);

  useEffect(() => {
    // Bắt đầu theo dõi khi component được mount
    const stopTracking = trackVisitor();

    // Lắng nghe số lượng người truy cập từ Firestore và cập nhật thông qua callback
    const unsubscribe = getActiveVisitorsCount(setActiveVisitors); // setActiveVisitors là callback

    // Cleanup khi component unmount
    return () => {
      unsubscribe(); // Dừng lắng nghe số lượng người truy cập
      stopTracking(); // Dừng theo dõi người truy cập
    };
  }, []);
  return(
<div className="video-block">
  
  
  <div className="video-container">
    <iframe frameborder="0" allowfullscreen allowtransparency="true" src={videoUrl} className="video"></iframe>
    <div className="title animated2" value={videoTitle}>{videoTitle}</div>
  </div>
      
  <div className="chat" style={isCloseChat ? {display:""} : {display:"none"}}>
    <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3" preload="auto" />
    <div>
      <h3>Số người truy cập hiện tại: {activeVisitors}</h3>
    </div>
    <button className="x-button" onClick={handleCloseChat}>x</button>
    <div className="chat-container" ref={chatContainerRef}>
    {messages.length >0 ? (messages.map ((msg,index) =>(
    <div className="chat-content"
      key={index}
      >
      <img 
        className="avatar" 
        src={msg.avatar}
        alt="User Avatar"
      />
      <div className="message">
        <p className="user-name">{msg.displayName}</p>
        <p className="message-text">{msg.message} </p>
        <p className="message-time">{msg.time} </p>
      </div>
    </div>
      ))) : (  <div className="chat-content"

      >
      <img 
        className="avatar" 
        src={"https://www.dropbox.com/scl/fi/k8qnmihjagt0iqvsis354/icon1.jpg?rlkey=0wfxydgqudsdmxpy8bntyj7dq&dl=1"}
        alt="User Avatar"
      />
      <div className="message">
        <p className="user-name">OChinChin</p>
        <p className="message-text">Chưa có ai chat, hãy là người đầu tiên 😎</p>
        <p className="message-time">{new Date().toLocaleTimeString() }</p>
      </div>
    </div> )}
      </div>
    <div className="input-container">
      <input 
        type="text" 
        className="input-chat" 
        placeholder="Nhập tin nhắn..."
        ref={messageRef}
        onKeyDown={handleKeyDown}
      />
      <button 
        type="button" 
        className="input-button"
        onClick={handleSendMessage}

      >
        Gửi
      </button>
    </div>
  </div>
  
 
  <div className="latest-chat" 
   style={chatStyle}
    
    >
    <div className="latest-chat-header">
      <p className="latest-chat-text">Chat mới nhất</p>
      <button className="x-button" onClick={handleCloseLatestChat}>x</button>
    </div>
      <div className="latest-chat-container">
        {latestMessage && (
          <div className="chat-content">
            <img 
              className="avatar" 
              src={latestMessage.avatar}
              alt="User Avatar"
            />
            <div className="message">
              <p className="user-name">{latestMessage.displayName}</p>
              <p className="message-text">{latestMessage.message}</p>
              <p className="message-time">{latestMessage.time}</p>
            </div>
          </div>
        )}
      </div>
    </div>

  <button className="chat-toggle" onClick={handleCloseChat} style={isCloseChat ? {display: "none"} : {display: ""} }>Chat</button>
</div>
  )
}
export default Video;