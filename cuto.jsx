import React, { useState, useEffect, useRef } from "react";

export default function game() {
  const [gameScene, setGameScene] = useState("scene1");
  const [videoIframe, setVideoIframe] = useState(null);
  const [isPlayVideo, setIsPlayVideo] = useState(false);
  const scenesInfo = {
    sceneEnd:{
      img:['https://cdn.glitch.global/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/5100deec-5b1e-4bc3-bdc0-531cff3e67bd.image.png?v=1735227880727',
           'https://game8.vn/media/202405/images/k1.jpg',
           'https://anhgaimup.com/wp-content/uploads/2024/02/anh-cosplay-sexy-tren-website-anh-gai-mup-182-750x1333.webp',
           'https://anhgaimup.com/wp-content/uploads/2024/02/anh-cosplay-sexy-tren-website-anh-gai-mup-238-750x1381.webp',
           'https://anhgaimup.com/wp-content/uploads/2024/02/anh-cosplay-sexy-tren-website-anh-gai-mup-131-750x1133.webp',
           'https://anhgaimup.com/wp-content/uploads/2024/02/anh-cosplay-sexy-tren-website-anh-gai-mup-147-750x1045.webp',
           'https://anhgaimup.com/wp-content/uploads/2024/02/anh-cosplay-sexy-tren-website-anh-gai-mup-207-750x1364.webp',
           'https://anhgaimup.com/wp-content/uploads/2024/02/anh-cosplay-sexy-tren-website-anh-gai-mup-049-750x1000.webp',
           'https://sexymiu.com/wp-content/uploads/2021/07/Cosplay-h%E1%BA%A7u-g%C3%A1i-b%C3%A8o-nh%C3%BAn-si%C3%AAu-xinh-26.jpg',
           'https://toquoc.mediacdn.vn/280518851207290880/2021/7/24/to2-16271144831061845151596-1627116904273-1627116904515486879758.jpg',
           'https://gamek.mediacdn.vn/133514250583805952/2024/7/3/photo-1719992720380-17199927206592081096552.png',
           ],
      ref:useRef()
    },
    scene1: {
      img: "https://cdn.glitch.global/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/vlcsnap-2024-12-26-20h04m55s180.png?v=1735218311167",
      ref:useRef()
    },
    scene2: {
      img: "https://cdn.glitch.global/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/vlcsnap-2024-12-26-20h20m48s697.png?v=1735219261545",
      ref:useRef()
    },
    scene3: {
      img: "https://cdn.glitch.global/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/vlcsnap-2024-12-26-23h07m33s137.png?v=1735229274386",
      ref:useRef()
    },
    scene4: {
      img: "https://cdn.glitch.global/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/vlcsnap-2024-12-26-23h19m28s602.png?v=1735229977483",
      ref:useRef()
    },
    scene5: {
      img: "https://cdn.glitch.global/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/vlcsnap-2024-12-26-23h31m53s889.png?v=1735230731959",
      ref:useRef()
    },
    scene6:{
      img:'https://cdn.glitch.global/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/vlcsnap-2024-12-26-23h49m05s059.png?v=1735231774155',
      ref:useRef()
    },
    scene7:{
      img:'https://cdn.glitch.global/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/vlcsnap-2024-12-26-23h55m37s574.png?v=1735232160902',
      ref:useRef()
    },
  };
  const sounds = {
    soundDie: {
      src: "https://cdn.glitch.global/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/fx-halloween-horror-surprise-effect-247545.mp3?v=1735232656741",
    },
    sound2: {
      src: "",
    },
    sound3: {
      src: "",
    },
    sound4: {
      src: "",
    },
  };
  const videos = {
    video1: {
      src: "https://cdn.glitch.global/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/Video%20ch%C6%B0a%20%C4%91%E1%BA%B7t%20t%C3%AAn%20%E2%80%90%20%C4%90%C6%B0%E1%BB%A3c%20t%E1%BA%A1o%20b%E1%BA%B1ng%20Clipchamp.mp4?v=1735219102586",
    },
    video2: {
      src: "https://cdn.glitch.me/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/Video%20ch%C6%B0a%20%C4%91%E1%BA%B7t%20t%C3%AAn%20%E2%80%90%20%C4%90%C6%B0%E1%BB%A3c%20t%E1%BA%A1o%20b%E1%BA%B1ng%20Clipchamp%20(1).mp4?v=1735219351926",
    },
    video3: {
      src: "https://cdn.glitch.me/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/Video%20ch%C6%B0a%20%C4%91%E1%BA%B7t%20t%C3%AAn%20%E2%80%90%20%C4%90%C6%B0%E1%BB%A3c%20t%E1%BA%A1o%20b%E1%BA%B1ng%20Clipchamp%20(1).mp4?v=1735219351926",
    },
    video4: {
      src: "https://cdn.glitch.global/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/6169091448175.mp4?v=1735229906369",
    },
    video5: {
      src: "https://cdn.glitch.global/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/471290036_8948389628607904_6094464678391062854_n.mp4?v=1735137722011",
    },
    video6:{
      src:'https://cdn.glitch.global/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/6169092350337.mp4?v=1735230430197',
    },
    video7:{
      src:'https://cdn.glitch.global/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/6169093347456.mp4?v=1735231716187',
    },
    video8:{
      src:'https://cdn.glitch.global/01588a49-89cd-4ce8-a7dc-9cf5db61ffd3/6169092649763.mp4?v=1735232122016',
    },
  };
  const [soundAudio, setSoundAudio] = useState();
  const playSound = (soundKey,time) => {
    setTimeout(()=>{
      const sound = sounds[soundKey];
      if (!sound || !sound.src) return;
      setSoundAudio(sound.src);
    },time*1000)
  };
  const playVideo = (videoKey) => {
    const video = videos[videoKey];
    if (!video || !video.src) return;
    setVideoIframe(video.src);
  };
  const audioRef = useRef();
  const pauseVideoOnTime = (time) => {
    setTimeout(() => {
      setVideoIframe(null);
      setIsPlayVideo(false);
    }, time * 1000);
  };
  const pauseAudioOnTime = (time) => {
    if (!audioRef.current) return;
    setTimeout(() => {
      audioRef.current.pause();
      setSoundAudio(null);
    }, time * 1000);
  };
  const toNextScene = (scene) => {
    setTimeout(() => {
      setGameScene(scene);
    }, 500);
  };

  const messBoxRef = useRef();
  const [messBox,setMessBox] = useState();
  
  const waitForClick = () => {
    return new Promise((resolve) => {
      const handleClick = () => {
        // Xóa sự kiện click sau khi xử lý một lần
        messBoxRef.current.removeEventListener("click", handleClick);
        resolve(); // Kết thúc Promise khi click xảy ra
      };
      // Thêm sự kiện click vào ref
      messBoxRef.current.addEventListener("click", handleClick);
    });
  };

  const showMessBox = async(mess)=>{
    messBoxRef.current.style.display = '';
    const messParts = mess.split('/')
    let i;
    for(i=0;i<messParts.length;i++){
      setMessBox(messParts[i])
      await waitForClick();
    }
    messBoxRef.current.style.display = 'none';
    scenesInfo[gameScene].ref.current.style.display = '';
  }

  useEffect(()=>{
    if(!gameScene || !scenesInfo[gameScene].ref.current) return;
    Object.values(scenesInfo).forEach((ref)=>{
      if(!ref.ref.current) return;
      ref.ref.current.style.display = 'none'
    })
    const changeScene = async()=>{
      if(gameScene == 'scene1'){
        await showMessBox('Tối nay hơi lạnh, tôi muốn đi bộ 1 chút cho ấm hơn.../Bây giờ đã hơn 1h sáng, tôi có nên ra ngoài không ?');
      }
      if(gameScene == 'scene3'){
        await showMessBox('Có tiếng gì đó.../Nghe như kiểu tiếng game phi phai.../Ai lại chơi phi phai lúc 1h sáng thế này nhỉ ?/Tôi có nên quay lại xem không ?')
      }
      if(gameScene == 'scene5'){
        await showMessBox('Đã chạy được khoảng 30 phút.../Có vẻ thứ đó vẫn chạy theo.../Tôi cảm thấy rất mệt và không thể chạy được nữa.../Tôi nên đi bộ hay là chạy tiếp ?')
      }
      if(gameScene == 'scene4'){
        await showMessBox('Ước gì được lựa chọn lại, tôi sẽ chọn ở nhà và chơi phi phai.../Bạn đã die !')
        playVideo('video5');
        setNextScene('sceneEnd')
      }
      if(gameScene == 'scene6'){
        await showMessBox('Ước gì được lựa chọn lại, tôi sẽ chọn ở nhà và chơi phi phai.../Bạn đã die vì chạy quá chậm !')
        playVideo('video5');
        setNextScene('sceneEnd')
      }
      if(gameScene == 'scene7'){
        await showMessBox('Ước gì được lựa chọn lại, tôi sẽ chọn ở nhà và chơi phi phai.../Bạn đã die vì đi bộ !')
        playVideo('video5');
        setNextScene('sceneEnd')
      }
      if(gameScene == 'sceneEnd'){
        await showMessBox('Trò chơi đã kết thúc')
      }
      else{
        scenesInfo[gameScene].ref.current.style.display = '';
        messBoxRef.current.style.display = 'none';
      }
    }
  changeScene();
  },[gameScene])
  const [nextScene,setNextScene] = useState();
  const getImgSrc = ()=>{
            if(gameScene == 'sceneEnd'){
              return scenesInfo[gameScene].img[Math.floor(Math.random()*scenesInfo[gameScene].img.length)]
            }else{
              return scenesInfo[gameScene].img
            }
          }
  return (
    <div
      className="page"
      style={{
        border: "2px solid #000000",
        height: "calc(100vh - 40px)",
        width: "calc(100vw - 60px)",
      }}
    >
      <div style={{ height: "100%", width: "100%" }}>
        <img
          src={getImgSrc()}
          style={{
            display: isPlayVideo ? "none" : "",
            height: "100%",
            width: "100%",
            objectFit: "contain",

            backgroundRepeat: "no-repeat",
            zIndex: "-1",
          }}
        ></img>
        <video
          src={videoIframe}
          style={{
            display: !isPlayVideo ? "none" : "",
            height: "100%",
            width: "100%",
            zIndex: "2",
            objectFit: "contain",
          }}
          crossOrigin="true"
          playsInline
          autoPlay
          onPlay={() => {
            setIsPlayVideo(true);
          }}
          onEnded={() => {
            setVideoIframe(null);
            setIsPlayVideo(false);
            setGameScene(nextScene);
          }}
        ></video>
        <audio
          src={soundAudio}
          preload="auto"
          autoPlay
          onEnded={() => {
            setSoundAudio(null);
          }}
          onPlay={() => {
            pauseAudioOnTime(3);
          }}
          ref={audioRef}
        ></audio>
        <div style={{ zIndex: "1"}}>
          <p ref={messBoxRef} className='mess-box'>{messBox}</p>
          
          <div ref={scenesInfo.sceneEnd.ref}>
            <button
              style={{
                display: isPlayVideo ? "none" : "",
                position: "absolute",
                top: "90%",
                left: "50%",
                transform:'translate(-50%,0)'
              }}
              onClick={async () => {
                toNextScene("scene1");
              }}
            >
              Click để bắt đầu lại
            </button>
          </div>
          <div ref={scenesInfo.scene1.ref}  >
            <button
              style={{
                display: isPlayVideo ? "none" : "",
                position: "absolute",
                top: "90%",
                left: "30px",
                
              }}
              onClick={async () => {
                playVideo("video1");
                setNextScene("scene2");
              }}
            >
              Đi luôn
            </button>
            <button
              style={{
                display: isPlayVideo ? "none" : "",
                position: "absolute",
                top: "90%",
                right: "30px",
              }}
              onClick={async () => {
                playVideo("video5");
                setNextScene("sceneEnd");
              }}
            >
              Đéo, chơi phi phai
            </button>
          </div>

          <div ref={scenesInfo.scene2.ref}  >
            <button
              style={{
                display: isPlayVideo ? "none" : "",
                position: "absolute",
                top: "90%",
                right: "45%",
              }}
              onClick={() => {
                playVideo("video3");
                setNextScene("scene3");
              }}
            >
              Bật đèn pin
            </button>
          </div>

          <div ref={scenesInfo.scene3.ref}  >
            <button
              style={{
                display: isPlayVideo ? "none" : "",
                position: "absolute",
                top: "90%",
                left: "30px",
              }}
              onClick={() => {
                playVideo('video4')
                setNextScene("scene4");
                playSound('soundDie',5)
              }}
            >
              Quay lại xem sao
            </button>
            <button
              style={{
                display: isPlayVideo ? "none" : "",
                position: "absolute",
                top: "90%",
                right: "30px",
              }}
              onClick={() => {
                playVideo('video6')
                setNextScene("scene5");
              }}
            >
              Đéo ổn, chạy luôn đéo xem
            </button>
          </div>
          <div ref={scenesInfo.scene4.ref}  >
          </div>
          <div ref={scenesInfo.scene5.ref}  >
            <button
              style={{
                display: isPlayVideo ? "none" : "",
                position: "absolute",
                top: "90%",
                left: "30px",
              }}
              onClick={() => {
                playVideo('video8')
                setNextScene("scene7");
                playSound('soundDie',2)
              }}
            >
              Đi bộ, đéo sợ
            </button>
            <button
              style={{
                display: isPlayVideo ? "none" : "",
                position: "absolute",
                top: "90%",
                right: "30px",
              }}
              onClick={() => {
                playVideo('video7')
                setNextScene("scene6");
                playSound('soundDie',6.5)
              }}
            >
              Cố hết sức chạy tiếp
            </button>
          </div>
          <div ref={scenesInfo.scene6.ref}>
          </div>
          <div ref={scenesInfo.scene7.ref}>
          </div>
        </div>
      </div>
    </div>
  );
}
