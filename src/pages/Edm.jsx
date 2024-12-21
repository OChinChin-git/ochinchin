import React, { useState, useEffect, useRef } from "react";
import "../styles/Edm.css";
import { useLoader } from "../components/LoaderContext";
import { useToast } from "../components/ToastContext";
import { useDialog } from "../components/DialogContext";
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
  query,
  where,
  orderBy,
  startAfter,
  limit,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const db = getFirestore();
const edmRef = collection(db, "edm");

const getEdmList = async () => {
  const data = await getDocs(edmRef);
  const finalData = data.docs.map((edm) => {
    return {
      id: edm.id,
      ...edm.data(),
    };
  });
  return finalData;
};
const saveEdm = async (name, url, showToast) => {
  const embedUrl = convertToEmbedUrl(url);
  if(embedUrl == 'yamate'){
    showToast('Nhập url youtube...')
    return
  }
  const data = {
    name: name,
    url: embedUrl,
  };
  const edmDocRef = doc(edmRef, name);
  const edmDocSnap = await getDoc(edmDocRef);
  if (edmDocSnap.exists()) {
    const isConfirm = confirm("Tên đã tồn tại, thay thế chứ?");
    if (!isConfirm) {
      showToast("Đã hủy");
      return;
    }
  }
  await setDoc(edmDocRef, data);
  showToast('Thêm thành công')
};
  const convertToEmbedUrl = (url) => {
    // Sửa biểu thức chính quy để bao gồm các URL YouTube live
    const youtubeRegEx =
      /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?][^#]*)?/;

    const match = url.match(youtubeRegEx);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`; // Trả về URL nhúng
    }

    return 'yamate'; // Nếu không phải URL YouTube hợp lệ, trả về URL gốc
  };
const EdmTest = () => {
  const [wave, setWave] = useState(false);
  const [activeButton, setActiveButton] = useState(false);
  const [hideList, setHideList] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const iframeRef = useRef();
  const { showLoader, hideLoader } = useLoader(); // Use loader context
  const { showToast } = useToast();
  const { showPrompt } = useDialog();
  const [edmList, setEdmList] = useState([]);
  const [currentEdm, setCurrentEdm] = useState(null);
  const [isYoutubeAPIReady,setIsYoutubeAPIReady] = useState(false);
  const [youtubePlayer,setYoutubePlayer] = useState(null);
  const [isPlayerReady,setIsPlayerReady] = useState(false);
  const [youtubeVideoId,setYoutubeVideoId] = useState(null);
  const [playbackState,setPlaybackState]=useState();
  const [durationTime,setDurationTime] = useState();
  const [currentTime,setCurrentTime] = useState();
  const [edmVolume,setEdmVolume] = useState(100);
  const [edmPlaybackRate,setEdmPlaybackRate] = useState(1);
  const [edmFakeVolume,setEdmFakeVolume] = useState(100);
  const [tempCurrentTime,setTempCurrentTime] = useState(null);
  const [hideManagerList,setHideManagerList] = useState(true);
  const [edmCustomList,setEdmCustomList] =useState([]);
  const fetchEdmList = async () => {
    const data = await getEdmList();
    setEdmList(data);
    setEdmCustomList(data);
  };
  useEffect(() => {
    fetchEdmList();
    const storedVolume = localStorage.getItem("edmVolume");
    if (storedVolume !== null) {
      // Nếu có giá trị trong localStorage, chuyển thành số và cập nhật state
      setEdmVolume(Number(storedVolume));
    }
  }, []);
  const handleNextEdm = () => {
    if (edmList.length == 0) {
      return;
    }
    
    let nextIndex = null;
    
    if(currentEdm == null){
      if(!isShuffled){
        setCurrentEdm(edmList[0])
      }else{
        nextIndex = Math.floor(Math.random() * edmList.length);
        setCurrentEdm(edmList[nextIndex]);
      }
      return
    }
    
    const currentIndex = edmList.findIndex((edm) => edm.id === currentEdm.id);
    if (currentIndex === -1) {
      return;
    }
    
    if (!isShuffled) {
      nextIndex = (currentIndex + 1) % edmList.length;
    } else {
      do {
        nextIndex = Math.floor(Math.random() * edmList.length);
      } while (nextIndex === currentIndex);
    }
    setCurrentEdm(edmList[nextIndex]);
  };
useEffect(() => {
  const tag = document.createElement('script');
  tag.src = '//www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  window.onYouTubeIframeAPIReady = () => {
    setIsYoutubeAPIReady(true);
  };
}, []);

useEffect(() => {
  if (!isYoutubeAPIReady) return;

  const newPlayer = new window.YT.Player(iframeRef.current, {
    height: "0", // Chiều cao 0 để chỉ phát âm thanh
    width: "0",  // Chiều rộng 0
    playerVars: {
      controls: 0,           // Ẩn điều khiển video
      modestbranding: 1,     // Loại bỏ logo YouTube
      rel: 0,                // Không hiển thị video liên quan
      showinfo: 0,           // Ẩn thông tin video
      autoplay: 1,           // Tự động phát
      origin: window.location.origin, // Đảm bảo hoạt động trên các tên miền cụ thể
    },
    events: {
      onReady: () => {
        setIsPlayerReady(true); // Đảm bảo player sẵn sàng trước khi gọi loadVideoByUrl
      },
      onStateChange: onPlayerStateChange
    },
  });
  setYoutubePlayer(newPlayer);
}, [isYoutubeAPIReady]);
  
  const onPlayerStateChange = async (event) => {
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        setPlaybackState("Playing");
        break;
      case window.YT.PlayerState.PAUSED:
        setPlaybackState("Paused");
        break;
      case window.YT.PlayerState.ENDED:
        setPlaybackState("Ended");
        break;
      case window.YT.PlayerState.UNSTARTED:
        setPlaybackState('Loading');
        break;
      default:
        setPlaybackState("Idle");
    }
  };
  useEffect(()=>{
    if(playbackState === "Idle" || playbackState === "Loading") {
      showLoader('Đang tải...')
      setActiveButton(false);
      setWave(false);
    }else{
      hideLoader();
    if(playbackState == 'Paused' ){
      setActiveButton(false);
      setWave(false)
    }else if(playbackState == 'Playing'){
      setActiveButton(true);
      setWave(true)
    }else if(playbackState == 'Ended'){
      handleNextEdm();
    }
    }
  },[playbackState])
  const formatTime = (time)=>{
    const hours = Math.floor(time / 3600 % 24)
    const minutes = Math.floor(time / 60 %60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    let formatedTime;
    if(hours!==0){
      formatedTime = (`${hours}:${minutes}:${seconds}`);
    }else{
      formatedTime =(`${minutes}:${seconds}`);
    }
    return formatedTime;
  }
  useEffect(() => {
    if (youtubePlayer && isPlayerReady && youtubeVideoId) {
      youtubePlayer.loadVideoById(youtubeVideoId);
      // Lắng nghe sự kiện để đợi video tải xong metadata
      const handleMetadataLoaded = () => {
        const videoDuration = youtubePlayer.getDuration();
        if (videoDuration > 0) {
          setDurationTime(parseFloat(videoDuration.toFixed(2)))
        } else {
        }
      };

      youtubePlayer.addEventListener("onStateChange", (event) => {
        if (event.data === window.YT.PlayerState.UNSTARTED || event.data === window.YT.PlayerState.CUED) {
          handleMetadataLoaded();
        }
      });

      // Xóa listener khi component unmount
      return () => {
        youtubePlayer.removeEventListener("onStateChange", handleMetadataLoaded);
      };
    }
  }, [youtubeVideoId, youtubePlayer, isPlayerReady]);
  
useEffect(() => {
  if (!activeButton || !youtubePlayer) return;

  const interval = setInterval(() => {
    const videoCurrentTime = youtubePlayer.getCurrentTime(); // Lấy thời gian hiện tại của video
    if(videoCurrentTime >0){
    setCurrentTime(parseFloat(videoCurrentTime.toFixed(2))) // Cập nhật thời gian
    }
  }, 500);

  return () => clearInterval(interval); // Dọn dẹp interval khi unmount hoặc khi activeButton thay đổi
}, [activeButton, youtubePlayer]);

  const handlePlayPause = () => {
    if (!isYoutubeAPIReady || !isPlayerReady || !youtubePlayer ||edmList.length == 0) {
      return;
    }
    if(currentEdm == null){
      if(!isShuffled){
        setCurrentEdm(edmList[0]);
      }else{
        const nextIndex = Math.floor(Math.random()*edmList.length);
        setCurrentEdm(edmList[nextIndex]);
      };
    }
    const playerState = youtubePlayer.getPlayerState();
    if (playerState === window.YT.PlayerState.PLAYING) {
      youtubePlayer.pauseVideo();
    }
    if (playerState === window.YT.PlayerState.PAUSED || playerState === window.YT.PlayerState.CUED) {
      youtubePlayer.playVideo();
    }
  };
    const getVideoId = ()=>{
      const embedUrl = currentEdm.url
      const youtubeId = embedUrl.split("/embed/")[1];
      return youtubeId;
    }
  useEffect(()=>{
    if(currentEdm == null || !isPlayerReady) return;
    const youtubeId = getVideoId();
    setYoutubeVideoId(youtubeId);
    const edmElement = document.getElementById(formatId(currentEdm.name))
    edmElement.scrollIntoView({behavior:'smooth',block:'center'})
  },[currentEdm,isPlayerReady])
  useEffect(()=>{
    if(youtubePlayer == null || currentEdm == null || !isPlayerReady)return;
    const youtubeVolume = youtubePlayer.getVolume();
    if(edmVolume !== youtubeVolume){
      youtubePlayer.setVolume(edmVolume)
    }
  },[edmVolume,youtubePlayer,currentEdm])
  useEffect(()=>{
    if(edmVolume !== edmFakeVolume){
      setEdmFakeVolume(edmVolume);
    }
    localStorage.setItem('edmVolume',edmVolume);
  },[edmVolume])
  const onEdmVolumeChange = (e)=>{
  if(currentEdm == null)return
  setEdmVolume(e.target.value)
  }
  const [onInputCurrentTime,setOnInputCurrentTime] = useState(false)
  useEffect(()=>{
    if(currentTime==tempCurrentTime || onInputCurrentTime) return;
    setTempCurrentTime(currentTime)
  },[currentTime])
  const formatId = (str) => {
  return str
    .replace(/\s+/g, '_')  // Thay thế khoảng trắng bằng dấu gạch dưới
    .replace(/[^a-zA-Z0-9_-]/g, '')  // Loại bỏ các ký tự không hợp lệ
    .toLowerCase();  // Chuyển thành chữ thường để đảm bảo tính nhất quán
};
  const managerListRef = useRef();
  const handleClickOutSide=(e)=>{
    if(managerListRef.current && !managerListRef.current.contains(e.target)){
      setHideManagerList(true);
    }
  };
  useEffect(()=>{
    document.addEventListener('mousedown',handleClickOutSide)
    return()=>{
      document.removeEventListener('mousedown',handleClickOutSide)
    }
  },[])
  return (
    <div className="edm-container">
      <div className="edmphiphai">
        <h1 className="animated2">Phi phai</h1>
        <div className="input-id-and-button">
          <input type="text" placeholder="Nhập ID" style={{display:'none'}}/>

          <button onClick={(e)=>{
              setHideManagerList(!hideManagerList);
            }}>Quản lí List</button>
          <button
            onClick={async () => {
              const edmInputName = await showPrompt("Nhập tên cho bài hát");
              const edmInputUrl = await showPrompt("Nhập url youtube ");
              await saveEdm(edmInputName, edmInputUrl,showToast);
              fetchEdmList();
            }}
          >
            Thêm edm
          </button>
        <div className={'manager-edm-list'}
          ref={managerListRef}
          style={hideManagerList?{display:'none'}:{}}>
          <ul className='manager-ul'>
            {edmCustomList.length >0 ? edmCustomList.map((edm)=>(
            <li key={edm.name}
              className='manager-li'>{edm.name}
                <input type="checkbox" className="manager-checkbox" 
                  defaultChecked={edmList.includes(edm)? true:false}
                  onChange={(e)=>{
                    if(e.target.checked){
                      setEdmList((prev)=>[...prev,edm])
                    }
                    else{
                      setEdmList((prev)=>prev.filter((item)=>item !== edm))
                    }
                  }}
                  />
              </li>
            )):(<li className='manager-li'>Không có edm nào...</li>)}
          </ul>
        </div>
        </div>
        <div className="current-song-info">
          <div
            className="circle"
            style={{
              animation: wave ? "" : "none",
            }}
          >
            <p id="currentSongTitle" className="animated3">
              <span>{currentEdm ? 'Bài hiện tại: '+currentEdm.name : "Chọn 1 bài..."}</span>
            </p>
            <p id="currentSongIndex">
              Thứ tự:{" "}
              <span id="currentIndex">
                {currentEdm
                  ? (()=>{ 
                  const findedIndex = edmList.findIndex((edm) => edm.id === currentEdm.id)
                  return findedIndex == -1 ? 'Bị xóa': findedIndex +1;
                })()
                  : "__"}
              </span>{" "}
              / <span id="totalSongs">{edmList ? edmList.length : "__"}</span>
            </p>
            <p>
              Thời gian đã phát:
              <br />
              <span id="currentTime">{currentTime != null ? formatTime(tempCurrentTime) : '__'}</span> /
              <span id="durationTime">{durationTime != null ? formatTime(durationTime) : '__'}</span>
            </p>
            <input type="range" id="seekBar" step="1" min="0" 
              max={Math.floor(durationTime) || 0}
              value = {Math.floor(tempCurrentTime)|| 0}
              onMouseUp={(e)=>{
                if(!youtubePlayer || currentTime == null)return;
                const seekTime = Number(e.target.value);
                youtubePlayer.seekTo(seekTime,true)
                setTempCurrentTime(seekTime);
                setOnInputCurrentTime(false);
              }}
              onTouchEnd={(e)=>{
                if(!youtubePlayer || currentTime == null)return;
                const seekTime = Number(e.target.value);
                youtubePlayer.seekTo(seekTime,true)
                setTempCurrentTime(seekTime);
                setOnInputCurrentTime(false);
              }}
              onInput={(e)=>{
                setTempCurrentTime(Number(e.target.value))
                setOnInputCurrentTime(true);
              }}
              />
          </div>
        </div>

        <div className="controls">
          <button id="playPauseBtn" onClick={handlePlayPause}>
            {activeButton ? "Tạm dừng" : "Phát"}
          </button>
          <button id="nextBtn" onClick={handleNextEdm}>
            Bài tiếp theo
          </button>
          <div className="speed-control">
            <label className="speed-input-button">
              Tốc độ:
              <input
                onChange={(e)=>{
                  const value =parseFloat(e.target.value);
                  if(isNaN(value)){
                    setEdmPlaybackRate('');
                  }
                  else
                  setEdmPlaybackRate(value);
                }}
                type="number"
                id="speedInput"
                step="0.05"
                min="0.25"
                max="2"
                value={edmPlaybackRate}
                onKeyDown={(e)=>{
                  if(e.key !=='Enter')return;
                  if(edmPlaybackRate<0.25|| edmPlaybackRate>2){
                    showToast('Từ 0.25 - 2')
                    return
                  }
                  if(youtubePlayer == null || currentEdm == null) return;
                  youtubePlayer.setPlaybackRate(Number(edmPlaybackRate));
                  showToast('Tốc độ hiện tại: ' + edmPlaybackRate)
                }}
              />
              <button id="setSpeedBtn" onClick={()=>{
                  if(edmPlaybackRate<0.25|| edmPlaybackRate>2){
                    showToast('Từ 0.25 - 2')
                    return
                  }
                  if(youtubePlayer == null || currentEdm == null) return;
                  youtubePlayer.setPlaybackRate(Number(edmPlaybackRate));
                  showToast('Tốc độ hiện tại: ' + edmPlaybackRate)
                }}>
            Đặt tốc độ
          </button>
            </label>
          </div>
        </div>

        <div>
          <input type="range" id="volume-slider" min="0" max="100"
            onInput={(e)=>{
              if(currentEdm == null)return;
              setEdmFakeVolume(e.target.value);
            }}
            onMouseUp={onEdmVolumeChange}
            onTouchEnd={onEdmVolumeChange}
            value={edmFakeVolume}/>
          <span id="volume-percentage">{edmFakeVolume}%</span>{" "}
        </div>

        <h3>
          Danh sách
          <button id="toggleListBtn" onClick={() => setHideList(!hideList)}>
            {hideList ? " + " : " - "}
          </button>
          <button id="shuffleBtn" onClick={() => setIsShuffled(!isShuffled)}>
            {isShuffled ? "Hủy Random" : "Random"}
          </button>
        </h3>

        <div
          className="list-edm"
          style={{ display: hideList ? "none" : "block" }}
        >
          <ul id="songList">
            {edmList.length > 0 ? (
              edmList.map((edm) => (
                <li
                  key={edm.name}
                  id={formatId(edm.name)}
                  className={`song-item 
                ${currentEdm == edm ? "active" : ""} `}
                  onClick={() => {
                    setCurrentEdm(edm);
                  }}
                >
                  {edm.name}
                </li>
              ))
            ) : (
              <li className="song-item">Không có bài nào</li>
            )}
          </ul>
        </div>
        <div ref={iframeRef} style={{display:'none'}}></div>
      </div>
    </div>
  );
};
export default EdmTest;
