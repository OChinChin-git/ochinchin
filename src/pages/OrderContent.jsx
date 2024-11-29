import React, { useState } from 'react';
import "../styles/AddContent.css";
const OrderContent = () => {

  return (
    <div>
      <h2 className="content-title">Order Content</h2>
      <p className="content-desc">Sắp xếp thứ tự hiển thị trên trang chính.</p>


        <table id="order-table">
          <thead>
            <tr>
              <th>Content</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody id="order-table-body">
            {/* Dữ liệu sẽ được thêm vào ở đây */}
          </tbody>
        </table>
      

      {/* Nút để lưu thứ tự */}
      
      <button id="save-order-btn" className="save-content-button"> Lưu thứ tự content
      </button>
    </div>
  );
};

export default OrderContent;
