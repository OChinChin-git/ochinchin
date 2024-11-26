// src/components/MainContent.jsx
import React from 'react';
import './MainContent.css'; // Import CSS cho MainContent

const MainContent = () => {
  return (
    <div className="container">
      <div className="content-container">
        <h2>Main Content</h2>
        <p>Content will be inserted here.</p>
      </div>
      <div className="loader-container">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <span className="loader-text animated1"></span>
      </div>
    </div>
  );
};

export default MainContent;
