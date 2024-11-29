// Tạo lớp devtoolsChecker để phát hiện DevTools và thay đổi trạng thái
class devtoolsChecker extends Error {
    toString() {
        // Trả về thông báo lỗi mặc định khi gọi toString()
        return "DevTools đã được phát hiện!";
    }

    get message() {
        // Phát hiện DevTools và gọi hàm onDevtoolsOpen()
        onDevtoolsOpen();
        return "DevTools đã được mở!";
    }
}

// Biến toàn cục để theo dõi trạng thái DevTools
let devToolsOpened = false;

window.addEventListener('load', function () {
    // Kiểm tra nếu DevTools đã được phát hiện trong phiên trước
    const devToolsDetected = localStorage.getItem('devToolsDetected');
    const devToolsDetectedTime = localStorage.getItem('devToolsDetectedTime'); // Lấy thời gian phát hiện

    // Nếu đã phát hiện trong phiên trước và chưa hết thời gian
    if (devToolsDetected === 'true' && devToolsDetectedTime && (Date.now() - devToolsDetectedTime) < 10*365*24*60*60*1000) {
        let remainingSeconds = Math.max(0, 10*365*24*60*60 - Math.floor((Date.now() - devToolsDetectedTime) / 1000));

// Tính toán các đơn vị thời gian
let years = Math.floor(remainingSeconds / (365*24*60*60)); // Tính năm
remainingSeconds -= years * (365*24*60*60);

let days = Math.floor(remainingSeconds / (24*60*60)); // Tính ngày
remainingSeconds -= days * (24*60*60);

let hours = Math.floor(remainingSeconds / (60*60)); // Tính giờ
remainingSeconds -= hours * (60*60);

let minutes = Math.floor(remainingSeconds / 60); // Tính phút
remainingSeconds -= minutes * 60;

let seconds = remainingSeconds; // Giây còn lại

// Hiển thị thông báo chặn với thời gian còn lại
const message = `Bị ban 10 năm r nhé 😞! Xem hentai và truy cập lại sau :`;
const message1 = `${years} year ${days} day / ${hours}h${minutes}m${seconds} s.`;


        // Hiển thị thông báo
       // Hiển thị thông báo với các giá trị
alert(message + `\n` + message1);

        // Chuyển hướng ngay lập tức sau khi thông báo alert() đã hiển thị
        setTimeout(() => {
            document.body.innerHTML = ''; // Ẩn toàn bộ nội dung trang

            const originalUrl = window.location.href; // Lưu URL gốc trước khi chuyển hướng
            window.location.href = 'https://ihentai.li'; // Chuyển hướng đến trang khác

            // Kiểm tra nếu trang không chuyển hướng thành công
            setTimeout(() => {
                if (window.location.href === originalUrl) {
                    // Nếu URL không thay đổi (có thể do chuyển hướng bị chặn), thử lại
                    window.location.href = 'https://ihentai.ac'; // Thử chuyển hướng lại
                }
            }, 1000); // Kiểm tra sau 1 giây
        }, 100); // Chờ 100ms sau alert() để tránh việc chuyển hướng bị chặn

        return; // Dừng các bước tiếp theo để tránh tiếp tục tải trang
    }
    // Kiểm tra DevTools ngay khi đối tượng devtoolsChecker được tạo ra
    console.log(new devtoolsChecker());
});

// Hàm khởi tạo đếm số lần mở DevTools (kiểm tra và khởi tạo lại nếu hết hạn)
function initializeDevToolsCount() {
  const storedData = localStorage.getItem("devToolsData");

  if (storedData) {
    const parsedData = JSON.parse(storedData);
    const now = Date.now();

    // Kiểm tra thời gian hết hạn
    if (parsedData.expiry && parsedData.expiry > now) {
      // Nếu chưa hết hạn, trả về giá trị hiện tại
      return parsedData.count || 0;
    } else {
      // Nếu đã hết hạn, xóa dữ liệu cũ
      localStorage.removeItem("devToolsData");
    }
  }

  // Mặc định trả về 0 nếu không có dữ liệu hoặc đã hết hạn
  return 0;
}

// Hàm lưu số lần mở vào LocalStorage (với thời hạn hết hạn 10 phút)
function saveDevToolsCount(count) {
  const now = Date.now();
  const expiry = now + 1 * 60 * 1000; // 10 phút (tính bằng milliseconds)

  const data = {
    count: count,     // Số lần mở DevTools
    expiry: expiry,   // Thời gian hết hạn
  };

  localStorage.setItem("devToolsData", JSON.stringify(data));
}

// Biến đếm số lần mở
let devToolsOpenCount = initializeDevToolsCount();

// Hàm được gọi khi DevTools mở
function onDevtoolsOpen() {
  devToolsOpenCount++; // Tăng biến đếm
  saveDevToolsCount(devToolsOpenCount); // Lưu lại số lần vào LocalStorage

  if (devToolsOpenCount === 1) {
    alert("Đừng mở DevTools! Bị ban đó!");
    document.body.innerHTML = '';
    window.location.href = 'https://ihentai.li'; // Chuyển hướng
  } else if (devToolsOpenCount === 2) {
    alert("Yamate! Đừng mà");
    document.body.innerHTML = '';
    window.location.href = 'https://ihentai.li'; // Chuyển hướng
  } else if (devToolsOpenCount === 3) {
    alert("Yamate! Lần cuối đó!");
    document.body.innerHTML = '';
    window.location.href = 'https://ihentai.li'; // Chuyển hướng
  }else if (devToolsOpenCount >= 4) {
    alert("Bị ban rồi, liên hệ OChinChin đầu thú để được nhận khoan hồng!");
    document.body.innerHTML = '';
    localStorage.setItem("devToolsDetected", "true");
    localStorage.setItem("devToolsDetectedTime", Date.now());
    window.location.href = 'https://ihentai.li'; // Chuyển hướng
  }
}
document.addEventListener('keydown', function (e) {
  // Các tổ hợp phím cần ngăn
  const forbiddenKeys = [
    { ctrl: true, shift: true, key: 'I' }, // Ctrl+Shift+I
    { ctrl: true, key: 'U' }, // Ctrl+U
    { ctrl: true, shift: true, key: 'J' }, // Ctrl+Shift+J
    { key: 'F12' } // F12
  ];

  forbiddenKeys.forEach((combo) => {
    if (
      (combo.ctrl && !e.ctrlKey) === false &&
      (combo.shift && !e.shiftKey) === false &&
      e.key.toLowerCase() === combo.key.toLowerCase()
    ) {
      e.preventDefault();
    }
  });
});

// Chặn Zoom qua chuột (Ctrl + cuộn chuột)
document.addEventListener('wheel', function(e) {
  if (e.ctrlKey) {
    e.preventDefault(); // Ngừng zoom khi người dùng nhấn Ctrl + cuộn chuột
  }
}, { passive: false });

// Chặn phím tắt Ctrl + "+" và Ctrl + "-" từ cả thanh số và numpad
document.addEventListener('keydown', function(e) {
  const isCtrlPlus =
    e.ctrlKey &&
    (e.key === '=' || e.key === '+' || e.key === 'Add' || e.keyCode === 107); // Dấu + từ thanh số và numpad
  const isCtrlMinus =
    e.ctrlKey &&
    (e.key === '-' || e.key === 'Subtract' || e.keyCode === 109); // Dấu - từ thanh số và numpad

  if (isCtrlPlus || isCtrlMinus) {
    e.preventDefault(); // Ngừng zoom khi nhấn Ctrl + "+" hoặc Ctrl + "-"
  }
}, { passive: false });
localStorage.removeItem('devToolsDetected');