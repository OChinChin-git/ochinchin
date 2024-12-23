import React, { useState, useRef, useEffect } from "react";
import { useLoader } from "../components/LoaderContext";
import { useToast } from "../components/ToastContext";
import { useDialog } from "../components/DialogContext";
import "../styles/Quest.css";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  onSnapshot,
  Timestamp,
  deleteDoc,
  FieldValue,
  serverTimestamp,
  query,
  where,
  orderBy,
  startAfter,
  limit,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import Navbar from "../components/Navbar";
const db = getFirestore();

const coinToClaim = async (
  coin,
  showLoader,
  hideLoader,
  showToast,
  navbarRef,
  abc
) => {
  try {
    if (coin < 100) return;
    showLoader("đang lưu");
    const userId = localStorage.getItem("loggedInUserId");
    if (!userId) {
      hideLoader();
      showToast("Đăng nhập để nhận xu nhé!");
      return;
    }
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) return;
    const fsCoin = docSnap.data().coin ? docSnap.data().coin : 0;
    await updateDoc(userRef, { coin: Number(fsCoin + Number(coin)) });
    showToast("Nhận thành công ", coin, " xu!");
    if(abc){
    const localCoin = localStorage.getItem("coin");
    localStorage.setItem("coin", Number(localCoin - coin));
    }
    hideLoader();
    if (navbarRef.current) {
      navbarRef.current.userProfile(); // Gọi hàm incrementCoin từ Navbar
    }
  } catch (error) {
    console.log(error);
  }
};
const Quest = ({ navbarRef }) => {
  const [totalCoin, setTotalCoin] = useState(0);
  const [progessDeg, setProgessDeg] = useState(0);
  const { showLoader, hideLoader } = useLoader(); // Use loader context
  const { showToast } = useToast();
  const { showPrompt } = useDialog();

  useEffect(() => {
    const interval = setInterval(() => {
      const coin = localStorage.getItem("coin");
      setTotalCoin(coin);
      setProgessDeg((coin / 100) * 360);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: "10px" }}>
      <h3 style={{ marginLeft: "20px" }}> Nhiệm vụ nhận xu</h3>
      <div
        style={{
          color: "white",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontSize: "12px",
            gap: "10px",
          }}
        >
          <span>Nhận xu mỗi giây</span>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: `conic-gradient(gold ${progessDeg}deg,#000000 0deg)`,
            }}
            onClick={() => {
              if (totalCoin < 100) return;
              coinToClaim(
                totalCoin,
                showLoader,
                hideLoader,
                showToast,
                navbarRef,
                true
              );
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                border: "1px solid white",
                display: "flex",
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#000000",
              }}
              min="0"
              max="50"
              value={totalCoin}
            >
              <div
                style={{
                  color: "gold",
                  fontSize: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "2px",
                }}
              >
                <div>
                  <i className="fab fa-bitcoin"></i> {totalCoin}
                </div>
                <div style={{ fontSize: "8px" }}>
                  {totalCoin > 100 ? "Click để nhận xu!" : "Chưa đủ 100 xu.."}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "6px" }}>
          <div className="quest-page-container">
            <div>
              <i
                className="fas fa-music page-icon"
                style={{
                  fontSize: "20px",
                  marginLeft: "10px",
                }}
              ></i>
              <p style={{ fontSize: "16px" }}>Ghé trang 'edm'</p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                fontSize: "14px",
              }}
            >
              <span style={{ marginLeft: "5px" }}>
                * Bạn có thể thử truy cập trang edm sử dụng url youtube để
                thêmmới 1 bài hát.
              </span>
              <span style={{ marginLeft: "5px" }}>
                * Có thể điều chỉnh danh sách theo sở thích, dùng manager list.
              </span>
            </div>
            <div
              onClick={() => {
                coinToClaim(
                1000,
                showLoader,
                hideLoader,
                showToast,
                navbarRef,
                false
              );
                window.open(
                  "//chillsite.web.app/edm",
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              className="quest-page-button"
            >
              <span>Đến ngay</span>
              <span>+1000</span>
              <i
                className="fab fa-bitcoin"
                style={{ color: "gold", fontSize: "14px" }}
              ></i>
            </div>
          </div>
          <div className="quest-page-container">
            <div>
              <i
                className="fas fa-door-open page-icon"
                style={{
                  fontSize: "20px",
                  marginLeft: "10px",
                }}
              ></i>
              <p style={{ fontSize: "16px" }}>Ghé trang "phòng"</p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                fontSize: "14px",
              }}
            >
              <span style={{ marginLeft: "5px" }}>
                * Chức năng chat, xem số người theo thời gian thực.
              </span>
              <span style={{ marginLeft: "5px" }}>
                * Chức năng mật khẩu phòng.
              </span>
              <span style={{ marginLeft: "5px" }}>
                * Chức năng host (chủ phòng):
              </span>
              <span style={{ marginLeft: "10px" }}>
                - Có thể thay đổi host, mật khẩu, video...
              </span>
              <span style={{ marginLeft: "10px" }}>
                - Nếu là video từ URL YouTube, có thể đồng bộ giữa các thành
                viên
              </span>
            </div>

            <div
              onClick={() => {
                coinToClaim(
                1000,
                showLoader,
                hideLoader,
                showToast,
                navbarRef,
                false
              );
                window.open(
                  "//chillsite.web.app/room",
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              className="quest-page-button"
            >
              <span>Đến ngay</span>
              <span>+1000</span>
              <i
                className="fab fa-bitcoin"
                style={{ color: "gold", fontSize: "14px" }}
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quest;
