// src/App.jsx
import React, { useRef } from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Import Router
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import "./App.css"; // Import CSS chung
import "./script/App.js";
import "./script/AntiDevTools.js";
import { LoaderProvider } from "/src/components/LoaderContext";
import { ToastProvider } from "/src/components/ToastContext";
import { DialogProvider } from "/src/components/DialogContext";
const App = () => {
   const navbarRef = useRef();
  return (
    <Router>
      <DialogProvider>
        <ToastProvider>
          <LoaderProvider>
            <div className="app-container">
              <Navbar ref={navbarRef}/>
              <Sidebar />
              <MainContent navbarRef={navbarRef}/>
            </div>
          </LoaderProvider>
        </ToastProvider>
      </DialogProvider>
    </Router>
  );
};

export default App;
