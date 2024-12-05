import React,{useState,useEffect,useRef} from 'react';
import {useLocation} from 'react-router-dom'
import {getVideo} from '../components/Video'
import { useLoader } from "../components/LoaderContext"; 
import { useToast } from '../components/ToastContext';
import {useDialog} from '../components/DialogContext';
import {sendChats,getTime,getChats,trackVisitor, getActiveVisitorsCount,getActiveVisitors} from '/src/components/Video';
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
  useEffect(async()=>{
    const videos = await loadOption("videos");
    setVideoOptions(videos);
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
  const [selectRoom,setSelectRoom] = useState();
  const [roomOptions,setRoomOptions] =useState({});
  
  const handleSelectRoom = (e)=>{
    setSelectRoom(e.target.value);
  }
  useEffect (async()=>{
  const data = await loadOption("rooms")
  setRoomOptions(data);
  },[])
  const handleJoinRoom = async(r)=>{
    const rId = await getRoomsId(r);
    window.location.href= '/video?' + rId
  }
  
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
      
      {chose === "room-list" &&(
      <div className='room-list'>
          <ul>
            {roomOptions.length >0 ? (roomOptions.map((r)=>(
              <li className="room-li" key={r}>
                <a className="room-name">{r} </a>
                <button className="room-buttom" onClick={()=> handleJoinRoom(r)}>Vào phòng</button>
              </li>
            ))) : (
              <li className="room-li"> 
              <a className="room-name">Không có phòng nào</a> </li>
            )}
          </ul>
      </div>)}
      
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