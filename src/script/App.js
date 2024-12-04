      function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

      function updateKeyframeColors() {
        const color1 = getRandomColor();
        const color2 = getRandomColor();
        const color3 = getRandomColor();
        const color4 = getRandomColor();

        // Cập nhật biến CSS
        document.documentElement.style.setProperty('--color-1', color1);
        document.documentElement.style.setProperty('--color-2', color2);
        document.documentElement.style.setProperty('--color-3', color3);
        document.documentElement.style.setProperty('--color-4', color4);
      }

      // Gọi hàm để cập nhật màu mỗi 5 giây
      updateKeyframeColors(); // Lần đầu tiên để thiết lập màu ngay
      setInterval(updateKeyframeColors, 5000); // Thay đổi màu mỗi 5 giây


let isClicking = false; // Kiểm tra trạng thái nhấn chuột
let clickTimeout; // Lưu trữ ID của timeout

// Lắng nghe sự kiện click
document.body.addEventListener("click", function(e) {
    if (isClicking) return; // Nếu đang nhấn chuột thì không làm gì thêm
  
    // Tạo chấm tại vị trí click
    createRipple(e.pageX, e.pageY);

    // Dừng tạo chấm sau 0.6 giây
    clickTimeout = setTimeout(function() {
        isClicking = false; // Ngừng tạo chấm sau 0.6s
    }, 500);
});

// Hàm tạo chấm tại vị trí (x, y)
function createRipple(x, y) {
    var liti = document.createElement("div");
    liti.classList.add("liti-effect");

    liti.style.left = x - 5 + "px";  // Trừ đi 5px để căn chỉnh chấm giữa vị trí click
    liti.style.top = y - 5 + "px";   // Tương tự cho trục y

    document.body.appendChild(liti);

    setTimeout(function() {
        liti.remove();
    }, 600); // 600ms để đồng bộ với thời gian animation
}

let lastRippleTime = 0; // Thời gian tạo chấm cuối cùng

// Hiệu ứng di chuột sau khi nhấn
function mouseMoveEffect(e) {
    if (isClicking) {
        const currentTime = Date.now();
        
        // Kiểm tra nếu thời gian hiện tại cách thời gian tạo chấm trước đó > 50ms
        if (currentTime - lastRippleTime > 50) {
            createRipple(e.pageX, e.pageY); // Tạo chấm theo đường di chuyển của chuột
            lastRippleTime = currentTime; // Cập nhật thời gian tạo chấm mới
        }
    }
}

// Lắng nghe sự kiện mousemove và tạo chấm khi đang click
document.body.addEventListener("mousemove", mouseMoveEffect);

// Lắng nghe sự kiện mouseup để kết thúc quá trình nhấn
document.body.addEventListener("mouseup", function() {
    clearTimeout(clickTimeout); // Hủy timeout nếu người dùng thả chuột sớm
    isClicking = false; // Ngừng tạo chấm khi người dùng thả chuột
});
// Lắng nghe sự kiện mouse down để bắt đầu nhấn chuột
document.body.addEventListener("mousedown", function() {
    isClicking = true;  // Đánh dấu là đang nhấn chuột
});

// Lắng nghe sự kiện mouse up để kết thúc nhấn chuột
document.body.addEventListener("mouseup", function() {
    isClicking = false;  // Đánh dấu là không còn nhấn chuột
});
// Lắng nghe sự kiện mousemove để tạo chấm khi chuột di chuyển
document.body.addEventListener("mousemove", mouseMoveEffect);