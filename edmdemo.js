const songListElement = document.getElementById("songList");
const currentTimeDisplay = document.getElementById("currentTime");
const durationTimeDisplay = document.getElementById("durationTime");
const seekBar = document.getElementById("seekBar");
const playPauseBtn = document.getElementById("playPauseBtn");
const speedInput = document.getElementById("speedInput");
const setSpeedBtn = document.getElementById("setSpeedBtn");
const currentSongTitle = document.getElementById("currentSongTitle");
const currentIndexDisplay = document.getElementById("currentIndex");
const totalSongsDisplay = document.getElementById("totalSongs");
const loadButton = document.getElementById("load-button");
const idInput = document.getElementById("id-input");
const volumeSlider = document.getElementById("volume-slider");
const volumePercentage = document.getElementById("volume-percentage");
const youtubePlayerContainer = document.getElementById("youtube-player-container"); // Div chứa player YouTube

let currentSongIndex = 0;
let originalSongs = [];
let filteredSongs = [];
let isShuffled = false;
let playbackRate = 1.0;
let currentYouTubePlayer = null; // Đối tượng player YouTube

// Hàm chuyển đổi URL YouTube thành embed URL
function convertToEmbedUrl(url) {
    const youtubeRegEx = /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:live\/|watch\?v=|embed\/|v\/|shorts\/|.*[?&]v=)|youtu\.be\/))([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegEx);
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
}

// Hàm khởi tạo YouTube player
function onYouTubeIframeAPIReady() {
    const firstSong = filteredSongs[currentSongIndex];
    const songLink = firstSong.getAttribute("data-src");
    const embedUrl = convertToEmbedUrl(songLink);

    currentYouTubePlayer = new YT.Player('youtube-player-container', {
        height: '0',  // Ẩn video
        width: '0',
        videoId: embedUrl.split("/embed/")[1], // Lấy video ID từ embed URL
        playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
        },
        events: {
            onStateChange: onPlayerStateChange,
        }
    });
}

// Xử lý sự kiện thay đổi trạng thái của YouTube player
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        playNextSong();
    }
}

// Phát bài tiếp theo
function playNextSong() {
    currentSongIndex = isShuffled ? Math.floor(Math.random() * filteredSongs.length) : (currentSongIndex + 1) % filteredSongs.length;
    playSong(filteredSongs[currentSongIndex]);
}

// Cập nhật thông tin bài hát hiện tại
function updateCurrentSong() {
    if (filteredSongs.length > 0) {
        currentSongTitle.querySelector("span").textContent = filteredSongs[currentSongIndex].textContent;
        currentIndexDisplay.textContent = currentSongIndex + 1;
        totalSongsDisplay.textContent = filteredSongs.length;
    } else {
        currentSongTitle.querySelector("span").textContent = "Không có bài hát nào phù hợp.";
        currentIndexDisplay.textContent = "0";
        totalSongsDisplay.textContent = "0";
    }
}

// Lắng nghe sự kiện click vào danh sách bài hát
songListElement.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
        currentSongIndex = filteredSongs.indexOf(event.target);
        playSong(filteredSongs[currentSongIndex]);
        updateActiveClass(event.target);
    }
});

// Phát bài hát
function playSong(item) {
    const src = item.getAttribute("data-src");
    const embedUrl = convertToEmbedUrl(src);

    if (embedUrl.includes("youtube.com/embed")) {
        if (currentYouTubePlayer) {
            currentYouTubePlayer.loadVideoById(embedUrl.split("/embed/")[1]);
        } else {
            onYouTubeIframeAPIReady();  // Khởi tạo player nếu chưa được khởi tạo
        }
    }

    updateActiveClass(item);
    updateTime();
    updatePlayPauseButton(true);

    currentSongTitle.querySelector("span").textContent = item.textContent;
    currentIndexDisplay.textContent = currentSongIndex + 1;
    document.title = item.textContent;
    scrollToCurrentSong(item);
}

// Cập nhật class active cho bài hát đang phát
function updateActiveClass(activeItem) {
    const songItems = songListElement.querySelectorAll("li");
    songItems.forEach(item => item.classList.remove("active"));
    activeItem.classList.add("active");
}

// Cuộn đến bài hát hiện tại
function scrollToCurrentSong(item) {
    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Cập nhật nút phát/pause
function updatePlayPauseButton(isPlaying) {
    playPauseBtn.textContent = isPlaying ? "Dừng" : "Phát";
}

// Cập nhật thời gian và thanh seek
function updateTime() {
    if (currentYouTubePlayer) {
        setInterval(() => {
            const currentTime = currentYouTubePlayer.getCurrentTime();
            currentTimeDisplay.textContent = formatTime(Math.floor(currentTime));
            seekBar.value = Math.floor(currentTime);
        }, 1000);
    }
}

// Định dạng thời gian (mm:ss)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Sự kiện seek video
seekBar.addEventListener("input", () => {
    if (currentYouTubePlayer) {
        currentYouTubePlayer.seekTo(seekBar.value);
    }
});

// Điều chỉnh âm lượng
volumeSlider.addEventListener("input", () => {
    const volumeValue = volumeSlider.value / 100;
    if (currentYouTubePlayer) {
        currentYouTubePlayer.setVolume(volumeSlider.value);
    }
    volumePercentage.textContent = `${volumeSlider.value}%`;
});

// Phát bài đầu tiên khi API sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    fetchSongs();
});

// Lấy danh sách bài hát từ Google Sheets
async function fetchSongs() {
    const response = await fetch("https://docs.google.com/spreadsheets/d/12QKYOMYG8K1zGiEjkDgXRxPPjDddPlPD4UoGbl4oF30/gviz/tq?tqx=out:json");
    const data = await response.text();
    const json = JSON.parse(data.substr(47).slice(0, -2));
    const rows = json.table.rows;

    const headers = rows[0].c.map(cell => cell?.v);
    const linkIndex = headers.indexOf("Link mp3");

    rows.slice(1).forEach(row => {
        const songName = row.c[0]?.v;
        const songLink = row.c[linkIndex]?.v;

        const songItem = document.createElement("li");
        songItem.textContent = songName;
        songItem.setAttribute("data-src", songLink);

        songListElement.appendChild(songItem);
        originalSongs.push(songItem);
    });

    filteredSongs = [...originalSongs];
    updateCurrentSong();
    playSong(0);  // Phát bài hát đầu tiên
}
