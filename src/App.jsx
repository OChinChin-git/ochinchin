// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css'; // Import CSS chung

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Navbar và Sidebar luôn hiển thị */}
        <Navbar />
        <Sidebar />

        {/* Nội dung chính sẽ thay đổi theo từng route */}
        <MainContent />
      </div>
    </Router>
  );
};

export default App;
