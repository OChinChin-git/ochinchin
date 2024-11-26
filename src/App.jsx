// src/App.jsx
import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css'; // Import CSS chung

const App = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default App;
