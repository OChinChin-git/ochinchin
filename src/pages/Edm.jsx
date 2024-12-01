import React, { useState, useEffect, useRef } from "react";
import "../styles/Edm.css";
import "../styles/Button.css";
import { useLoader } from "../components/LoaderContext";
import {useToast} from "../components/ToastContext";
const Edm = () => {
  // States để quản lý các thông tin
  const [currentSongIndex, setCurrentSongIndex] = useState(() =>{
    const savedIndex = localStorage.getItem("currentSongIndex");
    return savedIndex !== null ? parseInt(savedIndex,10) : 0;
  })
  const [songs, setSongs] = useState([]);
  const [isShuffled, setIsShuffled] = useState(() => {
    const savedShuffled = localStorage.getItem("isShuffled");
    return savedShuffled !== null ? JSON.parse(savedShuffled) : false;
  });
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [activeButton, setActiveButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0); // Thời gian cập nhật cuối cùng
  const [hideList, setHideList] = useState(false);
  const [volume, setVolume] = useState(() => {
    // Lấy giá trị volume từ localStorage, nếu không có thì đặt mặc định là 100
    const savedVolume = localStorage.getItem("volume");
    return savedVolume !== null ? parseInt(savedVolume, 10) : 100;
  });
  const [wave, setWave] = useState(false);
  const [idListInput, setIdListInput] = useState(() => {
    const savedIdList = localStorage.getItem("idListInput");
    return savedIdList !== null ? JSON.parse(savedIdList) : "";
  });
  // Sử dụng Ref để tham chiếu đến các phần tử DOM
  const audioRef = useRef(null);
  const songListRef = useRef(null);
  const currentTimeRef = useRef(null);
  const durationTimeRef = useRef(null);
  const seekBarRef = useRef(null);
  const volumeSliderRef = useRef(null);
  const { showLoader, hideLoader } = useLoader(); // Use loader context
  // Ref để tham chiếu đến từng phần tử trong danh sách
  const songRefs = useRef([]);
  const {showToast} = useToast();
  const [validIds,setValidIds] = useState([]);
  // Fetch dữ liệu từ Google Sheets
  useEffect(() => {
    showLoader("Đang tải...");
    async function fetchSongs() {
      const response = await fetch(
        "https://docs.google.com/spreadsheets/d/1JC22TNfLkxrzuAROvc8-gZe9gp70qOhEvtTkTIo4WUk/gviz/tq?tqx=out:json"
      );
      const data = await response.text();
      const json = JSON.parse(data.substr(47).slice(0, -2));
      const rows = json.table.rows;
      const headers = rows[0].c.map((cell) => cell?.v);
      const linkIndex = headers.indexOf("Link mp3");
const fetchedSongs = rows.slice(1).map((row) => {
  const songName = row.c[0]?.v;
  const songLink = row.c[linkIndex]?.v;

  if (idListInput === "") {
    return { songName, songLink };
  } else {
    // Nếu có idListInput, lọc theo ID
    const ids = headers.slice(1, linkIndex).map((header, index) => {
      return { id: header, marked: row.c[index + 1]?.v === 'x' };
    }).filter(entry => entry.marked);

    // Kiểm tra xem idListInput có khớp với bất kỳ ID nào trong ids không
    const matchingId = ids.find(entry => entry.id.toLowerCase() === idListInput);

    // Nếu tìm thấy ID khớp, trả về songName và songLink
    if (matchingId) {
      return { songName, songLink };
    } else {
      return null; // Nếu không có ID khớp, trả về null hoặc có thể bỏ qua
    }
  }
}).filter(song => song !== null);  // Loại bỏ các phần tử null nếu không có songLink khớp

      setSongs(fetchedSongs);
      const ids = headers.slice(1, linkIndex);
      setValidIds(ids);
    }
    hideLoader("Chúc bạn nghe nhạc vui vẻ!", 1000);
    fetchSongs();
  }, [idListInput]);
  useEffect(() => {
  if (validIds.length > 0) {
    console.log("Valid IDs đã được cập nhật:", validIds);
    // Xử lý với validIds sau khi đã cập nhật
  }
}, [validIds]);  // Theo dõi sự thay đổi của validIds

useEffect(() => {
  if (songs.length > 0) {
    
    // Phát bài hát hiện tại
    playSong(currentSongIndex).then(() => {
      audioRef.current.pause();  // Dừng bài hát ngay lập tức
    });
  }
}, [songs]);
useEffect(() => {
  if (songs.length > 0) {
    // Kiểm tra xem currentSongIndex có hợp lệ không
    if (currentSongIndex >= songs.length || currentSongIndex < 0) {
      setCurrentSongIndex(0);  
      playSong(currentSongIndex);
    }
  }
}, [currentSongIndex, songs]);
  
useEffect(() => {
  localStorage.setItem("currentSongIndex", currentSongIndex);
  localStorage.setItem("isShuffled", JSON.stringify(isShuffled));
    localStorage.setItem("volume", volume);
  localStorage.setItem("idListInput", JSON.stringify(idListInput));
}, [currentSongIndex, volume, isShuffled,idListInput]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  const playSong = async (songIndex) => {
    const song = songs[songIndex];

    // Hiển thị loader với tên bài hát
    showLoader("Đang tải: " + song.songName);

    // Cập nhật nguồn cho audio
    audioRef.current.src = song.songLink;

    // Đảm bảo rằng bài hát đã tải xong
    audioRef.current.load(); // Tải lại audio nguồn
    await new Promise((resolve, reject) => {
      audioRef.current.oncanplaythrough = () => resolve(); // Bài hát đã tải xong
      audioRef.current.onerror = () => reject("Lỗi tải bài hát");
    });

    // Cập nhật thời lượng bài hát vào ref
    const durationInSeconds = audioRef.current.duration; // Thời lượng bài hát (giây)
    if (!isNaN(durationInSeconds)) {
      const formattedDuration = formatTime(durationInSeconds);
      if (durationTimeRef.current) {
        durationTimeRef.current.textContent = formattedDuration;
      }
    }

    // Phát bài hát sau khi đã tải xong
    audioRef.current.play();
    updateActiveClass(songIndex);
    scrollToCurrentSong(songRefs.current[songIndex]);
    setCurrentSongIndex(songIndex);

    // Ẩn loader sau khi bài hát đã được tải và bắt đầu phát
    hideLoader("Đang tải: " + song.songName, 1000);
  };
  // Hàm để cập nhật lớp active cho bài hát
  const updateActiveClass = (activeItemIndex) => {
    const songItems = document.querySelectorAll(".song-item"); // Các phần tử li của danh sách bài hát
    songItems.forEach((item, index) => {
      // Loại bỏ lớp active khỏi tất cả các bài hát
      item.classList.remove("active");

      // Thêm lớp active vào bài hát đang phát
      if (index === activeItemIndex) {
        item.classList.add("active");
      }
    });
  };
  // Xử lý sự kiện play/pause
  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };
  // Định dạng thời gian
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Xử lý thay đổi tốc độ phát
  const handleSpeedChange = () => {
    const speedValue = parseFloat(document.getElementById("speedInput").value);
    if (speedValue >= 0.25 && speedValue <= 10) {
      setPlaybackRate(speedValue);
      audioRef.current.playbackRate = speedValue;
      if(speedValue > 3|| speedValue < 0.7){
        showToast("Speed: " + speedValue,"error");
      }else{
      showToast("Speed: " + speedValue);
      }
    }else{
      showToast("Vui lòng nhập speed từ 0.25 đến 10")
    }
  };

  // Cập nhật bài hát tiếp theo
  const nextSong = () => {
    let nextIndex = currentSongIndex + 1;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * songs.length);
    }
    if (nextIndex >= songs.length) {
      nextIndex = 0;
    }
    playSong(nextIndex);
  };
  // Dùng useEffect để tự động cập nhật trạng thái khi audio play/pause
  useEffect(() => {
    // Cập nhật trạng thái nút khi bài hát thay đổi trạng thái play/pause
    const updateButtonState = () => {
      setWave(!audioRef.current.paused);
      setActiveButton(!audioRef.current.paused);
    };

    // Lắng nghe sự kiện "play" và "pause" của audio
    const audioElement = audioRef.current;
    audioElement.addEventListener("play", updateButtonState);
    audioElement.addEventListener("pause", updateButtonState);

    // Cleanup event listeners khi component unmount
    return () => {
      audioElement.removeEventListener("play", updateButtonState);
      audioElement.removeEventListener("pause", updateButtonState);
    };
  }, []); // Chỉ chạy một lần khi component mount
  useEffect(() => {
    const checkIfSongIsLoading = () => {
      const current = audioRef.current.currentTime; // Lấy currentTime của audio
      const duration = audioRef.current.duration; // Thời lượng bài hát

      // Kiểm tra xem currentTime có thay đổi không trong 0.5 giây và bài hát không bị tạm dừng
      if (
        Math.abs(current - lastUpdateTime) < 0.1 &&
        audioRef.current.paused === false
      ) {
        setWave(false);
        setIsLoading(true); // Đánh dấu đang tải
        showLoader("Đang tải, chờ chút..."); // Hiển thị loader
      } else {
        setIsLoading(false); // Đã phát, không còn tải nữa
        hideLoader(); // Ẩn loader
        setWave(!audioRef.current.paused);
      }

      setLastUpdateTime(current); // Cập nhật lastUpdateTime để so sánh lần sau
    };

    // Chạy kiểm tra mỗi 0.5 giây
    const intervalId = setInterval(checkIfSongIsLoading, 500);

    // Cleanup khi component unmount
    return () => clearInterval(intervalId);
  }, [lastUpdateTime, audioRef.current, wave]);

  // Xử lý thay đổi thanh volume
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume); // Cập nhật giá trị volume
    audioRef.current.volume = newVolume / 100; // Áp dụng volume cho audio
  };

  // Cập nhật thanh tiến độ
  const updateProgress = () => {
    const currentTime = audioRef.current.currentTime;
    const durationTime = audioRef.current.duration;
    currentTimeRef.current.textContent = formatTime(currentTime);
    seekBarRef.current.value = currentTime;
    seekBarRef.current.max = durationTime;
  };
  // Đăng ký sự kiện keydown khi component mount
  useEffect(() => {
    const handleSpaceKey = (event) => {
      if (event.code === "Space") {
        event.preventDefault(); // Ngăn không cho trình duyệt xử lý mặc định
        togglePlayPause(); // Gọi hàm toggle play/pause
      }
    };

    // Đăng ký sự kiện keydown
    document.addEventListener("keydown", handleSpaceKey);

    // Cleanup sự kiện khi component unmount
    return () => {
      document.removeEventListener("keydown", handleSpaceKey);
    };
  }, []); // Dùng mảng phụ thuộc rỗng để chỉ chạy 1 lần khi component mount
  // Hàm cuộn đến bài hát hiện tại trong danh sách
  const scrollToCurrentSong = (item) => {
    if (item) {
      item.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  
  const idListRef = useRef();
  const handleIdListClick = () =>{
    const id = idListRef.current.value;
    if(id === ""){
      const isConfirm = confirm("Chưa nhập id, reset list")
      if(!isConfirm){
        showToast("Đã hủy");
        return
      }
      setIdListInput(id);
      showToast("Đang phát list mặc định","success")
      return
    }
if (!validIds.map(id => id.toLowerCase()).includes(id.toLowerCase())) {
  showToast("Id không tồn tại, id có sẵn: " + validIds.join(", "));
  idListRef.current.value = "";
  return;
}
    
    setIdListInput(id);
    idListRef.current.value = "";
    showToast("Đang phát: " + id);
  };
  
  return (
    <div className="edm-container">
    <div className="edmphiphai">
      <h1 className="animated2">Phi phai</h1>
      <div>
        <input type="text"
          placeholder="Nhập ID"  ref ={idListRef}/>
       
        <button onClick={handleIdListClick}>Tải list</button>
      </div>

      <div className="current-song-info">
        <div
          className="circle"
          style={{
            animation: wave ? "" : "none",
          }}
        >
          <p id="currentSongTitle" className="animated3">
            Bài hiện tại:{" "}
            <span>
              {songs[currentSongIndex]?.songName || "Không có bài hát nào"}
            </span>
          </p>
          <p id="currentSongIndex">
            Thứ tự: <span id="currentIndex">{currentSongIndex + 1}</span> /{" "}
            <span id="totalSongs">{songs.length}</span>
          </p>
          <p>
            Thời gian đã phát:
            <br />
            <span id="currentTime" ref={currentTimeRef}>
              0:00
            </span>{" "}
            /
            <span id="durationTime" ref={durationTimeRef}>
              0:00
            </span>
          </p>
          <input
            type="range"
            ref={seekBarRef}
            id="seekBar"
            step="1"
            min="0"
            onChange={(e) => {
              const newTime = e.target.value;
              if (audioRef.current) {
                audioRef.current.currentTime = newTime; // Cập nhật thời gian phát
              }
            }}
          />
        </div>
      </div>

      <div className="controls">
        <button id="playPauseBtn" onClick={togglePlayPause}>
          {activeButton ? "Tạm dừng" : "Phát"}
        </button>
        <button id="nextBtn" onClick={nextSong}>
          Bài tiếp theo
        </button>
        <div className="speed-control">
          <label className="speed-input-button">Tốc độ:
          <input
            type="number"
            id="speedInput"
            value={playbackRate}
            step="0.05"
            min="0.1"
            max="10"
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
          />
          <button id="setSpeedBtn" onClick={handleSpeedChange}>
            Đặt tốc độ
          </button></label>
        </div>
      </div>

      <div>
        <input
          type="range"
          ref={volumeSliderRef}
          id="volume-slider"
          min="0"
          max="100"
          value={volume} // Liên kết giá trị volume với state
          onChange={handleVolumeChange}
        />
        <span id="volume-percentage">{volume}%</span>{" "}
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
          {songs.map((song, index) => (
            <li
              key={index}
              ref={(el) => (songRefs.current[index] = el)}
              className={`song-item ${
                currentSongIndex === index ? "active" : ""
              }`} // Thêm lớp active nếu bài hát này đang phát
              onClick={() => playSong(index)} // Khi nhấn vào bài hát sẽ gọi playSong
            >
              {song.songName}
            </li>
          ))}
        </ul>
      </div>
      <audio
        ref={audioRef}
        onTimeUpdate={updateProgress}
        onEnded={nextSong}
      ></audio>
    </div>
      </div>
  );
};

export default Edm;
