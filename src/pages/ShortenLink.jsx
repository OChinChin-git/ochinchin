import React,{useRef,useEffect,useState} from 'react';
import '../styles/ShortenLink.css';
import {shortenLinkConst,getLink} from '../components/firebaseAuth.js'
import {useLocation} from 'react-router-dom';
import { useLoader } from "../components/LoaderContext";
import { useToast } from "../components/ToastContext";
import { useDialog } from "../components/DialogContext";
const ShortenLink= ()=>{
  const inputLinkRef = useRef('');
  const inputNameRef = useRef('');
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search);
  const name = queryParam.get('n');
  const [isName,setIsName]= useState(false);
  const [link,setLink] = useState();
  const [isSubmit,setIsSubmit] =useState(false);
  const [submitName,setSubmitName] =useState();
  const { showLoader, hideLoader } = useLoader(); // Use loader context
  const { showToast } = useToast();
  const { showPrompt } = useDialog();
  const handleShortenLink = async(event)=>{
    event.preventDefault();
    try{
      const checkNameValid= /^[a-zA-Z0-9_-]+$/;
      if(!checkNameValid.test(inputNameRef.current.value)){
        alert('tên không hợp lệ, chỉ cho phép chữ, số,-,_');
        return
      }
      const saveRes = await shortenLinkConst(inputNameRef.current.value,inputLinkRef.current.value);
      if(saveRes == 'exist'){
        alert('tên đã tồn tại')
        return
      }
      if(saveRes == 'kimochi'){
        setIsSubmit(true);
        setSubmitName(inputNameRef.current.value);
        inputNameRef.current.value ="";
        inputLinkRef.current.value ='';
        showToast('rút gọn link thành công')
      }
    }catch(error){
      alert('shortenlink',error)
    }
  }
  
  const checkIsName= ()=>{
    if(name == null){
      setIsName(false);
      return
    }
    setIsName(true);
  }
  useEffect(()=>{
    checkIsName();
  },[])
  useEffect(()=>{
    console.log(isName);
  },[isName])
  const getLinkValue = async()=>{
    try{
      if(name==null){
        return
      }
      const data = await getLink(name);
      setLink(data.link);
    }catch(error){
      return('getlinnk',error)
    }
  }
  useEffect(()=>{
    getLinkValue();
  },[name])
  useEffect(()=>{
    if(link == null){
      return
    }
    window.location.href= link;
  },[link])
  return(
    <div className="shorten-link-page" >
<form onSubmit={handleShortenLink}
  style={!isName&&!isSubmit ? {display:''}:{display:'none'}}
  >
  <a className="shorten-link-text">Rút gọn link</a>

  <label>
    Nhập link cần rút gọn
    <input
      type="url"
      className="input-link"
      ref={inputLinkRef}
      placeholder="Nhập url cần rút gọn"
      required
    />
  </label>

  <label>
    Nhập tên rút gọn
    <input
      type="text"
      className="input-name"
      ref={inputNameRef}
      placeholder="Ví dụ: abc"
      required
    />
  </label>

  <button className="shorten-link-button" type="submit">
    Rút gọn link
  </button>
</form>
      <div style={isSubmit ? {display:''}:{display:'none'}} className='finish-shorten'>
        <a className='shorten-link-text'>Thành công, bạn có thể truy cập link tại: 
          <br/>https://chillsite-test.glitch.me/link?name={submitName}</a>
        <button className='link=button' onClick={()=>{
            navigator.clipboard.writeText('https://chillsite-test.glitch.me/link?n=' + submitName)
            showToast('copy thành công!')
          }}
          style={{fontSize:'14px'}}
          >copy link</button>
      </div>
    </div>
  );
}
export default ShortenLink;