// MovieList.jsx
import React from 'react';
import "../styles/AddContent.css";
const MovieList = () => {
  return (
          
          <div id="movie-list-section" className="section">
            <h2 className="content-title">Movie List</h2>
            <p className="content-desc">Danh sách các video, có thể sắp xếp thứ tự.</p>
            <label className="selectLabel">Chọn Movie List:
            <select id="select-movie-list">
            </select>
            <button id="load-movie-list">Tải Movie List</button>
            </label>
            <form id="new-movie-list-form">
              <label>Tên Movie List:
              <input
                type="text"
                name="listName"
                placeholder="Nhập tên danh sách Movie"
                required
              /></label>

              <div id="movies-container">
                <h3 className="movie-list-items">Movie List:</h3>
                <label className="selectLabel"
                  >Chọn video từ danh sách:
                <select id="select-existing-video">
                  
                </select>
                <button type="button" id="add-to-list">Thêm Movie</button>
                  </label>
                <table id="movie-list-table">
                  <thead>
                    <tr>
                      <th>Video ID</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody id="movie-list-table-body">
                    
                  </tbody>
                </table>
              </div>

              <button type="submit" id="save-movieList">Lưu Movie List</button>
            </form>
          </div>
  );
};

export default MovieList;
