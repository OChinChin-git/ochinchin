import React, { useState, useEffect } from 'react';
import "../../styles/AddContent.css";
import { loadOrder, syncOrderData, saveOrder } from "/src/components/AddContent.js";
import { useToast } from "/src/components/ToastContext";
import { useLoader } from "/src/components/LoaderContext";

const OrderContent = () => {
  const { showLoader, hideLoader } = useLoader();
  const { showToast } = useToast();
  const [contentList, setContentList] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null); // Lưu chỉ số của hàng đang kéo

  const handleLoadOrder = async () => {
    try {
      const data = await loadOrder();
      if (data) {
        setContentList(data);
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        showLoader("Đang load bảng, chờ chút");
        await syncOrderData();
        await handleLoadOrder();
      } catch (error) {
        alert(error);
      } finally {
        hideLoader();
      }
    })();
  }, []);

  // Hàm cập nhật lại thứ tự của contentList khi thay đổi vị trí hàng
  const updateOrder = (newIndex) => {
    const newContentList = [...contentList];
    const [removedItem] = newContentList.splice(draggedIndex, 1); // Lấy item bị di chuyển
    newContentList.splice(newIndex, 0, removedItem); // Chèn lại item vào vị trí mới
    setContentList(newContentList); // Cập nhật lại state
    setDraggedIndex(null); // Reset draggedIndex sau khi di chuyển xong
  };

  // Hàm xử lý sự kiện khi nhấn vào hàng
  const rowClick = (event, index) => {
    if (draggedIndex === null) {
      setDraggedIndex(index); // Lưu lại chỉ số hàng đang kéo
    } else if (draggedIndex !== index) {
      updateOrder(index); // Cập nhật thứ tự mảng khi di chuyển hàng
    }
  };

  // Hàm lưu thứ tự của contentList
  const handleSaveOrder = async () => {
    try {
      showLoader("Đang lưu");
      const data = contentList;
      alert(JSON.stringify(contentList, null, 2)); // Dễ dàng đọc, thụt lề 2 khoảng trắng
      await saveOrder(data);
      showToast("Lưu thành công");
    } catch (error) {
      alert(error);
    } finally {
      hideLoader();
    }
  };

  return (
    <div>
      <h2 className="content-title">Order Content</h2>
      <p className="content-desc">Sắp xếp thứ tự hiển thị trên trang chính.</p>

      <table>
        <thead>
          <tr className="is-hoverable">
            <th>Content</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {contentList.map((item, index) => (
            <tr
              className={`is-hoverable ${draggedIndex === index ? 'dragging' : ''}`} // Thêm class dragging khi hàng đang được kéo
              key={index}
              onClick={(event) => rowClick(event, index)} // Truyền index vào hàm rowClick
              style={{
                opacity: draggedIndex === index ? 0.5 : 1, // Làm mờ hàng đang kéo
              }}
            >
              <td>{item.type}</td>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Nút để lưu thứ tự */}
      <button className="save-content-button" onClick={handleSaveOrder}>
        Lưu thứ tự content
      </button>
    </div>
  );
};

export default OrderContent;
