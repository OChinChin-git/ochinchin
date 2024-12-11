import React, { useEffect, useRef, useState } from "react";

const YouTubePlayer = ({ videoId }) => {
  const iframeRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [playbackState, setPlaybackState] = useState("");
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    // Tải YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Khởi tạo player khi API sẵn sàng
    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube Iframe API is ready.");
      const videoId = 'WvesPq96rTY'
      const playerInstance = new window.YT.Player(iframeRef.current, {
        videoId: videoId,
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
      setPlayer(playerInstance);
    };
  }, [videoId]);

  // Xử lý sự kiện trạng thái của player
  const onPlayerStateChange = (event) => {
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
      default:
        setPlaybackState("Idle");
    }
  };
useEffect(() => {
  if (player) {
    const onSeekChange = (event) => {
      if (event.data === window.YT.PlayerState.PLAYING) {
        const time = player.getCurrentTime();
        setCurrentTime(time);
      }
    };

    // Gán sự kiện lắng nghe trên player
    player.addEventListener('onStateChange', onSeekChange);

    // Dọn dẹp khi component unmount
    return () => {
      player.removeEventListener('onStateChange', onSeekChange);
    };
  }
}, [player]);


  return (
    <div>
      <div ref={iframeRef}  style={{ width: "100%", height: "360px" }}></div>
      <p>State: {playbackState}</p>
      <p>Current Time: {currentTime.toFixed()} seconds</p>
    </div>
  );
};

export default YouTubePlayer;
