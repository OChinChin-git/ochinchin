const functions = require("firebase-functions");
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// Middleware để xử lý dữ liệu JSON từ client
app.use(express.json());

// CORS middleware
app.use(cors());

// Cấu hình view engine là EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware để thêm header Cache-Control
const cacheMiddleware = (req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=3600"); // Cache 1 giờ
  next();
};

// Áp dụng cache cho các tài nguyên cụ thể
app.use("/views", cacheMiddleware);
app.use("/style/style.css", cacheMiddleware);
app.use("/style/animated.css", cacheMiddleware);
app.use("/script/animated.js", cacheMiddleware);
app.use("/script/app.js", cacheMiddleware);
app.use("/index.html", cacheMiddleware);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Định nghĩa các route
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));
app.get("/content", (req, res) => res.sendFile(path.join(__dirname, "public/add-content.html")));
app.get("/edm", (req, res) => res.sendFile(path.join(__dirname, "public/edm.html")));
app.get("/upload", (req, res) => res.sendFile(path.join(__dirname, "public/upload.html")));
app.get("/apikey", (req, res) => res.sendFile(path.join(__dirname, "public/apikey.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public/login.html")));
app.get("/data/uploaddata", (req, res) => res.sendFile(path.join(__dirname, "public/uploaddata.html")));
app.get("/video", (req, res) => res.sendFile(path.join(__dirname, "public/video.html")));
app.get("/data", (req, res) => res.sendFile(path.join(__dirname, "public/data.html")));

// Example logging usage
const logger = functions.logger;
app.use((req, res, next) => {
  logger.info(`Request received: ${req.method} ${req.url}`);
  next();
});

// Export Express app dưới dạng Firebase Cloud Function
exports.app = functions.https.onRequest(app);
