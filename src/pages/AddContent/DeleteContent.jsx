import React, { useState,useEffect,useRef } from 'react';
import "../../styles/AddContent.css";
import {loadOption,deleteContent} from "/src/components/AddContent.js"
import {useToast} from "/src/components/ToastContext"
import {useLoader} from "/src/components/LoaderContext";

const DeleteContent = () => {
  const [isDeleteVisible, setIsDeleteVisible] = useState(false); // Kiểm tra xem phần xóa có hiển thị không
  const [selectedContentType, setSelectedContentType] = useState("feature"); 
  const [selectedDeleteContent, setSelectedDeleteContent] = useState();
  const [deleteOptions,setDeleteOptions] = useState([]);
  const passwordRef =useRef();
  const {showToast} =useToast();
  const {showLoader,hideLoader} =useLoader();

  const fetchDeleteContent = async() =>{
    let deleteContentOptions = "";
    if(selectedContentType === "feature"){
      deleteContentOptions = "feature"
    }else if(selectedContentType === "movieList"){
       deleteContentOptions = "movieList";
    }else {
      deleteContentOptions ="videos"
    }
      
      const data = await loadOption(deleteContentOptions);
    setDeleteOptions(data);
  }
  useEffect(() =>{
    fetchDeleteContent();
    
  },[selectedContentType]);
  // Hàm để toggle phần nhập mật khẩu
  const handleDeleteContentClick = () => {
    setIsDeleteVisible(!isDeleteVisible); // Chuyển trạng thái của phần xóa
  };

  // Hàm để toggle hiển thị phần mật khẩu
  const handlePasswordClick = async() => {
   if(passwordRef.current.value !=="ochinchin"){
     showToast("Sai mật khẩu");
   }
    try{
      const isConfirm = confirm("Chắc chắn xóa chứ?");
      if(!isConfirm){
        showToast("Đã hủy");
        return
      }
      showLoader("Đang xóa: " + selectedContentType + selectedDeleteContent);
      await deleteContent(selectedContentType,selectedDeleteContent);
      showToast("Xóa thành công","success");
       setIsDeleteVisible(!isDeleteVisible)
      fetchDeleteContent();
    }catch(error){
      alert(error)
    }finally{
      hideLoader();
    }
  };

  // Hàm để xử lý việc thay đổi loại nội dung khi người dùng chọn
  const handleContentTypeChange = (event) => {
    setSelectedContentType(event.target.value);
  };

  return (
    <div id="delete-container">
      {/* Phần chọn loại nội dung cần xóa */}
      <div>
        <label>Chọn loại nội dung cần xóa:
        <select 
          id="delete-content-type" 
          value={selectedContentType} 
          onChange={handleContentTypeChange}>
          <option value="feature">Feature</option>
          <option value="movieList">Movie List</option>
          <option value="videos">Video</option>
        </select>
          </label>
      </div>

      {/* Phần chọn nội dung cần xóa */}
      <div>
        <label>Chọn nội dung cần xóa:
        <select id="content-list" value={selectedDeleteContent} onChange={(e)=>setSelectedDeleteContent(e.target.value)}>
          <option value="">--Chọn nội dung cần xóa--</option>
          { deleteOptions.length >0 ?(
          deleteOptions.map((deleteOption) => (
          <option value={deleteOption} key={deleteOption}>
              {deleteOption} </option> ))) : (
          <option value="">Không có {selectedContentType} nào</option>)};
          
        </select>
          </label>
      </div>

      <button id="delete-content-btn" 
        onClick={handleDeleteContentClick} 
        className="save-content-button">
        Xóa nội dung
      </button>

      {/* Phần nhập mật khẩu xác nhận xóa */}
      {isDeleteVisible && (
        <div id="password-container">
          <label>Nhập mật khẩu:
          <input
            type="password"
            id="password"
            placeholder="Nhập mật khẩu để xác nhận xóa"
            ref={passwordRef}
           
          />
          </label>
          <button id="confirm-delete-btn" 
            onClick={handlePasswordClick}
            className="save-content-button">
            Xác nhận xóa
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteContent;
