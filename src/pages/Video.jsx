import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getVideo } from "../components/Video";
import { useLoader } from "../components/LoaderContext";
import { useToast } from "../components/ToastContext";
import { useDialog } from "../components/DialogContext";
import {
  sendChats,
  getTime,
  getActiveVisitorsCount,
  resetActiveVisitors,
  trackUpdateRoom,
  formatTime,
  getUsersData,
  getChats,
  getNewChats,
  getAllChats,
  getRoomVisitors,
  addVisitor,
  removeVisitor,
  syncYoutubeIframe,
} from "/src/components/Video";
import "../styles/Video.css";
import { updateRoom } from "../components/Room";

const Video = () => {
  const { showLoader, hideLoader } = useLoader(); // Use loader context
  const { showToast } = useToast();
  const { showPrompt } = useDialog();

  const location = useLocation();
  const query = location.search;
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const videoId = query.substring(1); // Lấy giá trị sau `?v`
  const iframeRef = useRef("");
  const [isIframeYoutube, setIsIframeYoutube] = useState(false);
  const [playbackState, setPlaybackState] = useState();
  const [youtubePlayer, setYoutubePlayer] = useState();
  const [currentTime, setCurrentTime] = useState(0);
  const [youtubeVideoId, setYoutubeVideoId] = useState("");
  const [roomName, setRoomName] = useState();
  const [isHost, setIsHost] = useState(false);
  const [firestorePlayback, setFirestorePlayback] = useState();
  const [iframeIsReady, setIframeIsReady] = useState(false);
  const [firestoreCurrentTime, setFirestoreCurrentTime] = useState(0);
  const convertToEmbedUrl = (url) => {
    // Sửa biểu thức chính quy để bao gồm các URL YouTube live
    const youtubeRegEx =
      /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?][^#]*)?/;

    const match = url.match(youtubeRegEx);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`; // Trả về URL nhúng
    }

    return url; // Nếu không phải URL YouTube hợp lệ, trả về URL gốc
  };

  const convertPornhubToEmbedUrl = (url) => {
    const pornhubRegEx =
      /^https:\/\/(?:[a-zA-Z0-9-]+\.)?pornhub\.com\/view_video\.php\?viewkey=([a-zA-Z0-9_-]+)/;
    const pornhubMatch = url.match(pornhubRegEx);

    if (pornhubMatch && pornhubMatch[1]) {
      const videoKey = pornhubMatch[1];
      return `https://www.pornhub.com/embed/${videoKey}`;
    }
    return url;
  };

  const convertUrl = (url) => {
    try {
      let convertedUrl = convertToEmbedUrl(url); // Convert to YouTube embed URL
      convertedUrl = convertPornhubToEmbedUrl(convertedUrl); // Convert to Pornhub embed URL if applicable
      return convertedUrl;
    } catch (error) {
      alert("convert" + error);
    }
  };
  const isValidUrl = (url) => {
    const urlRegEx =
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
    if (url && !url.startsWith("http") && !url.startsWith("https")) {
      return false; // Kiểm tra nếu URL không bắt đầu với 'http' hoặc 'https'
    }
    return urlRegEx.test(url);
  };

  const convertIframe = (url) => {
    try {
      isValidUrl(url);
      if (!isValidUrl(url)) {
        return url;
      }
      const isConfirm = confirm(
        "Phát hiện url, thử chuyển đổi thành thẻ nhúng cho chat ?"
      );
      if (!isConfirm) {
        return url;
      }
      let convertedUrl = convertToEmbedUrl(url);
      convertedUrl = convertPornhubToEmbedUrl(convertedUrl);
      const iframeUrl = `
    <div style="width: calc(810px * 0.2875); height: calc(450px * 0.2875); overflow: hidden; position: relative; border-radius: 8px;">
      <iframe 
        src="${convertedUrl}" 
        style="width: 810px; height: 450px; border: 0; transform: scale(0.2875); transform-origin: top left;" 
        allowfullscreen>
      </iframe>
    </div>
    `;
      return iframeUrl;
    } catch (error) {
      alert("chatiframe" + error);
    }
  };

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
      default:
        setPlaybackState("Idle");
    }
  };

  // Chỉ tải API một lần
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube Iframe API is ready.");
      setIframeIsReady(true);
    };
  }, []);

  // Đồng bộ trạng thái phát lại
  useEffect(() => {
    if (!isIframeYoutube || !youtubePlayer || firestorePlayback === undefined)
      return;
    if (!isHost && playbackState !== firestorePlayback) {
      if (
        firestorePlayback === "Playing" &&
        typeof youtubePlayer.playVideo === "function"
      ) {
        youtubePlayer.playVideo();
      } else if (
        firestorePlayback === "Paused" &&
        typeof youtubePlayer.pauseVideo === "function"
      ) {
        youtubePlayer.pauseVideo();
      }
    }
  }, [
    isIframeYoutube,
    playbackState,
    youtubePlayer,
    isHost,
    firestorePlayback,
  ]);

  // Tạo Player khi `youtubeVideoId` thay đổi
  useEffect(() => {
    if (youtubePlayer) {
      console.log("dâccu");
      setIsIframeYoutube(false);
      videoInfo();
      return;
    }
    if (
      isIframeYoutube &&
      window.YT &&
      window.YT.Player &&
      youtubeVideoId &&
      !youtubePlayer &&
      iframeIsReady
    ) {
      const playerInstance = new window.YT.Player(iframeRef.current, {
        videoId: youtubeVideoId,
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
      setYoutubePlayer(playerInstance);
    }
  }, [isIframeYoutube, youtubeVideoId]);

  // Đồng bộ thời gian phát lại
  useEffect(() => {
    if (isIframeYoutube && !isHost && iframeIsReady && youtubePlayer) {
      const syncYoutubeVideoFromFirebase = async () => {
        if (
          firestoreCurrentTime !== undefined &&
          typeof youtubePlayer.seekTo === "function"
        ) {
          youtubePlayer.seekTo(firestoreCurrentTime);
        }
      };
      syncYoutubeVideoFromFirebase();
    }
  }, [isIframeYoutube, youtubePlayer, firestoreCurrentTime]);

  // Thêm và gỡ sự kiện lắng nghe
  useEffect(() => {
    if (
      !isIframeYoutube ||
      !isHost ||
      !youtubePlayer ||
      !iframeIsReady ||
      typeof youtubePlayer.addEventListener !== "function"
    ) {
      return;
    }

    const onSeekChange = (event) => {
      if (event.data === window.YT.PlayerState.PLAYING) {
        const time = youtubePlayer.getCurrentTime();
        setCurrentTime(time.toFixed());
      }
    };

    youtubePlayer.addEventListener("onStateChange", onSeekChange);

    return () => {
      youtubePlayer.removeEventListener("onStateChange", onSeekChange);
    };
  }, [isIframeYoutube, youtubePlayer]);

  // Hủy Player khi `isIframeYoutube` thay đổi
  useEffect(() => {
    if (!isIframeYoutube && youtubePlayer) {
      try {
        youtubePlayer.destroy(); // Hủy Player
        setYoutubePlayer(null); // Đặt lại trạng thái Player
      } catch (error) {
        console.error("Lỗi khi hủy YouTube Player:", error);
      }
    }
  }, [isIframeYoutube]);

  const videoInfo = async () => {
    try {
      showLoader("Đang tải video");
      const data = await getVideo(videoId);
      const url = data.url;
      const title = data.title;
      const embedUrl = await convertUrl(url);
      if (embedUrl.startsWith("https://www.youtube.com/embed/")) {
        setIsIframeYoutube(true);
        const youtubeId = embedUrl.split("/embed/")[1];
        setYoutubeVideoId(youtubeId);
        setVideoTitle(title);
        setFirestorePlayback(data.playbackState);
        setFirestoreCurrentTime(data.currentTime);
        return;
      }
      setIsIframeYoutube(false);
      setVideoUrl(embedUrl);
      setVideoTitle(title);
    } catch (error) {
      alert("videoinfo" + error);
    } finally {
      hideLoader();
    }
  };
  useEffect(() => {
    console.log(youtubeVideoId);
  }, [youtubeVideoId]);
  useEffect(() => {
    console.log(currentTime);
  }, [currentTime]);
  useEffect(() => {
    console.log(playbackState);
  }, [playbackState]);
  useEffect(() => {
    console.log(isIframeYoutube);
  }, [isIframeYoutube]);
  useEffect(() => {
    if (
      !isIframeYoutube ||
      playbackState == "Idle" ||
      !isHost ||
      !iframeIsReady
    ) {
      return;
    }
    const syncYoutubeVideo = async () => {
      await syncYoutubeIframe(roomName, playbackState, currentTime);
      console.log("async");
    };
    syncYoutubeVideo();
  }, [playbackState, currentTime]);
  //
  //
  //
  //
  const [isCloseChat, setIsCloseChat] = useState(false);
  const messageRef = useRef();
  const [messages, setMessages] = useState([]);
  const [isCloseLatestChat, setIsCloseLatestChat] = useState(true);
  const [latestMessage, setLatestMessage] = useState(null);
  const chatContainerRef = useRef(null); // Tham chiếu đến container chứa tin nhắn
  const audioRef = useRef(null); // Tham chiếu đến âm thanh
  const [userData, setUserData] = useState([]);

  const handleCloseChat = () => {
    setIsCloseChat(!isCloseChat);
  };
  const [lastSendChatTime, setLastSendTime] = useState(0);
  const handleSendMessage = async () => {
    if (lastSendChatTime == null) {
      lastSendChatTime = 0;
    }
    try {
      if (messageRef.current.value.trim() == "") {
        messageRef.current.focus();
        return;
      }
      const now = Date.now();
      if (now - lastSendChatTime < 300) {
        showToast("Chat chậm thôi", "error");
        return;
      }
      setLastSendTime(now);
      const message = await convertIframe(messageRef.current.value);

      const userId = localStorage.getItem("loggedInUserId") || "anonymous";
      const time = await getTime();
      await sendChats(videoId, time, userId, message);
      messageRef.current.value = "";
    } catch (error) {
      alert("send" + error);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleCloseLatestChat = () => {
    setIsCloseLatestChat(true);
  };
  useEffect(() => {
    if (messages.length > 0) {
      setLatestMessage(messages[messages.length - 1]);
      setIsCloseLatestChat(false);
      updateChats();
    } else {
      setLatestMessage(null);
      setIsCloseLatestChat(true);
    }
  }, [messages]);
  useEffect(() => {
    if (isCloseLatestChat == true) {
      setLatestMessage(null);
    }
  }, [isCloseLatestChat]);
  const chatStyle = !isCloseChat
    ? isCloseLatestChat
      ? { display: "none" }
      : { display: "" }
    : { display: "none" };
  // Hàm cập nhật tin nhắn
  const updateChats = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth", // Thêm tùy chọn cuộn mượt
      });
    }
    // Phát âm thanh khi có tin nhắn mới
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Điều chỉnh âm lượng (0.5 là 50% âm lượng)
      audioRef.current.play(); // Phát âm thanh
    }
  };
  useEffect(() => {
    if (isCloseChat) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth", // Thêm tùy chọn cuộn mượt
      });
    }
  }, [isCloseChat]);
  const userMap = useMemo(() => {
    return new Map(userData.map((user) => [user.id, user]));
  }, [userData]);

  useEffect(() => {
    const unsubscribe = getUsersData(setUserData);
    return () => {
      unsubscribe();
    };
  }, []);

  const loadChat = (data) => {
    if (!userMap.size) {
      console.warn("userMap chưa sẵn sàng");
      return;
    }

    const chatData = data.map((chat) => {
      const user = userMap.get(chat.userId);
      const time = formatTime(chat.time);
      return {
        time: time,
        displayName: user ? user.displayName : "anonymous",
        avatar: user
          ? user.avatar
          : "https://www.dropbox.com/scl/fi/o0nyh6atfock3fxrjcu8j/andanh.png?rlkey=bgbperz5j18dden4j4vll416q&dl=1",
        message: chat.message,
      };
    });
    setMessages(chatData);
  };
  const [messagesData, setMessagesData] = useState([]);
  useEffect(() => {
    const functionGetChats = async () => {
      const data = await getChats(videoId);
      setMessagesData(data);
    };
    functionGetChats();
  }, []);
  useEffect(() => {
    if (userMap.size) {
      loadChat(messagesData);
    }
  }, [userMap, messagesData]);
  useEffect(() => {
    let latestMessagesData;
    if (messagesData.length === 0) {
      latestMessagesData = 0;
    } else {
      latestMessagesData = messagesData[messagesData.length - 1]; // Lấy tin nhắn mới nhất
    }
    const unsubscribe = getNewChats(
      videoId,
      latestMessagesData,
      setMessagesData
    );
    // Cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, [messagesData]); // Thêm dependency để re-run khi messagesData thay đổi

  //
  //
  //
  //
  const [activeVisitors, setActiveVisitors] = useState(0);
  const [isClosePage, setIsClosePage] = useState(false);
  const [isReset, setIsReset] = useState(false);
  useEffect(() => {
    if (!isClosePage) {
      const addVst = async () => {
        if (!isReset) {
          await resetActiveVisitors(videoId);
        }
        await addVisitor(videoId);
      };
      addVst();
      return;
    }
    if (isClosePage) {
      const removeVst = async () => {
        await removeVisitor(videoId);
      };
      removeVst();
      return;
    }
  }, [isClosePage]);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsClosePage(true);
      } else {
        setIsReset(true);
        setIsClosePage(false);
      }
    };
    const handleBeforeUnload = () => {
      setIsClosePage(true);
    };
    // Thêm event listener cho sự kiện visibilitychange
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleBeforeUnload);
    // Cleanup: xóa event listener khi component bị unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // Lắng nghe số lượng người truy cập từ Firestore và cập nhật thông qua callback
    const unsubscribe = getActiveVisitorsCount(setActiveVisitors, videoId); // setActiveVisitors là callback

    // Cleanup khi component unmount
    return () => {
      unsubscribe(); // Dừng lắng nghe số lượng người truy cập
    };
  }, []);
  useEffect(() => {
    if (!isClosePage) {
      const addVst = async () => {
        await addVisitor(videoId);
      };
      addVst();
      return;
    }
  }, [activeVisitors]);

  const [isPass, setIsPass] = useState(false);
  const [roomPass, setRoomPass] = useState();
  const roomPassRef = useRef();
  const [isJoinRoom, setIsJoinRoom] = useState();
  const [hostId, setHostId] = useState();
  const [selectHost, setSelectHost] = useState();
  const videoTitleRef = useRef(null);
  const videoUrlRef = useRef(null);
  const [isRoomPass, setIsRoomPass] = useState();
  const roomPassInputRef = useRef(null);
  const handleSetRoom = async () => {
    try {
      if (!videoId.startsWith("r")) {
        setIsJoinRoom(true);
        return;
      }
      const data = await getVideo(videoId);
      if (data.roomPass !== false) {
        setIsPass(true);
        setIsJoinRoom(false);
        setIsRoomPass(true);
        setRoomPass(data.roomPass);
        roomPassInputRef.current.value = data.roomPass;
      } else {
        setIsPass(false);
        setIsJoinRoom(true);
        setIsRoomPass(false);
      }
      setHostId(data.host);
      setSelectHost(data.host);
      setRoomName(data.roomName);
      videoTitleRef.current.value = data.title;
      videoUrlRef.current.value = data.url;
    } catch (error) {
      alert("setRoom" + error);
    }
  };

  const handleJoinRoom = () => {
    const pass = roomPassRef.current.value;
    if (pass == "") {
      showToast("Chưa nhập mật khẩu");
      return;
    }
    if (pass !== roomPass) {
      showToast("Sai mật khẩu");
    } else {
      setIsJoinRoom(true);
      setIsPass(false);
    }
  };
  const checkIsHost = () => {
    let hostLocalId = localStorage.getItem("visitorId");
    if (!hostLocalId) {
      hostLocalId = Date.now();
      localStorage.setItem("visitorId", hostLocalId); // Lưu vào localStorage
    }

    if (hostId == hostLocalId) {
      setIsHost(true);
      setIsPass(false);
      setIsJoinRoom(true);
    } else {
      setIsHost(false);
    }
  };
  useEffect(() => {
    checkIsHost();
  }, [hostId]);
  const [isCloseHost, setIsCloseHost] = useState(false);
  const [isChangeSetting, setIsChangeSetting] = useState(false);
  const handleCloseHost = () => {
    setIsCloseHost(!isCloseHost);
  };
  const handleSetIsPass = () => {
    setIsRoomPass(!isRoomPass);
  };
  const handleChangeRoomSetting = async () => {
    if (isRoomPass) {
      const isConfirm = confirm(
        "Đặt mật khẩu thì tất cả thành viên sẽ phải vào lại, xác nhận chứ ?"
      );
      if (!isConfirm) {
        return;
      }
    }
    if (selectHost !== hostId) {
      const isConfirm = confirm("Thay đổi host chứ ? Bạn sẽ mất quyền host");
      if (!isConfirm) {
        return;
      }
    }
    try {
      showLoader("Đang cập nhật phòng");
      const title = videoTitleRef.current.value;
      const url = videoUrlRef.current.value;
      let pass;
      if (isRoomPass) {
        pass = roomPassInputRef.current.value;
      } else {
        pass = false;
      }
      const responseUpdate = await updateRoom(
        roomName,
        selectHost,
        pass,
        title,
        url
      );
      if (responseUpdate == "lỗi") {
        showToast("Lỗi", "error");
      } else if (responseUpdate == "kimochi") {
        showToast("Cập nhật thành công!", "success");
      } else {
        showToast("Đặc cầu");
      }
      setIsChangeSetting(true);
    } catch (error) {
      alert("Lỗi changeRoomSetting: ", error);
    } finally {
      hideLoader();
    }
  };
  const [listUser, setListUser] = useState([]);

  useEffect(() => {
    handleSetRoom();
    checkIsHost();
    videoInfo();
  }, []);

  useEffect(() => {
    if (!roomName) {
      return;
    }
    const unsubscribe = trackUpdateRoom(
      roomName,
      handleSetRoom,
      checkIsHost,
      videoInfo
    );
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      } else {
      }
    };
  }, [roomName]);
  const [roomVisitorsList, setRoomVisitorsList] = useState([]);
  const roomVisitors = async () => {
    const data = await getRoomVisitors(videoId);
    setRoomVisitorsList(data);
  };
  const updateRoomVisitorsList = () => {
    const data = roomVisitorsList.map((visitor) => {
      const user = userMap.get(visitor.userId);
      return {
        id: visitor.id,
        displayName: user ? user.displayName : "anonymous",
      };
    });
    setListUser(data);
  };
  useEffect(() => {
    updateRoomVisitorsList();
  }, [roomVisitorsList]);
  useEffect(() => {}, [listUser]);
  useEffect(() => {
    roomVisitors();
  }, [activeVisitors]);

  return (
    <div className="video-block">
      <div style={isJoinRoom ? { display: "" } : { display: "none" }}>
        <div className="video-container">
          <iframe
            frameBorder="0"
            allowFullScreen
            allowtransparency="true"
            src={videoUrl}
            className="video"
            style={!isIframeYoutube ? { display: "" } : { display: "none" }}
          ></iframe>
          <div
            ref={iframeRef}
            className="video"
            style={isIframeYoutube ? { display: "" } : { display: "none" }}
          ></div>
          <div className="title animated2">{videoTitle + " " + "\u00A0"}</div>
        </div>

        <div
          className="chat"
          style={isCloseChat ? { display: "" } : { display: "none" }}
        >
          <audio
            ref={audioRef}
            src="https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3"
            preload="auto"
          />
          <div>
            <h6>Số người đang xem: {activeVisitors}</h6>
          </div>
          <button className="x-button" onClick={handleCloseChat}>
            x
          </button>
          <div className="chat-container" ref={chatContainerRef}>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div className="chat-content" key={index}>
                  <img className="avatar" src={msg.avatar} alt="User Avatar" />
                  <div className="message">
                    <p className="user-name">{msg.displayName}</p>
                    <p
                      className="message-text"
                      dangerouslySetInnerHTML={{ __html: msg.message }}
                    />
                    <p className="message-time">{msg.time} </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="chat-content">
                <img
                  className="avatar"
                  src={
                    "https://www.dropbox.com/scl/fi/k8qnmihjagt0iqvsis354/icon1.jpg?rlkey=0wfxydgqudsdmxpy8bntyj7dq&dl=1"
                  }
                  alt="User Avatar"
                />
                <div className="message">
                  <p className="user-name">OChinChin</p>
                  <p className="message-text">
                    Chưa có ai chat, hãy là người đầu tiên 😎
                  </p>
                  <p className="message-time">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="input-container">
            <input
              type="text"
              className="input-chat"
              placeholder="Nhập tin nhắn..."
              ref={messageRef}
              onKeyDown={handleKeyDown}
              onFocus={(e) => e.target.select()}
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

        <div className="latest-chat" style={chatStyle}>
          <div className="latest-chat-header">
            <p className="latest-chat-text">Chat mới nhất</p>
            <h6>Số người đang xem: {activeVisitors}</h6>
            <button className="x-button" onClick={handleCloseLatestChat}>
              x
            </button>
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
                  <p
                    className="message-text"
                    dangerouslySetInnerHTML={{ __html: latestMessage.message }}
                  />
                  <p className="message-time">{latestMessage.time}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          className="chat-toggle"
          onClick={handleCloseChat}
          style={isCloseChat ? { display: "none" } : { display: "" }}
        >
          Chat
        </button>
      </div>
      <div
        className="password-container"
        style={isPass ? { display: "" } : { display: "none" }}
      >
        <label>
          Nhập mật khẩu để vào phòng
          <input
            className="password-input"
            type="password"
            ref={roomPassRef}
            onFocus={(e) => e.target.select()}
          />
        </label>
        <button onClick={handleJoinRoom} className="join-button">
          Vào
        </button>
      </div>
      <div
        className="host-container"
        style={{
          display: isJoinRoom && isHost && isCloseHost ? "" : "none",
        }}
      >
        <button className="x-button" onClick={handleCloseHost}>
          x
        </button>
        <div className="room-profile">
          <div className="room-setting">
            <label>
              Room :<p className="room-name">{roomName}</p>
              <h6>Số người: {activeVisitors}</h6>
            </label>
            <label className="select-label">
              Host hiện tại
              <select
                value={selectHost}
                onChange={(e) => setSelectHost(e.target.value)}
              >
                {listUser
                  ? listUser
                      .filter((user) => user.id == hostId)
                      .map((user) => (
                        <option className="" value={hostId} key={hostId}>
                          Bạn: {user.displayName}
                        </option>
                      ))
                  : ""}
                {listUser.length > 0
                  ? listUser
                      .filter((user) => user.id !== hostId)
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.displayName + " Id:" + user.id}
                        </option>
                      ))
                  : ""}
              </select>
            </label>
            <p className="p-abc">
              Mật khẩu:
              <button onClick={handleSetIsPass}>
                {isRoomPass ? "có" : "Không"}
              </button>
            </p>
            <label style={isRoomPass ? { display: "" } : { display: "none" }}>
              Mật khẩu:
              <input
                type="password"
                className="room-pass"
                placeholder="Mật khẩu phòng"
                ref={roomPassInputRef}
                onFocus={(e) => e.target.select()}
              />
            </label>
            <label>
              Tên video
              <input
                type="text"
                placeholder="Nhập tên video"
                ref={videoTitleRef}
                onFocus={(e) => e.target.select()}
              />
            </label>
            <label>
              link video
              <input
                type="text"
                placeholder="nhập url video"
                ref={videoUrlRef}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleChangeRoomSetting();
                  }
                }}
              />
            </label>
            <button
              className="room-buttom"
              type="button"
              onClick={handleChangeRoomSetting}
            >
              Thay đổi
            </button>
          </div>
          <div className="room-users">
            <ul></ul>
          </div>
        </div>
      </div>
      <button
        className="host-button"
        style={{ display: isJoinRoom && isHost && !isCloseHost ? "" : "none" }}
        onClick={handleCloseHost}
      >
        Host
      </button>
    </div>
  );
};
export default Video;
