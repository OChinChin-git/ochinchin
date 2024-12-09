import React,{useState,useEffect,useRef} from 'react';
import {useLocation} from 'react-router-dom'
import {getVideo} from '../components/Video'
import { useLoader } from "../components/LoaderContext"; 
import { useToast } from '../components/ToastContext';
import {useDialog} from '../components/DialogContext';
import {sendChats,getTime, getActiveVisitorsCount} from '/src/components/Video';
import "../styles/Room.css"
import {loadOption,loadDoc} from '../components/AddContent.js'
import {addRoom,getRoomsId} from '../components/Room'

const Room = ()=>{
  const{showLoader,hideLoader}=useLoader();
  const {showToast} =useToast();
  const [chose,setChose] = useState("room-list");
  const [isPass,setIsPass] = useState(false)
  const roomNameRef = useRef();
  const roomPassRef = useRef();
  const titleRef = useRef();
  const urlRef = useRef();
  const joinRoomPassRef = useRef();
  const [videoOptions,setVideoOptions] =useState([]);
  const [selectVideo,setSelectVideo] =useState("");
  const handleChangeChose =(e)=>{
    setChose(e.target.value);
  }
  const handleSetIsPass = ()=>{
    setIsPass(!isPass);
  }

  const handleSelectVideo=(e)=>{
    setSelectVideo(e.target.value);
  }
  const loadDataVideo = async()=>{
    try{
      if(selectVideo==""){
        return
      }
      showLoader("Đang load video");
      const data = await loadDoc("videos",selectVideo);
      titleRef.current.value = data.videoTitle;
      urlRef.current.value = data.videoUrl;
    }catch(error){
      alert(error)
    }finally{
      hideLoader();
    }
  }
  useEffect(()=>{
  loadDataVideo();
  },[selectVideo]);
  useEffect(()=>{
    const loadVideosOption = async()=>{
      const videos = await loadOption("videos");
    setVideoOptions(videos);
    }
    loadVideosOption();
  },[])

  const handleAddRoom = async()=>{
    try{
      const name = roomNameRef.current.value;
      const title = titleRef.current.value;
      const url = urlRef.current.value;
      let pass
      if(!isPass){
        pass = false;
      }else{
       pass = roomPassRef.current.value;
      }
      showLoader("Đang tạo");
      const resAddRoom = await addRoom(name,pass,title,url);
      if(resAddRoom =="lỗi"){
        showToast("Phòng đã tồn tại, chọn tên khác!");
        return
      }
      
      showToast("Tạo phòng thành công !Đang vào phòng...");
      setTimeout(()=>{
      window.location.href = '/video?' + resAddRoom;
        },2000)
    }catch(error){
      alert(error);
    }finally{
      hideLoader();
    }
  }
  const RoomList = () => {
  const [roomOptions, setRoomOptions] = useState({});
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomCount,setRoomCount] = useState(0);
  const [isCount,setIsCount] = useState(false);
  const [rId,setRId]=useState("");
  // Load danh sách phòng
  useEffect(() => {
    const fetchRooms = async () => {
      const data = await loadOption("rooms");
      setRoomOptions(data);
    };
    fetchRooms();
  }, []);

  // Tham gia phòng
  const handleJoinRoom = async () => {
    if (!selectedRoom) {
      alert("Chưa chọn phòng nào!");
      return;
    }
    try {
      window.location.href = `/video?${rId}`;
    } catch (error) {
      alert("Lỗi khi tham gia phòng: " + error);
    }
  };
useEffect(() => {
  if (rId === "") {
    return;
  }
  const unsubscribe = getActiveVisitorsCount(setRoomCount, rId);
  return () => {
    unsubscribe && unsubscribe(); // Kiểm tra nếu unsubscribe tồn tại
  };
}, [rId]);

useEffect(() => {
  if (selectedRoom === "") {
     setIsCount(false)
    return;
  }
    setIsCount(true)
  const fetchRoomId = async () => {
    const roomIds = await getRoomsId(selectedRoom);
    setRId(roomIds);
  };
  
  fetchRoomId();
}, [selectedRoom]);

  return (
    <div >
      <label className="selectLabel">
        Chọn phòng:
        <select
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
        >
          <option value="">-- Chọn phòng --</option>
          {Object.keys(roomOptions).length > 0 ? (
            Object.entries(roomOptions).map(([key, value]) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))
          ) : (
            <option value="">Không có phòng nào</option>
          )}
        </select>
      </label>
      <p className="p-abc"
        style={isCount ? {display:""} : {display:"none"} }
        >Số người hiện tại: {roomCount}</p>
      <button
        className="room-button"
        onClick={handleJoinRoom}
      >
        Vào phòng
      </button>
    </div>
  );
};
  return(
  <div className="room-background">
    <div className="room-container">
      <label className='selectLabel'>Tạo phòng hoặc tham gia
        <select value={chose}
          onChange={handleChangeChose}
          >
          <option value="room-list">Danh sách các phòng</option>
          <option value="add-room">Tạo phòng</option>
        </select>
      </label>
      
        {chose === "room-list" && <RoomList />}
      
      {chose ==="add-room" &&(
      <div className="add-room">
        <label >Nhập tên phòng
          <input type="text" className="room-name"  
            placeholder="Nhập tên phòng"
            ref={roomNameRef}
            />
        </label>
        <div className="room-setting">
          <p className="p-abc">Mật khẩu:<button onClick={handleSetIsPass} >{isPass ? ("có") : ("Không") }</button></p>
          <label style={isPass ? {display:""} : {display:"none"} }>Nhập mật khẩu
            <input type="password" className="room-pass" 
              placeholder="Nhập mật khẩu phòng"
              ref={roomPassRef}
              />
          </label>
          <label className='selectLabel'>Chọn video hoặc nhập thông tin video
            <select value={selectVideo} onChange={handleSelectVideo}>
              <option value="">--Chọn--</option>
              {videoOptions.length >0 ? (videoOptions.map((videoOption)=>(
              <option key={videoOption} value={videoOption}>{videoOption}</option>
              ))):(
                <option value="">Không có video nào</option>
              )  }  
            </select>
          </label>
          <label>Tên video
          <input type="text" placeholder="Nhập tên video"
            ref={titleRef}
            />
          </label>
          <label>link video
            <input type="text" placeholder="nhập url video"
              ref={urlRef}
              /> 
          </label>
        </div>
        <button className="room-buttom" onClick={handleAddRoom}>Tạo phòng</button>
      </div>)}
    </div>
  </div>
  )
}

export default Room;