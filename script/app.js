
const leftArrows = document.querySelectorAll(".arrow-left"); // Mũi tên trái
const rightArrows = document.querySelectorAll(".arrow"); // Mũi tên phải
const movieLists = document.querySelectorAll(".movie-list");

document.addEventListener('contextmenu', function (e) {
  e.preventDefault(); // Vô hiệu hóa chuột phải
});

document.addEventListener('keydown', function (e) {
  // Ngăn tổ hợp phím "Ctrl+U", "Ctrl+Shift+I", "F12"
  if (
    (e.ctrlKey && e.key === 'u') || // Ctrl+U
    (e.ctrlKey && e.shiftKey && e.key === 'i') || // Ctrl+Shift+I
    e.key === 'F12' // F12
  ) {
    e.preventDefault();
  }
});

// Tải và chèn sidebar HTML vào .sidebar
fetch("/views/sidebar.html")
  .then(response => response.text())
  .then(data => {
    document.querySelector(".sidebar").innerHTML = data;

    // Đảm bảo phần tử edm tồn tại trước khi đăng ký sự kiện
    const currentPage = window.location.pathname;
    const homeItem = document.getElementById('home');
    const edmItem = document.getElementById('edm');
    const searchItem = document.getElementById('search');
    const videoItem = document.getElementById('video');
    const uploadItem = document.getElementById('upload');
    const dataItem = document.getElementById('filedata');
    
    //active
    //active
    //active
    //active
    if (currentPage === "/") {
      if (homeItem) {
        homeItem.classList.add('active'); 
      }
    } 
    if (currentPage === "/upload/") {
      if (uploadItem) {
        uploadItem.classList.add('active'); 
      }
    } 
    if (currentPage === "/edm/") {
      if (edmItem) {
        edmItem.classList.add('active');
      }
    } 
      if (currentPage === "/video/") {
      if (videoItem) {
        videoItem.classList.add('active'); 
      }
    } 
        if (currentPage === "/data/" || currentPage === "/data/uploadData") {
  if (dataItem) {
    dataItem.classList.add('active'); 
  }
}

    //click
    //click
    //click
    if (edmItem) {
      edmItem.addEventListener('click', function() {
        window.location.href = '/edm/';
      });
    }
    // Đăng ký sự kiện click cho các phần tử
    if (uploadItem) {
     uploadItem.addEventListener('click', function() {
        window.location.href = '/upload/';
      });
    }
    if (homeItem) {
      homeItem.addEventListener('click', function() {
        window.location.href = '/';
      });
    }
  if (dataItem) {
      dataItem.addEventListener('click', function() {
        window.location.href = '/data/';
      });
    }
      // Sự kiện khi nhấn vào phần tử có id là "search"
    searchItem.addEventListener('click', () => {
        // Hiển thị prompt yêu cầu người dùng nhập từ khóa
        const query = prompt("Tìm kiếm gì đó thú vị 😏:");

        // Nếu người dùng đã nhập từ khóa, chuyển hướng đến Cốc Cốc
        if (query) {
            window.location.href = `https://ihentai.ac/search?s=${encodeURIComponent(query)}`;
        }
    });

  })

.catch(err => console.error('Lỗi khi tải navbar:', err)); // Xử lý lỗi khi không tải được navbar.html
  
  
  // Tải và chèn toggle HTML vào .toggle
