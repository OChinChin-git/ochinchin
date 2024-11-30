import React from "react";
import { Route, Routes } from "react-router-dom";
import { LoaderProvider } from './LoaderContext'; // Import LoaderProvider
import "../styles/MainContent.css"; // Import CSS cho trang
import Edm from "../pages/Edm";
import Content from "../pages/AddContent";
import Data from "../pages/Data";
import Kimochi from "../pages/Kimochi";
import Home from "../pages/Home";
import { ToastProvider } from './ToastContext';
const MainContent = () => {
  return (
    <div className="container">
      <LoaderProvider> {/* Bao bọc Routes với LoaderProvider */}
        <ToastProvider>
        <div className="content-container">
          <Routes>
            <Route path="/edm" element={<Edm />} />
            <Route path="/content" element={<Content />} />
            <Route path="/data" element={<Data />} />
            <Route path="/kimochi" element={<Kimochi />} />
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </div>
          </ToastProvider>
      </LoaderProvider>
    </div>
  );
};

export default MainContent;

