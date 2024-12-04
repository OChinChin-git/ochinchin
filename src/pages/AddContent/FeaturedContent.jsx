// FeaturedContent.jsx
import React,{useState,useEffect,useRef}from 'react';
import "../../styles/AddContent.css";
import {loadOption,saveDoc,processUrl,loadDoc} from "/src/components/AddContent.js";
import {useToast} from "/src/components/ToastContext"
import {useLoader} from "/src/components/LoaderContext";

const FeaturedContent = () => {
  const [options, setOptions] = useState([]); // State để lưu các option
  const [selectedContent, setSelectedContent] = useState("");
  const [videoOptions,setVideoOptions] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const {showLoader,hideLoader} = useLoader();
  const {showToast} = useToast();
  const formRef = useRef();
  const titleRef =useRef();
  const descRef = useRef();
  const urlVideoRef = useRef();
  const urlFeatureRef = useRef();
  const urlBackgroundRef = useRef();
  const [isSubmit,setIsSubmit] = useState(false);

    const fetchOptions = async (type) => {
      try {
        const data = await loadOption(type); 
        if(type==="feature"){
        setOptions(data);
          return
        }
        if(type==="videos"){
          setVideoOptions(data);
          return
        };
      } catch (error) {
        alert("Lỗi khi tải options:", error);
      }
    };
  
  useEffect(() => {
    fetchOptions("feature");
    fetchOptions("videos");
  }, []);
  useEffect(()=>{
    if(isSubmit==true){
    fetchOptions("feature");
    setIsSubmit(false);
    }

  },[isSubmit]);
  useEffect(( ) =>{
    if(isSubmit){
      fetchOptions("feature");
    }
  },[isSubmit])
  const handleSubmit = async() =>{
    event.preventDefault();
    const title = titleRef.current.value;
    const desc =descRef.current.value;
    const video = urlVideoRef.current.value;
    const background = urlBackgroundRef.current.value;
    const feature = urlFeatureRef.current.value;
    const pBackground = processUrl(background);
    const pFeature = processUrl(feature);
    const data = {
      title:title,
      featuredDesc:desc,
      featuredImgUrl:pFeature,
      videoUrl:video,
      backgroundUrl:pBackground
    }
    showLoader("Đang lưu: " +title);
    try{
      const result = await saveDoc("feature",title,data);
      if(result === 'canceled'){
        showToast("Đã hủy");
        return
      }
      showToast("Lưu thành công!","success");
      setIsSubmit(true);
      formRef.current.reset();
    }catch(error){
      alert(error);
    }finally{
      hideLoader();
    }
   
  }
  const handleLoadFeature = async() =>{
    if(selectedContent===""){
      const isConfirm =confirm("Chưa có featured content nào được chọn,làm mới các ô")
      if(!isConfirm){
        showToast("Đã hủy làm mới");
        return
      }
      formRef.current.reset();
      showToast("Đã làm trống")
    }else{
      try{
        showLoader("Đang load " +selectedContent)
        const data = await loadDoc("feature",selectedContent);
        if(data){
          titleRef.current.value = data.title;
          descRef.current.value = data.featuredDesc;
          urlVideoRef.current.value = data.videoUrl;
          urlFeatureRef.current.value = data.featuredImgUrl;
          urlBackgroundRef.current.value = data.backgroundUrl;
        }
        showToast("Load thành công");
      }catch(error){
        alert(error);
      }finally{
        hideLoader();
      }
    }
  }
  useEffect(()=>{
    const handleLoadVideo =async()=>{
      if(selectedVideo===""){
        return
      }
      try{
        showLoader("Đang load thông tin video: "+selectedVideo);
        const data = await loadDoc("videos",selectedVideo);
        if(data){
          urlVideoRef.current.value = data.videoUrl;
          urlFeatureRef.current.value = data.videoThumbnail;
          urlBackgroundRef.current.value = data.videoThumbnail;
          descRef.current.value = data.videoDescription;
        }
        showToast("Load thành công")
      }catch(error){
        alert(error)
      }finally{
        hideLoader();
      }
    }
    handleLoadVideo();
  },[selectedVideo])
  return (
          <div id="feature-section" className="section">
            <h2 className="content-title">Featured Movie</h2>
      <p className="content-desc">Những bộ phim nổi bật, đáng xem!</p>
            <label className="selectLabel">Chọn Featured Content:
            <select id="select-feature"
              value={selectedContent}
              onChange={(e)=>setSelectedContent(e.target.value)}
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
            <button id="load-feature" onClick={handleLoadFeature}>Tải Featured Content</button>
            </label>
            <form id="new-feature-form" ref={formRef} onSubmit={handleSubmit}>
              <label>Featured Content:
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Nhập Feature title"
                required
                ref={titleRef}
              />
              </label>

              <label className="selectLabel">Chọn video :
              <select id="video-dropdown" value={selectedVideo} onChange={(e) =>setSelectedVideo(e.target.value)}>
                <option value="">-- Chọn video --</option>
                {videoOptions.length >0 ?(
                videoOptions.map((videoOption) =>(
                <option value={videoOption} key={videoOption}> {videoOption}</option>))):(
                <option value="" key="">Không có video nào</option>)}
              </select>
              </label>
              <label>URL Video:
              <input
                type="text"
                name="featureVideoUrl"
                id="video-url"
                placeholder="Nhập URL video"
                required
                ref={urlVideoRef}
              />
              </label>
              <label>URL Background:
              <input
                type="text"
                name="backgroundUrl"
                id="backgroundUrl"
                placeholder="Nhập URL hình nền"
                required
                ref={urlBackgroundRef}
              />
                </label>
              <label>URL Feature:
              <input
                type="text"
                name="featuredImgUrl"
                id="featuredImgUrl"
                placeholder="Nhập URL Feature"
                required
                ref={urlFeatureRef}
              />
                </label>
              
              <label >Mô tả :
              <input
                type="text"
                name="featuredDesc"
                id="featuredDesc"
                placeholder="Nhập mô tả cho feature này"
                required
                ref={descRef}
              /></label>
                
              <button className="save-content-button" type="submit" id="save-feature">Lưu Feature</button>
            </form>
          </div>
  );
};

export default FeaturedContent;