fetch("/views/toggle.html")
  .then(response => response.text())
  .then(data => {
    document.querySelector(".toggle").innerHTML = data;

    // Kiểm tra nếu phần tử toggle-ball tồn tại
    const ball = document.querySelector(".toggle-ball");
    if (ball) {
      const items = document.querySelectorAll(".container, .movie-list-title, .navbar-container, .sidebar, .left-menu-icon, .toggle");
      
      // Đăng ký sự kiện toggle
      ball.addEventListener("click", () => {
        items.forEach((item) => {
          item.classList.toggle("active");
        });
        ball.classList.toggle("active");
      });
    }
  })
  .catch(err => console.error('Lỗi khi tải toggle:', err)); // Xử lý lỗi khi không tải được toggle.html
  
  
  fetch("/views/menu-container.html")
  .then(response => response.text())
  .then(data => {
    document.querySelector(".menu-container").innerHTML = data;
    
    const currentPage = window.location.pathname;
    if (currentPage === "/") {
      const homeItem = document.getElementById('home');
      if (homeItem) {
        homeItem.classList.add('active'); // Thêm class 'active' cho Home
      }
    } 
    if (currentPage === "/edm/") {
      const edmItem = document.getElementById('edm');
      if (edmItem) {
        edmItem.classList.add('active'); // Thêm class 'active' cho Home
      }
    } 
    if (currentPage === "/content/") {
      const contentItem = document.getElementById('content');
      if (contentItem) {
        contentItem.classList.add('active'); // Thêm class 'active' cho Home
      }
    } 
        if (currentPage === "/data/") {
      const dataItem = document.getElementById('data');
      if (dataItem) {
        dataItem.classList.add('active'); // Thêm class 'active' cho Home
      }
    } 
         
      const filedata = document.getElementById('data');
      if (filedata) {
        filedata.addEventListener('click', function() {
          window.location.href = '/data/';
        });
      }
          const edm = document.getElementById('edm');
      if (edm) {
        edm.addEventListener('click', function() {
          window.location.href = '/edm/';
        });
      }
    const kimochi = document.getElementById('kimochi');
if (kimochi) {
  kimochi.addEventListener('click', function() {
    window.location.href = 'https://ihentai.ac';
  });
}

    const home = document.getElementById('home');
    if (home) {
        home.addEventListener('click', function() {
          window.location.href = '/';
        });
      }
     const content = document.getElementById('content');
    if (content) {
        content.addEventListener('click', function() {
          window.location.href = '/content/';
        });
      }
  })
  .catch(err => console.error('menu:', err)); // Xử lý lỗi khi không tải được toggle.html
  
  // Tải tệp head.html và chèn nó vào thẻ <head> của trang hiện tại
  fetch('/views/head.html')
    .then(response => response.text())
    .then(data => {
      // Tìm thẻ <head> và thêm dữ liệu từ head.html vào
      document.head.innerHTML += data;
    })
    .catch(err => console.error('Không thể tải head.html:', err));


      // Đảm bảo phần tử profileTextContainer và dropdownMenu tồn tại trước khi đăng ký sự kiện
      const profileTextContainer = document.getElementById('profileTextContainer');
      const dropdownMenu = document.getElementById('dropdownMenu');
      if (profileTextContainer && dropdownMenu) {
        profileTextContainer.addEventListener('click', () => {
          dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
        });

        // Ẩn dropdown menu khi nhấn ra ngoài
        window.addEventListener('click', (event) => {
          if (!profileTextContainer.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = "none";
          }
        });
      }








leftArrows.forEach((arrow, i) => {
  const itemNumber = movieLists[i].querySelectorAll("img").length;

  // Khi nhấn mũi tên trái, lùi về 1 phần tử
  arrow.addEventListener("click", () => {
    const ratio = Math.floor(window.innerWidth / 270); // Xác định số lượng phần tử có thể chứa trong một trang
    const currentX = movieLists[i].computedStyleMap().get("transform")[0].x.value; // Lấy vị trí hiện tại của translateX

    // Nếu vị trí hiện tại không phải là 0, di chuyển lùi 1 phần tử (300px)
    if (currentX < 0) {
      movieLists[i].style.transform = `translateX(${currentX + 300}px)`;
    } else {
      movieLists[i].style.transform = "translateX(0)"; // Nếu đang ở vị trí 0, không di chuyển
    }
  });

  // Ẩn mũi tên trái khi di chuột ra khỏi cả container và mũi tên
  movieLists[i].addEventListener("mouseenter", () => {
    arrow.style.opacity = 1; // Hiển thị mũi tên khi di chuột vào
  });
  movieLists[i].addEventListener("mouseleave", () => {
    if (!arrow.matches(":hover")) {
      arrow.style.opacity = 0; // Ẩn mũi tên khi di chuột ra
    }
  });

  // Đảm bảo mũi tên không bị ẩn khi di chuột qua mũi tên
  arrow.addEventListener("mouseenter", () => {
    arrow.style.opacity = 1; // Giữ mũi tên hiển thị khi di chuột qua
  });
  arrow.addEventListener("mouseleave", () => {
    if (!movieLists[i].matches(":hover")) {
      arrow.style.opacity = 0; // Ẩn mũi tên khi chuột không còn ở container
    }
  });
});

