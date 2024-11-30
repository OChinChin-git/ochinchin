// MovieList.jsx
import React,{useState,useEffect} from 'react';
import "../../styles/AddContent.css";
import {loadOption} from "/src/components/AddContent.js"

const MovieList = () => {
  const [selectedML, setSelectedML] = useState();
  const [movieListOptions, setMovieListOptions] = useState([]);
  const [videoOptions,setVideoOptions] =useState([]);
  const [selectedVideo,setSelectedVideo] = useState();
  
  const fetchOption = async(type) =>{
  try{
    const data= await loadOption(type);
    if(type === "movieList"){
    setMovieListOptions(data);
    }else{
      setVideoOptions(data);
    }
  }catch(error){
    console.error("Lỗi khi tải options:", error);
  }
}
  useEffect(() =>{
    fetchOption("movieList");
    fetchOption("videos")
  },[]);

  return (
          
          <div id="movie-list-section" className="section">
            <h2 className="content-title">Movie List</h2>
            <p className="content-desc">Danh sách các video, có thể sắp xếp thứ tự.</p>
            <label className="selectLabel">Chọn Movie List:
            <select id="select-movie-list"
              value={selectedML}
              >
              <option value="">New</option>
                {movieListOptions.length > 0 ?(
                
                movieListOptions.map((mLOption) =>(
                <option key={mLOption}
                  value={mLOption}>{mLOption}
                  </option>))
              ): ""};
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
                <select id="select-existing-video"
                  value={selectedVideo}
                  >
                  <option value="">New</option>
                  {videoOptions.length >0 ?(
                  videoOptions.map((videoOption) =>(
                  <option key={videoOption} 
                    value={videoOption}>
                      {videoOption}</option> 
                  ))
                  ) : ""};
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
