import React, { createContext, useState, useContext } from "react";
import Loader from "./Loader"; // Import Loader component

// Tạo context để quản lý trạng thái loader
const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false); // Trạng thái hiển thị loader
  const [message, setMessage] = useState(""); // Thông điệp cho loader

  // Hiển thị loader với thông điệp
  const showLoader = (msg) => {
    setMessage(msg); // Cập nhật thông điệp
    setIsVisible(true); // Hiển thị loader
  };

  // Ẩn loader
  const hideLoader = (msg,delay) => {
    setMessage(msg);
    setTimeout(() =>{
               setIsVisible(false);
},delay);
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      <Loader isVisible={isVisible} message={message} /> {/* Hiển thị Loader nếu isVisible = true */}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);