rightArrows.forEach((arrow, i) => {
  const itemNumber = movieLists[i].querySelectorAll("img").length;
  let clickCounter = 0;

  // Khi nhấn mũi tên phải, di chuyển về phải
  arrow.addEventListener("click", () => {
    const ratio = Math.floor(window.innerWidth / 270); // Số lượng phần tử trên một dòng
    const currentX = movieLists[i].computedStyleMap().get("transform")[0].x.value; // Lấy vị trí hiện tại của translateX

    // Nếu còn đủ không gian, tiếp tục di chuyển sang phải
    if (itemNumber - (clickCounter + ratio - 2) > 0) { // Thêm 2 vào điều kiện để tăng số lần di chuyển
      clickCounter++; // Tăng số lượng bước đã di chuyển
      movieLists[i].style.transform = `translateX(${currentX - 300}px)`; // Di chuyển 300px sang phải
    } else {
      // Nếu không còn phần tử nào để di chuyển, về lại vị trí ban đầu
      movieLists[i].style.transform = "translateX(0)";
      clickCounter = 0; // Reset lại clickCounter
    }
  });

  // Ẩn mũi tên phải khi di chuột ra khỏi cả container và mũi tên
  movieLists[i].addEventListener("mouseenter", () => {
    arrow.style.opacity = 1; // Hiển thị mũi tên khi di chuột vào
  });
  movieLists[i].addEventListener("mouseleave", () => {
    if (!arrow.matches(":hover")) {
      arrow.style.opacity = 0; // Ẩn mũi tên khi di chuột ra
    }
  });

  // Đảm bảo mũi tên không bị ẩn khi di chuột qua mũi tên
  arrow.addEventListener("mouseenter", () => {
    arrow.style.opacity = 1; // Giữ mũi tên hiển thị khi di chuột qua
  });
  arrow.addEventListener("mouseleave", () => {
    if (!movieLists[i].matches(":hover")) {
      arrow.style.opacity = 0; // Ẩn mũi tên khi chuột không còn ở container
    }
  });
});


console.log(Math.floor(window.innerWidth / 270));


// Lắng nghe sự kiện nhấn nút "Watch"
document.querySelectorAll('.movie-list-item-button').forEach(button => {
  button.addEventListener('click', (event) => {
    // Lấy URL video từ thuộc tính data-video-url
    const videoUrl = event.target.getAttribute('data-video-url');
    
    // Lấy tiêu đề và mô tả video từ các phần tử trong DOM
    const movieItem = event.target.closest('.movie-list-item');
    const videoTitle = movieItem.querySelector('.movie-list-item-title').textContent;  // Tiêu đề
    const videoDesc = movieItem.querySelector('.movie-list-item-desc').textContent;    // Mô tả

    // Lưu thông tin video vào localStorage
    localStorage.setItem('videoUrl', videoUrl);
    localStorage.setItem('videoTitle', videoTitle);
    localStorage.setItem('videoDesc', videoDesc);

    // Chuyển hướng đến trang video.html
    window.location.href = '/video'; // Chuyển sang trang video
  });
});
// Lắng nghe sự kiện nhấn nút "WATCH" trong phần Featured
document.querySelectorAll('.featured-button').forEach(button => {
  button.addEventListener('click', (event) => {
    // Lấy URL video từ thuộc tính data-video-url
    const videoUrl = event.target.getAttribute('data-video-url');
    
    // Lấy tiêu đề và mô tả video từ phần tử trong .featured-info
    const featuredContent = event.target.closest('.featured-content');
    const videoTitle = featuredContent.querySelector('.featured-title-text').textContent;  // Tiêu đề video
    const videoDesc = featuredContent.querySelector('.featured-desc').textContent;  // Mô tả video

    // Lưu thông tin video vào localStorage
    localStorage.setItem('videoUrl', videoUrl);
    localStorage.setItem('videoTitle', videoTitle);
    localStorage.setItem('videoDesc', videoDesc);

    // Chuyển hướng đến trang video.html
    window.location.href = '/video'; // Chuyển sang trang video
  });
});

      // Kiểm tra khi tải trang và khi thay đổi kích thước màn hình
      window.addEventListener("resize", function () {
        const overlay = document.getElementById("overlay");
        const notification = document.getElementById("notification");
        if (window.innerHeight > window.innerWidth) {
          overlay.style.display = "block"; // Hiển thị lớp nền
          notification.style.display = "block"; // Hiển thị thông báo
        } else {
          overlay.style.display = "none"; // Ẩn lớp nền
          notification.style.display = "none"; // Ẩn thông báo
        }
      });

      // Kiểm tra khi trang tải lần đầu
      window.dispatchEvent(new Event("resize"));



