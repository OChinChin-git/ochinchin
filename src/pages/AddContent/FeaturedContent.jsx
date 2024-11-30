// FeaturedContent.jsx
import React,{useState,useEffect}from 'react';
import "../../styles/AddContent.css";
import {loadOption} from "/src/components/AddContent.js";

const FeaturedContent = () => {
  const [options, setOptions] = useState([]); // State để lưu các option
  const [selectedContent, setSelectedContent] = useState(""); // State để lưu lựa chọn của người dùng
  
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Gọi hàm loadOption để tải các giá trị (ví dụ: "feature")
        const data = await loadOption("feature"); // Bạn có thể thay "feature" bằng giá trị khác
        setOptions(data);
        console.log(data)// Cập nhật state options với dữ liệu lấy được
      } catch (error) {
        console.error("Lỗi khi tải options:", error);
      }
    };

    fetchOptions();
  }, []);

  return (
          <div id="feature-section" className="section">
            <h2 className="content-title">Featured Movie</h2>
      <p className="content-desc">Những bộ phim nổi bật, đáng xem!</p>
            <label className="selectLabel">Chọn Featured Content:
            <select id="select-feature"
              value={selectedContent}
              >
              <option value="">New</option>
              {options.length > 0 ? (
            options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))
          ) : (
            <option value="">Không có nội dung</option>
          )}
            </select>
            <button id="load-feature">Tải Featured Content</button>
            </label>
            <form id="new-feature-form">
              <label>Featured Content:
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Nhập Feature title"
                required
              />
              </label>

              <label className="selectLabel">Chọn video :
              <select id="video-dropdown">
                <option value="">-- Chọn video --</option>
              </select>
              </label>
              <label>URL Video:
              <input
                type="text"
                name="featureVideoUrl"
                id="video-url"
                placeholder="Nhập URL video"
                required
              />
              </label>
              <label>URL Background:
              <input
                type="text"
                name="backgroundUrl"
                id="backgroundUrl"
                placeholder="Nhập URL hình nền"
                required
              />
                </label>
              <label>URL Feature:
              <input
                type="text"
                name="featuredImgUrl"
                id="featuredImgUrl"
                placeholder="Nhập URL Feature"
                required
              />
                </label>
              
              <label >Mô tả :
              <input
                type="text"
                name="featuredDesc"
                id="featuredDesc"
                placeholder="Nhập mô tả cho feature này"
                required
              /></label>
                
              <button className="save-content-button" type="submit" id="save-feature">Lưu Feature</button>
            </form>
          </div>
  );
};

export default FeaturedContent;
