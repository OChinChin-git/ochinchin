const audio = document.getElementById("audio");
const songListElement = document.getElementById("songList");
const currentTimeDisplay = document.getElementById("currentTime");
const durationTimeDisplay = document.getElementById("durationTime");
const seekBar = document.getElementById("seekBar");
const toggleListBtn = document.getElementById("toggleListBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const speedInput = document.getElementById("speedInput");
const setSpeedBtn = document.getElementById("setSpeedBtn");
const currentSongTitle = document.getElementById("currentSongTitle");
const currentIndexDisplay = document.getElementById("currentIndex");
const totalSongsDisplay = document.getElementById("totalSongs");
const loadButton = document.getElementById("load-button");
const idInput = document.getElementById("id-input");
const circle = document.querySelector(".circle");
const volumeSlider = document.getElementById("volume-slider");
const volumePercentage = document.getElementById("volume-percentage");
let currentSongIndex = 0;
let originalSongs = [];
let filteredSongs = [];
let isShuffled = false;
let playbackRate = 1.0;
let validIds = [];

// Lấy bài hát từ Google Sheets
async function fetchSongs() {
    const response = await fetch("https://docs.google.com/spreadsheets/d/1JC22TNfLkxrzuAROvc8-gZe9gp70qOhEvtTkTIo4WUk/gviz/tq?tqx=out:json");
    const data = await response.text();

    const json = JSON.parse(data.substr(47).slice(0, -2));
    const rows = json.table.rows;

    const headers = rows[0].c.map(cell => cell?.v);
    const linkIndex = headers.indexOf("Link mp3");

    rows.slice(1).forEach(row => {
        const songName = row.c[0]?.v;
        const songLink = row.c[linkIndex]?.v;

        const ids = headers.slice(1, linkIndex).map((header, index) => {
            return { id: header, marked: row.c[index + 1]?.v === 'x' };
        }).filter(entry => entry.marked);

        if (songName && songLink && ids.length > 0) {
            const li = document.createElement("li");
            li.textContent = songName;
            li.setAttribute("data-src", songLink);
            li.setAttribute("data-ids", JSON.stringify(ids.map(entry => entry.id)));

            songListElement.appendChild(li);
            originalSongs.push(li);
            validIds.push(...ids.map(entry => entry.id));
        }
    });

    totalSongsDisplay.textContent = originalSongs.length;

    filteredSongs = [...originalSongs];

    if (originalSongs.length > 0) {
        updateCurrentSong();
    }
}

// Khởi tạo trình phát khi trang được tải
document.addEventListener("DOMContentLoaded", async () => {
    await fetchSongs();
    updatePlayPauseButton(false);
    updateCurrentSong();

    if (filteredSongs.length > 0) {
        currentSongIndex = 0;
        const firstSong = filteredSongs[currentSongIndex];
        audio.src = firstSong.getAttribute("data-src");
        audio.load();

        document.title = firstSong.textContent;

        audio.addEventListener("loadedmetadata", () => {
            durationTimeDisplay.textContent = formatTime(Math.floor(audio.duration));
            currentTimeDisplay.textContent = "0:00";
            seekBar.value = 0;
            seekBar.max = Math.floor(audio.duration);
        }, { once: true });

        updateActiveClass(firstSong);
        updateTime();
    }
});

// Tải bài hát theo id
loadButton.addEventListener("click", () => {
    const inputId = idInput.value.trim().toLowerCase();

    if (inputId === "") {
        showToast("Vui lòng nhập ID.");
        return;
    }

    if (!validIds.map(id => id.toLowerCase()).includes(inputId)) {
        showToast("ID không có sẵn.");
        idInput.value = "";
        return;
    }

    filteredSongs = originalSongs.filter(song => {
        const ids = JSON.parse(song.getAttribute("data-ids")).map(id => id.toLowerCase());
        return ids.some(entry => entry === inputId);
    });

    songListElement.innerHTML = "";
    filteredSongs.forEach(song => songListElement.appendChild(song));

    const currentSongTitleText = currentSongTitle.querySelector("span").textContent;
    const currentSongIndexInNewList = filteredSongs.findIndex(song => song.textContent === currentSongTitleText);

    if (currentSongIndexInNewList !== -1) {
        currentSongIndex = currentSongIndexInNewList;
    } else {
        currentSongIndex = isShuffled ? Math.floor(Math.random() * filteredSongs.length) : 0;
    }

    updateCurrentSong();

    if (currentSongIndexInNewList !== -1) {
        showToast("Đã tải ID: " + inputId + ". Bài hát hiện tại được giữ lại.");
    } else {
        playSong(filteredSongs[currentSongIndex]);
        currentSongTitle.querySelector("span").textContent = filteredSongs[currentSongIndex].textContent;
        showToast("Đã tải ID: " + inputId);
    }

    totalSongsDisplay.textContent = filteredSongs.length;
});

// Cập nhật hiển thị bài hát hiện tại
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

// Chọn một bài hát từ danh sách
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
    const title = item.textContent;

    audio.src = src;
    audio.load();
    audio.playbackRate = playbackRate;
    audio.play();

    updateActiveClass(item);
    updateTime();
    updatePlayPauseButton(true);

    currentSongTitle.querySelector("span").textContent = title;
    currentIndexDisplay.textContent = currentSongIndex + 1;
    document.title = title;
    scrollToCurrentSong(item);
}

