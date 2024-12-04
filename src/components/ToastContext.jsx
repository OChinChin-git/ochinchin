import React, { createContext, useState, useEffect, useContext } from 'react';
import "../styles/Toast.css";

// Tạo context cho Toast
const ToastContext = createContext();

// Provider để quản lý và hiển thị toast
export const ToastProvider = ({ children }) => {
  const [toastList, setToastList] = useState([]);
  const [audioFiles, setAudioFiles] = useState(null);
// Tạo và tải các âm thanh trước khi vào trang
const preloadAudio = () => {
  const errorAudio = new Audio('https://us-tuna-sounds-files.voicemod.net/169b3fb2-8bab-46c3-a2a8-ef5d0f5c9ead-1659016299387.mp3');
  const successAudio = new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3');
  
  // Cài đặt các thuộc tính âm thanh như volume, playbackRate ngay khi tải
  errorAudio.volume = 0.7;
  errorAudio.playbackRate = 1.25;
  
  successAudio.volume = 0.45;
  successAudio.playbackRate = 1.25;
  
  // Trả về âm thanh đã tải sẵn
  return { errorAudio, successAudio };
};

  useEffect(() => {
    const loadedAudio = preloadAudio(); // Tải âm thanh
    setAudioFiles(loadedAudio);
  }, []);

  // Hàm hiển thị Toast
  const showToast = async (message, type = 'info') => {
    if (!audioFiles) return; // Đảm bảo rằng âm thanh đã được tải trước khi hiển thị Toast

    const toastId = new Date().getTime(); // Dùng timestamp làm id
    const newToast = { id: toastId, message, type };

    // Hiển thị Toast
    setToastList((prev) => [...prev, newToast]);

    // Nếu type là 'error', phát âm thanh lỗi
    if (type === 'error') {
      audioFiles.errorAudio.play(); // Phát âm thanh lỗi
    }

    // Nếu type là 'success', phát âm thanh thành công
    if (type === 'success') {
      audioFiles.successAudio.play(); // Phát âm thanh thành công
    }

    // Xóa toast sau 2 giây
    setTimeout(() => {
      setToastList((prev) => prev.filter(toast => toast.id !== toastId));
    }, 2000);
  };

  // Thêm icon tương ứng với loại thông báo
  const getIconForType = (type) => {
    switch (type) {
      case 'success':
        return '✅'; // Biểu tượng thành công
      case 'error':
        return '🆘'; // Biểu tượng lỗi
      case 'info':
        return '😎'; // Biểu tượng thông tin
      default:
        return '😎';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Hiển thị tất cả các toast */}
      <div className="toast-container">
        {toastList.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type} show`}>
  <span className="toast-icon">{getIconForType(toast.type)}</span>
  <span className="toast-message">{toast.message}</span>
</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook để sử dụng Toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
