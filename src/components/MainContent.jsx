import React, { Suspense, lazy } from 'react';
import { Route, Routes } from "react-router-dom";
import { LoaderProvider } from './LoaderContext'; 
import { ToastProvider } from './ToastContext';
const Edm = lazy(() => import('../pages/Edm'));
const Content = lazy(() => import('../pages/AddContent'));
const Data = lazy(() => import('../pages/Data'));
const Kimochi = lazy(() => import('../pages/Kimochi'));
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
import "../styles/MainContent.css";
import '../styles/Button.css';
const MainContent = () => {
  return (
    <div className="container">
      <Suspense fallback={<div>Loading...</div>}>
      <LoaderProvider> 
        <ToastProvider>
          <div className="content-container">
            <Routes>
              <Route path="/edm" element={<Edm />} />
              <Route path="/content" element={<Content />} />
              <Route path="/data" element={<Data />} />
              <Route path="/kimochi" element={<Kimochi />} />
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </ToastProvider>
      </LoaderProvider>
        </Suspense>
    </div>
  );
};

export default MainContent;
