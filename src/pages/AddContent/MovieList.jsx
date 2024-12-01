// MovieList.jsx
import React,{useState,useEffect,useRef} from 'react';
import "../../styles/AddContent.css";
import {loadOption,saveDoc,processUrl,loadDoc} from "/src/components/AddContent.js"
import {useToast} from "/src/components/ToastContext"
import {useLoader} from "/src/components/LoaderContext";

const MovieList = () => {
  const [selectedML, setSelectedML] = useState("");
  const [movieListOptions, setMovieListOptions] = useState([]);
  const [videoOptions,setVideoOptions] =useState([]);
  const [selectedVideo,setSelectedVideo] = useState("");
  const titleRef = useRef();
  const formRef = useRef();
  const [videoList,setVideoList] =useState([]);
  const {showToast} = useToast();
  const {showLoader,hideLoader} = useLoader();
  
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
const handleLoadML = async()=>{
  if(selectedML === ""){
    const isConfirm = confirm("Chưa có list nào được chọn, làm trống list ?");
    if(!isConfirm){
      showToast("Đã hủy")
      return
    }
    formRef.current.reset();
    setVideoList([]);
    showToast("Đã làm trống list")
    return
  }
  try{
    showLoader("Đang load list: "+selectedML)
    const data = await loadDoc("movieList",selectedML);
    if(data){
      titleRef.current.value = data.name;
      setVideoList(data.videos);
    }
    showToast("Load thành công")
  }catch(error){
    alert(error);
  }finally{
    hideLoader();
  }
}
const handleSubmit = async() =>{
  event.preventDefault();
  try{
    const title=titleRef.current.value
    showLoader("Đang lưu: "+title)
    const data = {
      name: title,
      videos: videoList,
    }
    
    const result = await saveDoc("movieList",title,data)
    if(result === 'canceled'){
      showToast("Đã hủy")
      return
    }
    showToast("Lưu thành công","success");
    formRef.current.reset();
    setVideoList([]);
  }catch(error){
    alert(error)
  }finally{
    hideLoader();
  }
}
const handleRemoveVideo = (videoId) =>{
  setVideoList(videoList.filter((video)=>video!=videoId));
  showToast("Remove "+videoId +" khỏi list")
};
const handleAddVideo = ()=>{
  if(selectedVideo ===""){
     return
  }
  if(videoList.includes(selectedVideo)){
    showToast("Video đã có trong danh sách")
    return
  }
  setVideoList([...videoList,selectedVideo]);
  showToast("Đã thêm video: "+selectedVideo+" vào list");
};
  
  return (
          
          <div id="movie-list-section" className="section">
            <h2 className="content-title">Movie List</h2>
            <p className="content-desc">Danh sách các video, có thể sắp xếp thứ tự.</p>
            <label className="selectLabel">Chọn Movie List:
            <select id="select-movie-list"
              value={selectedML}
              onChange={(e)=>setSelectedML(e.target.value)}
              >
              <option value="">New</option>
                {movieListOptions.length > 0 ?(
                
                movieListOptions.map((mLOption) =>(
                <option key={mLOption}
                  value={mLOption}>{mLOption}
                  </option>))
              ): ""};
            </select>
            <button id="load-movie-list" type="button" onClick={handleLoadML}>Tải Movie List</button>
            </label>
            <form id="new-movie-list-form" ref={formRef} onSubmit={handleSubmit}>
              <label>Tên Movie List:
              <input
                type="text"
                name="listName"
                placeholder="Nhập tên danh sách Movie"
                required
                ref={titleRef}
              /></label>

              <div id="movies-container">
                <h3 className="movie-list-items">Movie List:</h3>
                <label className="selectLabel"
                  >Chọn video từ danh sách:
                <select id="select-existing-video"
                  value={selectedVideo}
                  onChange={(e)=>setSelectedVideo(e.target.value)}
                  >
                  <option value="">--Chọn video--</option>
                  {videoOptions.length >0 ?(
                  videoOptions.map((videoOption) =>(
                  <option key={videoOption} 
                    value={videoOption}>
                      {videoOption}</option> 
                  ))
                  ) : (<option value="">Không có video nào</option>)};
                </select>
                <button type="button" onClick={handleAddVideo}>Thêm Movie</button>
                  </label>
                <table >
                  <thead>
                    <tr>
                      <th>Video ID</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody >
                    {videoList.map((video,index)=>(
                    <tr key={index}>
                      <td>{video}</td>
                        <td>
                        <button type="button" onClick={() => handleRemoveVideo(video)}>
                          Xóa
                          </button>
                        </td>
                      </tr> ))}
                  </tbody>
                </table>
              </div>

              <button type="submit" id="save-movieList">Lưu Movie List</button>
            </form>
          </div>
  );
};

export default MovieList;
