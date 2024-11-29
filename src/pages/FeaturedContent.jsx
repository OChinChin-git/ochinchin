// FeaturedContent.jsx
import React from 'react';
import "../styles/AddContent.css";
const FeaturedContent = () => {
  return (
          <div id="feature-section" className="section">
            <h2 className="content-title">Featured Movie</h2>
      <p className="content-desc">Những bộ phim nổi bật, đáng xem!</p>
            <label className="selectLabel">Chọn Featured Content:
            <select id="select-feature">
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
