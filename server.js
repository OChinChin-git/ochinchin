
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { Dropbox } = require("dropbox");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware để xử lý dữ liệu JSON từ client
app.use(express.json());
app.use(bodyParser.json());


const cors = require('cors');
app.use(cors());  // Cho phép tất cả các domain gửi yêu cầu đến server
// Cấu hình view engine là EJS
app.set('view engine', 'ejs');

// cache
// cache
// cache
app.use('/style/style.css', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Lưu cache 1 giờ
  next();
});
app.use('/style/animated.css', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Lưu cache 1 giờ
  next();
});
app.use('/script/animated.js', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Lưu cache 1 giờ
  next();
});
app.use('/script/app.js', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Lưu cache 1 giờ
  next();
});
app.use('/views', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Lưu cache 1 giờ
  next();
});
app.use('index.html', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Lưu cache 1 giờ
  next();
});

// Cấu hình thư mục chứa view (tệp EJS)
app.set('views', './views');

// Đảm bảo thư mục data tồn tại
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}


// Serve static files và các trang HTML
// Serve static files và các trang HTML
// Serve static files và các trang HTML
app.use(express.static(__dirname));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));
app.get("/content", (req, res) => res.sendFile(path.join(__dirname, "public/add-content.html")));
app.get("/edm", (req, res) => res.sendFile(path.join(__dirname, "public/edm.html")));
app.get("/upload", (req, res) => res.sendFile(path.join(__dirname, "public/upload.html")));
app.get("/apikey", (req, res) => res.sendFile(path.join(__dirname, "public/apikey.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public/login.html")));
app.get("/data/uploaddata", (req, res) => res.sendFile(path.join(__dirname, "public/uploaddata.html")));
app.get("/video", (req, res) => res.sendFile(path.join(__dirname, "public/video.html")));
app.get("/data", (req, res) => res.sendFile(path.join(__dirname, "public/data.html")));


const orderFilePath = path.join(dataDir, 'data/order.txt');
// Hàm để ghi nội dung vào file order.txt
const updateOrderFile = (entries) => {
    const newContent = entries.join('\n') + '\n';

    // Ghi nội dung vào order.txt
    fs.writeFile(orderFilePath, newContent, (err) => {
        if (err) {
            console.error(`Lỗi cập nhật file order.txt: ${err}`);
        } else {
            console.log('Đã cập nhật file order.txt');
        }
    });
};

// Hàm để đọc tất cả các file JSON trong thư mục data/ và cập nhật vào order.txt
const updateOrderFromJsonFiles = () => {
    // Đọc danh sách các file trong thư mục data/
    fs.readdir(dataDir, (err, files) => {
        if (err) {
            console.error(`Lỗi đọc thư mục data: ${err}`);
            return;
        }

        // Lọc ra những file có đuôi .json
        const jsonFiles = files.filter(file => path.extname(file) === '.json');

        const orderEntries = [];

        // Đọc và xử lý từng file JSON
        jsonFiles.forEach((file) => {
            const filePath = path.join(dataDir, file);

            // Kiểm tra loại file và phân loại
            if (file.startsWith('f_')) {
                const name = file.slice(2, -5); // Lấy tên phần còn lại, bỏ "f_" và ".json"
                orderEntries.push(`feature ${name}`);
            } else if (file.startsWith('m_')) {
                const name = file.slice(2, -5); // Lấy tên phần còn lại, bỏ "m_" và ".json"
                orderEntries.push(`movie-list ${name}`);
            }
        });

        // Cập nhật order.txt với các entry mới
        updateOrderFile(orderEntries);
    });
};

// Hàm để theo dõi sự thay đổi trong thư mục data/ và cập nhật order.txt khi có thay đổi
const watchDataDir = () => {
    fs.watch(dataDir, { encoding: 'utf-8' }, (eventType, filename) => {
        if (eventType === 'rename') {
            console.log(`Thay đổi trong thư mục data: ${filename}`);
            // Cập nhật lại order.txt khi có thay đổi (thêm hoặc xóa file)
            updateOrderFromJsonFiles();
        }
    });
};

