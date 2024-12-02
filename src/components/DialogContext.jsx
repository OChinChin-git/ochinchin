import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import '../styles/Dialog.css';

// Tạo Context
const DialogContext = createContext();

// Tạo Provider cho Context
export const DialogProvider = ({ children }) => {
  const [promptMessage, setPromptMessage] = useState({ show: false, value: '', defaultValue: '' });
  const inputRef = useRef(null); // Thêm ref cho input

  // Hàm hiển thị Prompt với 2 tham số: message và giá trị mặc định
  const showPrompt = (message, defaultValue = '') => {
    return new Promise((resolve) => {
      setPromptMessage({ show: true, message, resolve, value: defaultValue, defaultValue });
    });
  };

  // Hàm xử lý nhập vào trong Prompt
  const handlePromptSubmit = () => {
    setPromptMessage({ ...promptMessage, show: false });
    promptMessage.resolve(promptMessage.value);
  };

  // Hàm xử lý thay đổi giá trị trong Prompt
  const handlePromptChange = (e) => {
    setPromptMessage({ ...promptMessage, value: e.target.value });
  };

  // Dùng useEffect để tự động chọn toàn bộ văn bản khi Prompt hiển thị
  useEffect(() => {
    if (promptMessage.show && inputRef.current) {
      inputRef.current.select(); // Chọn tất cả văn bản trong input
    }
  }, [promptMessage.show]); // Chạy khi promptMessage.show thay đổi

  return (
    <DialogContext.Provider value={{ showPrompt }}>
      {children}

{promptMessage.show && (
  <div className="dialog">
    <div className="dialog-content">
      <p>{promptMessage.message}</p>
      <input
        type="text"
        ref={inputRef}
        value={promptMessage.value}
        onChange={handlePromptChange}
        placeholder="Nhập gì đó..."
      />
      <button onClick={handlePromptSubmit}>OK</button>
      <button onClick={() => setPromptMessage({ ...promptMessage, show: false })}>Hủy</button>
    </div>
  </div>
)}

    </DialogContext.Provider>
  );
};

// Custom hook để dễ sử dụng context
export const useDialog = () => useContext(DialogContext);
