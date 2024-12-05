import React,{useState,useEffect,useRef} from 'react';
import {useLocation} from 'react-router-dom'
import {getVideo} from '../components/Video'
import { useLoader } from "../components/LoaderContext"; 
import { useToast } from '../components/ToastContext';
import {useDialog} from '../components/DialogContext';
import {sendChats,getTime,getChats,trackVisitor, getActiveVisitorsCount} from '/src/components/Video';
import "../styles/Room.css"

const Room = ()=>{
  const [chose,setChose] = useState("room-list");
  
  const handleChangeChose =(e)=>{
    setChose(e.target.value);
    
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
          <option value="join-room">Tham gia phòng</option>
        </select>
      </label>
      
      {chose === "room-list" &&(
      <div className='room-list'>
          <ul>
            <li className="room-li"><a className="roomate">số người:0</a> 
              <a className="room-name">xyzzz</a> </li>
            <li className="room-li"><a className="roomate">số người:0</a> 
              <a className="room-name">xyzzz</a> </li>
            <li className="room-li"><a className="roomate">số người:0</a> 
              <a className="room-name">xyzzz</a> </li>
            <li className="room-li"><a className="roomate">số người:0</a> 
              <a className="room-name">xyzzz</a> </li>
            <li className="room-li"><a className="roomate">số người:0</a> 
              <a className="room-name">xyzzz</a> </li>
          </ul>
      </div>)}
      
      {chose ==="add-room" &&(
      <div className="add-room">
        <label >Nhập tên phòng
          <input type="text" className="room-name" placeholder="Nhập tên phòng"/>
        </label>
        <div className="room-setting">
          <p className="p-abc">Mật khẩu:<button > Có </button></p>
          <label>Nhập mật khẩu
            <input type="password" className="room-pass" placeholder="Nhập mật khẩu phòng"/>
          </label>
          <label className='selectLabel'>Chọn video hoặc nhập thông tin video
            <select>
              <option>--Chọn--</option>
            </select>
          </label>
          <label>Tên video
          <input type="text" placeholder="Nhập tên video"/>
          </label>
          <label>link video
            <input type="text" placeholder="nhập url video"/> 
          </label>
        </div>
        <button className="room-buttom">Tạo phòng</button>
      </div>)}
      
        {chose ==="join-room" &&(
      <div className="join-room">
        <label className='selectLabel'>Chọn phòng
          <select className="select-room">
            <option>--Chọn--</option>
          </select>
        </label>
        <p className="p-abc">Số người trong phòng: --</p>
        <label>Nhập mật khẩu
          <input type="password" className="room-pass" placeholder="nhập mật khẩu"/>
        </label>
        <button className="room-buttom">Vào phòng</button>
      </div>)}
    </div>
  </div>
  )
}
export default Room;