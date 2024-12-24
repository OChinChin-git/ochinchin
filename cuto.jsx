import React,{useState,useEffect,useRef} from 'react';

export default function game() {
  const [gameScene,setGameScene] = useState('scene1');
  const [videoIframe,setVideoIframe] = useState(null);
  const [isPlayVideo,setIsPlayVideo] = useState(false);
  const sceneImgs = {
    scene1:{
      src:'https://i.ytimg.com/vi/KqVynH6DLug/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBeBs_fAtcI9jPYqbrA8YSXp8ERWg',
      
    },
    scene2:{
      src:'https://i.ytimg.com/vi/Lpo3dvfNfQ8/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAeEX9zvqWH-UR70dKrg_hv-gprMA',
      
      
    },
    scene3:{
      src:'https://i.ytimg.com/vi/k6HnOigop4w/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDieu20sl9uq4P05-vFE_3mo1MLOQ',
    },
    scene4:{
      src:'',
      
    },
    scene5:{
      src:'',
      
    },
    
  }
  const sceneRefs={
    scene1:useRef(),
    scene2:useRef(),
    scene3:useRef(),
    scene4:useRef(),
    scene5:useRef(),
    
  }
  const sounds ={
    sound1:{
      src:'https://cdn.pixabay.com/audio/2024/12/23/audio_c3fe7a607a.mp3',
    },
    sound2:{
      src:'',
    },
    sound3:{
      src:'',
    },
    sound4:{
      src:'',
    },
    
  }
  const videos ={
    video1:{
      src:'https://videos.pexels.com/video-files/1508533/1508533-hd_1920_1080_25fps.mp4',
    },
    video2:{
      src:'https://scontent.xx.fbcdn.net/v/t42.3356-2/471290036_8948389628607904_6094464678391062854_n.mp4?_nc_cat=109&ccb=1-7&_nc_sid=4f86bc&_nc_ohc=cF3AUDtycvwQ7kNvgHDavnX&_nc_zt=28&_nc_ht=scontent.xx&_nc_gid=A9oxmxX2soiQKisSidFFzlh&oh=03_Q7cD1gHrL0VCnueAAIo5orkhkFSTuzUHq-5Zo1mZEpnepCCULA&oe=676CCD0C&dl=1',
    },
    video3:{
      src:'',
    },
    video4:{
      src:'',
    },
    video5:{
      src:'',
    },
    
  }
  const [soundAudio,setSoundAudio] = useState()
  const playSound = (soundKey)=>{
    const sound = sounds[soundKey];
    if(!sound || !sound.src) return;
    setSoundAudio(sound.src)
  }
  const playVideo = (videoKey)=>{
    const video = videos[videoKey];
    if(!video || !video.src) return;
    setVideoIframe(video.src);
    setIsPlayVideo(true);
    
  }
  const audioRef = useRef()
  const pauseVideoOnTime=(time)=>{
    setTimeout(()=>{
      setVideoIframe(null);
      setIsPlayVideo(false);
    },time*1000)
  }
  const pauseAudioOnTime = (time)=>{
    if(!audioRef.current) return;
    setTimeout(()=>{
      audioRef.current.pause()
      setSoundAudio(null);
    },time*1000)
  }
  useEffect(()=>{
    if(!gameScene || !sceneRefs[gameScene].current) return;
    Object.values(sceneRefs).forEach((ref)=>{
      if(!ref.current) return;
      ref.current.style.display = 'none'
    })
    sceneRefs[gameScene].current.style.display = '';
  },[gameScene])
  return(
    <div className='page' style={{border:'2px solid #000000',height:'100vh',width:'calc(100vw - 60px)'}} >
      <div style={{height:'100%',width:'100%'}}>
        <img src={sceneImgs[gameScene].src}
             style={{display:isPlayVideo ?'none':'' ,height:'100%',width:'100%',backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat',zIndex:'-1'}}
        ></img>
        <video src={videoIframe}
          style={{display:!isPlayVideo ?'none':'' ,height:'100%',width:'100%',zIndex:'2',
                  objectFit:'cover'
                 }}
          crossOrigin='true'
          playsInline
          autoPlay
          onPlay={()=>{
            pauseVideoOnTime(3);
          }}
          onEnded={()=>{
            setVideoIframe(null);
            setIsPlayVideo(false);
          }}
          >
        </video>
        <audio src={soundAudio} preload='auto' autoPlay
          onEnded={()=>{
            setSoundAudio(null);
          }}
          onPlay={()=>{
            pauseAudioOnTime(3);
          }}
          ref={audioRef}
          ></audio>
        <div style={{zIndex:'1'}}>
          <div ref={sceneRefs.scene1}>
            <button style={{display:isPlayVideo ?'none':'' ,position:'absolute',bottom:'50px',right:'100px'}}
              onClick={()=>{
                setGameScene('scene2')
                playVideo('video1');
              }}>Sang cảnh 2</button>
            <button style={{display:isPlayVideo ?'none':'' ,position:'absolute',bottom:'50px',left:'100px'}}
              onClick={()=>{
                playSound('sound1')
              }}>
            Mèo kêu</button>
          </div>

          <div ref={sceneRefs.scene2}>
            <button style={{display:isPlayVideo ?'none':'' ,position:'absolute',bottom:'50px',right:'100px'}}
              onClick={()=>{
                setGameScene('scene3')
              }}>Sang cảnh 3</button>
          </div>


          <div ref={sceneRefs.scene3}>

          </div>
        </div>
      </div>
    </div>
  )
}