// Cuộn đến bài hát hiện tại trong danh sách
function scrollToCurrentSong(item) {
    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Cập nhật lớp hoạt động
function updateActiveClass(activeItem) {
    const songItems = songListElement.querySelectorAll("li");
    songItems.forEach(item => item.classList.remove("active"));
    activeItem.classList.add("active");
}

// Phát bài hát tiếp theo khi bài hát hiện tại kết thúc
audio.addEventListener("ended", () => {
    currentSongIndex = isShuffled ? Math.floor(Math.random() * filteredSongs.length) : (currentSongIndex + 1) % filteredSongs.length;
    playSong(filteredSongs[currentSongIndex]);
});

// Điều khiển phát/tạm dừng
playPauseBtn.addEventListener("click", () => {
    togglePlayPause();
});

// Cập nhật trạng thái nút phát/tạm dừng
function updatePlayPauseButton(isPlaying) {
    playPauseBtn.textContent = isPlaying ? "Dừng" : "Phát";
}

// Cập nhật thời gian và thanh tìm kiếm
function updateTime() {
    audio.addEventListener("loadedmetadata", () => {
        durationTimeDisplay.textContent = formatTime(Math.floor(audio.duration));
        seekBar.max = Math.floor(audio.duration);
    }, { once: true });

    audio.addEventListener("timeupdate", () => {
        if (!audio.paused && !audio.ended) {
            currentTimeDisplay.textContent = formatTime(Math.floor(audio.currentTime));
            seekBar.value = Math.floor(audio.currentTime);
        }
    });
}

// Tìm kiếm âm thanh khi kéo thanh tìm kiếm
seekBar.addEventListener("input", () => {
    audio.currentTime = seekBar.value;
    currentTimeDisplay.textContent = formatTime(Math.floor(seekBar.value));
});

// Định dạng thời gian theo mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Hiển thị thông báo toast
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 500);
}

// Thay đổi tốc độ phát
setSpeedBtn.addEventListener("click", () => {
    const speedValue = parseFloat(speedInput.value);
    if (speedValue >= 0.1 && speedValue <= 10) {
        playbackRate = speedValue;
        audio.playbackRate = playbackRate;
        showToast(`Tốc độ hiện tại: ${playbackRate.toFixed(2)}x`);
    } else {
        showToast("Vui lòng nhập tốc độ từ 0.1 đến 10.");
    }
});

// Chuyển đổi tính năng hiển thị danh sách bài hát
toggleListBtn.addEventListener("click", () => {
    if (songListElement.style.display === "none") {
        songListElement.style.display = "block";
        toggleListBtn.textContent = "-";
    } else {
        songListElement.style.display = "none";
        toggleListBtn.textContent = "+";
    }
});

// Tính năng trộn
shuffleBtn.addEventListener("click", () => {
    isShuffled = !isShuffled;
    shuffleBtn.textContent = isShuffled ? "Hủy Random" : "Random";
});

// Điều khiển bài hát tiếp theo
document.getElementById("nextBtn").addEventListener("click", () => {
    currentSongIndex = isShuffled ? Math.floor(Math.random() * filteredSongs.length) : (currentSongIndex + 1) % filteredSongs.length;
    playSong(filteredSongs[currentSongIndex]);
});

// Điều khiển bằng phím cho phát/tạm dừng bằng phím Space
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        togglePlayPause();
    }
});

// Chức năng chuyển đổi giữa phát/tạm dừng
function togglePlayPause() {
    if (audio.paused) {
        audio.play();
        updatePlayPauseButton(true);
        circle.style.animation = "wave 1s infinite"; // Hiệu ứng sóng
    } else {
        audio.pause();
        updatePlayPauseButton(false);
        circle.style.animation = "none"; // Dừng hiệu ứng sóng
    }
}

// Cập nhật âm lượng khi thanh trượt thay đổi
volumeSlider.addEventListener("input", () => {
    const volumeValue = volumeSlider.value / 100;
    audio.volume = volumeValue;

    // Cập nhật hiển thị phần trăm
    volumePercentage.textContent = `${volumeSlider.value}%`;
});

// Đảm bảo âm lượng ban đầu được đặt chính xác khi trang tải
audio.volume = volumeSlider.value / 100;