// Chạy hàm để theo dõi thư mục và cập nhật order.txt khi có thay đổi
watchDataDir();
// Route để lưu feature mới
app.post('/save-feature', (req, res) => {
    const { featureName, title, videoUrl, backgroundUrl, featuredImgUrl, featuredDesc } = req.body;

    // Kiểm tra nếu thiếu bất kỳ trường quan trọng nào
    if (!featureName || !title || !videoUrl || !backgroundUrl || !featuredImgUrl || !featuredDesc) {
        return res.status(400).send('Tất cả các trường đều là bắt buộc.');
    }

    const validFileName = `f_${featureName}.json`;
    const filePath = path.join(dataDir, validFileName);

    // Tạo đối tượng featureData để lưu vào file JSON
    const featureData = {
        title,
        videoUrl,
        backgroundUrl,
        featuredImgUrl,
        featuredDesc,
    };

    // Kiểm tra nếu file đã tồn tại, nếu có thì thay thế
    fs.exists(filePath, (exists) => {
        if (exists) {
            // File đã tồn tại, ghi đè nội dung
            fs.writeFile(filePath, JSON.stringify(featureData, null, 2), (err) => {
                if (err) return res.status(500).send('Lỗi ghi đè feature');
                
                // Cập nhật file order.txt
                updateOrderFile('feature', featureName);
                
                res.send('Feature đã cập nhật thành công');
            });
        } else {
            // Nếu không tồn tại, lưu mới
            fs.writeFile(filePath, JSON.stringify(featureData, null, 2), (err) => {
                if (err) return res.status(500).send('Lỗi lưu feature');
                
                // Cập nhật file order.txt
                updateOrderFile('feature', featureName);
                
                res.send('Feature đã lưu thành công');
            });
        }
    });
});


// Route để lưu movie list mới
app.post('/save-movie-list', (req, res) => {
    const { movieListName, listName, movies } = req.body;

    if (!movieListName) return res.status(400).send('Tên file là bắt buộc.');

    const validFileName = `m_${movieListName}.json`;
    const filePath = path.join(dataDir, validFileName);

    // Kiểm tra nếu file đã tồn tại, nếu có thì thay thế
    fs.exists(filePath, (exists) => {
        if (exists) {
            // File đã tồn tại, ghi đè nội dung
            fs.writeFile(filePath, JSON.stringify({ listName, movies }), (err) => {
                if (err) return res.status(500).send('Lỗi ghi đè movie list');
                
                // Cập nhật file order.txt
                updateOrderFile('movie-list', movieListName);

                res.send('Movie List đã cập nhật thành công');
            });
        } else {
            // Nếu không tồn tại, lưu mới
            fs.writeFile(filePath, JSON.stringify({ listName, movies }), (err) => {
                if (err) return res.status(500).send('Lỗi lưu movie list');
                
                // Cập nhật file order.txt
                updateOrderFile('movie-list', movieListName);

                res.send('Movie List đã lưu thành công');
            });
        }
    });
});

// Lấy danh sách tất cả các file JSON trong thư mục data
app.get('/content-list', (req, res) => {
    const dataDir = path.join(__dirname, 'data');  // Đảm bảo thư mục data đúng
    fs.readdir(dataDir, (err, files) => {
        if (err) return res.status(500).json({ error: 'Không thể tải danh sách file' });
        
        // Lọc chỉ các file có đuôi .json
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        // Trả về danh sách file JSON
        res.json(jsonFiles);
    });
});

// Lấy danh sách file movie list (dựa trên tiền tố 'm_')
app.get('/movie-list', (req, res) => {
    const dataDir = path.join(__dirname, 'data');  // Đảm bảo thư mục data đúng
    fs.readdir(dataDir, (err, files) => {
        if (err) return res.status(500).json({ error: 'Không thể tải danh sách movie list' });

        // Lọc các file có tiền tố 'm_'
        const movieListFiles = files.filter(file => file.startsWith('m_') && file.endsWith('.json'));

        res.json(movieListFiles);  // Trả về danh sách file movie list
    });
});

// Lấy danh sách file feature (dựa trên tiền tố 'f_')
app.get('/feature-list', (req, res) => {
    const dataDir = path.join(__dirname, 'data');  // Đảm bảo thư mục data đúng
    fs.readdir(dataDir, (err, files) => {
        if (err) return res.status(500).json({ error: 'Không thể tải danh sách feature' });

        // Lọc các file có tiền tố 'f_'
        const featureFiles = files.filter(file => file.startsWith('f_') && file.endsWith('.json'));

        res.json(featureFiles);  // Trả về danh sách file feature
    });
});

// Lấy dữ liệu movie list khi chọn
app.get('/load-movie-list/:fileName', (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(dataDir, fileName);

    fs.readFile(filePath, (err, data) => {
        if (err) return res.status(500).json({ error: 'Không thể tải movie list' });
        
        const movieList = JSON.parse(data);
        res.json(movieList);  // Trả về dữ liệu movie list
    });
});

// Lấy dữ liệu feature khi chọn
app.get('/load-feature/:fileName', (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(dataDir, fileName);

    fs.readFile(filePath, (err, data) => {
        if (err) return res.status(500).json({ error: 'Không thể tải feature' });

        const feature = JSON.parse(data);
        res.json(feature);  // Trả về dữ liệu feature
    });
});

// Route để lấy thứ tự từ file order.txt
app.get("/get-files-order", (req, res) => {
  const orderFilePath = path.join(__dirname, "data/order.txt");

  fs.readFile(orderFilePath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Không thể đọc file order.txt" });
    } else {
      const files = data
        .split("\n")
        .filter(line => line.trim() !== "")
        .map(line => {
          const [content, fileName] = line.split(" ");
          return { content, name: fileName };
        });
      res.json(files);
    }
  });
});

// Route để lưu thứ tự mới vào file order.txt
app.post("/save-file-order", (req, res) => {
  const newOrder = req.body.order; // Array chứa thứ tự mới

  // Chuyển đổi mảng thành chuỗi với định dạng dòng "content fileName"
  const data = newOrder.map(item => `${item.content} ${item.name}`).join("\n");

  const orderFilePath = path.join(__dirname, "data/order.txt");
  fs.writeFile(orderFilePath, data, (err) => {
    if (err) {
      res.status(500).send("Lỗi khi lưu thứ tự");
    } else {
      res.send("Thứ tự đã được lưu thành công!");
    }
  });
});
// Middleware để phục vụ các file tĩnh (như JSON, hình ảnh)
app.use(express.static('public'));

// Đọc file order.txt và trả về danh sách thứ tự
app.get('/order', (req, res) => {
  const orderFilePath = path.join(__dirname, 'data', 'order.txt');
  
  fs.readFile(orderFilePath, 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send("Lỗi khi đọc file order.txt");
      return;
    }
    
    // Split các dòng và trả về danh sách order
    const order = data.trim().split('\n').map(line => line.trim());
    res.json(order);
  });
});

// Phục vụ các file JSON từ thư mục data/
app.get('/data/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'data', req.params.filename);
  
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      res.status(404).send("Không tìm thấy file dữ liệu.");
      return;
    }
    
    res.json(JSON.parse(data));
  });
});
const PASSWORD = "ochinchin"; // Mật khẩu cần thiết để xóa
// Route xóa file
app.post('/delete-file', (req, res) => {
  const { password, content, name } = req.body;

  // Kiểm tra mật khẩu
  if (password !== PASSWORD) {
    return res.json({ success: false, message: "Mật khẩu sai" });
  }

  // Tạo tên file cần xóa dựa trên loại nội dung
  let fileName = '';
  if (content === 'feature') {
    fileName = `f_${name}.json`;
  } else if (content === 'movie-list') {
    fileName = `m_${name}.json`;
  } else {
    return res.json({ success: false, message: "Loại nội dung không hợp lệ" });
  }

  console.log(`Đang xóa file: ${fileName}`);  // Kiểm tra tên file

  // Kiểm tra nếu file tồn tại và xóa
  fs.unlink(`./data/${fileName}`, (err) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: "Không thể xóa file" });
    }
    res.json({ success: true });
  });
});
// Khai báo biến để lưu trữ API Key
let DROPBOX_ACCESS_TOKEN = fs.readFileSync("data/apikey.txt", "utf-8");

// Theo dõi sự thay đổi của file apikey.txt
fs.watchFile("data/apikey.txt", (curr, prev) => {
  const newApiKey = fs.readFileSync("data/apikey.txt", "utf-8");
  if (newApiKey !== DROPBOX_ACCESS_TOKEN) {
    console.log("API Key đã thay đổi.");
    DROPBOX_ACCESS_TOKEN = newApiKey; // Cập nhật giá trị mới của API Key
  }
});
// Route để lưu API Key
app.post("/save-apikey", (req, res) => {
  const { apikey } = req.body;

  // Kiểm tra xem API Key có hợp lệ không
  if (!apikey || apikey.length <= 64) {
    return res.status(400).json({ message: "API Key phải dài hơn 64 ký tự" });
  }

  // Kiểm tra API Key bắt đầu bằng "sl." và chứa dấu "-" giữa hai phần chuỗi
  if (!apikey.startsWith("sl.")) {
    return res
      .status(400)
      .json({ message: "API Key không hợp lệ định dạng.101" });
  }

  // Lưu API Key vào file
  fs.writeFile("data/apikey.txt", apikey, (err) => {
    if (err) {
      return res.status(500).json({ message: "Không thể lưu API Key" });
    }

    // Thêm một khoảng chờ 1 giây trước khi gửi phản hồi về client
    setTimeout(() => {
      res.json({ message: "API Key đã được lưu thành công" });
    }, 3000); // Đợi 1000ms (1 giây)
  });
});
// Route kiểm tra token
app.get("/check-token", async (req, res) => {
  try {
    const dropbox = new Dropbox({ accessToken: DROPBOX_ACCESS_TOKEN });

    // Kiểm tra token hợp lệ bằng cách thử lấy thông tin tài khoản
    await dropbox.usersGetCurrentAccount();
    return res.json({ valid: true });
  } catch (error) {
    console.error("Token không hợp lệ:", error);
    return res.status(401).json({ valid: false, message: "Token không hợp lệ" });
  }
});
const activeUploads = new Map();
const { Readable } = require('stream');
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.array("files", 10), async (req, res) => {
  try {
    const dropbox = new Dropbox({ accessToken: DROPBOX_ACCESS_TOKEN });

    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Không có file nào được tải lên." });
    }

    // Lưu file tạm vào activeUploads (tại đây, tệp sẽ ở trong RAM)
    req.files.forEach((file) => {
      activeUploads.set(file.filename, file.buffer); // Lưu file dưới dạng Buffer trong RAM
    });

    const links = [];
    
    // Bắt đầu tải từng file lên Dropbox
    for (const file of files) {
      const customFileName =
        req.body.customName && req.body.customName.trim() !== ""
          ? req.body.customName
              .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
              .replace(/\s+/g, "_")
          : path.basename(file.originalname, path.extname(file.originalname));

      const fileExtension = path.extname(file.originalname);
      const finalFileName = customFileName.endsWith(fileExtension)
        ? customFileName
        : `${customFileName}${fileExtension}`;

      const fileStream = Readable.from(file.buffer); // Chuyển Buffer thành stream

      // Tải file lên Dropbox
      const uploadResponse = await dropbox.filesUpload({
        path: `/uploads/${finalFileName}`,
        contents: fileStream,
      });

      // Tạo liên kết chia sẻ cho file vừa tải lên
      const sharedLinkResponse = await dropbox.sharingCreateSharedLink({
        path: uploadResponse.result.path_lower,
      });
      const link = sharedLinkResponse.result.url.replace(/dl=0/, "dl=1");
      links.push(link);

      // Lưu thông tin vào file uploaddata.txt theo từng dòng
      const dataToSave = `${finalFileName} - ${link}\n`; // Mỗi tệp sẽ được ghi trên một dòng mới
      fs.appendFileSync("data/uploaddata.txt", dataToSave); // Ghi vào file uploaddata.txt
    }

    // Trả về các liên kết chia sẻ cho client
    res.json({ links });

    // Xóa file tạm khỏi bộ nhớ sau khi upload thành công
    req.files.forEach((file) => {
      activeUploads.delete(file.filename); // Xóa file khỏi activeUploads (RAM)
    });

  } catch (error) {
    console.error("Error uploading to Dropbox:", error);

    // Kiểm tra lỗi token cụ thể
    const iframeHTML = `<a>API Key đã hết hạn hoặc không hợp lệ!</a>
            <div>
                <iframe src="/expired.html" style="width:100%; height:200px; border:none;"></iframe>
            </div>`;

    // Trả về lỗi 500 cho client và thông báo dừng tất cả tiến trình tải lên
    res.status(500).json({ error: iframeHTML });

    // Xóa các file tạm đã tải lên trong bộ nhớ (RAM) nếu có lỗi
    req.files.forEach((file) => {
      activeUploads.delete(file.filename); // Xóa file khỏi activeUploads
    });
  }
});



// Route để lấy danh sách từ file uploaddata.txt
app.get("/uploads", (req, res) => {
  fs.readFile("data/uploaddata.txt", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Không thể đọc file" });
    }

    const files = data
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const [fileName, fileUrl] = line.split(" - "); // Giả sử định dạng là "tên_file - url_file"
        return { fileName, fileUrl };
      });

    res.json(files);
  });
});

// Route kiểm tra tên file trong uploaddata.txt
app.post('/check-file-name', (req, res) => {
  const { fileName } = req.body; // Nhận tên file từ client

  const filePath = path.join(__dirname, 'data/uploaddata.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Không thể đọc file uploaddata.txt' });
    }

    // Kiểm tra xem tên file có tồn tại trong uploaddata.txt không
    const lines = data.split('\n');
    const fileExists = lines.some(line => line.includes(fileName));

    if (fileExists) {
      return res.status(400).json({ error: 'File đã tồn tại trong hệ thống.' });
    }

    res.status(200).json({ success: true });
  });
});
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
