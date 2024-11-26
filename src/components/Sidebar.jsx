// src/components/Sidebar.jsx
import React from 'react';
import './Sidebar.css'; // Import CSS cho Sidebar

const Sidebar = () => {
  return (
    <div className="sidebar">
      <i className="left-menu-icon fas fa-search" data-tooltip="Search"></i>
      <i className="left-menu-icon fas fa-home" data-tooltip="Home"></i>
      <i className="left-menu-icon fas fa-music" data-tooltip="Edm"></i>
      <i className="left-menu-icon fas fa-upload" data-tooltip="Upload files"></i>
      <i className="left-menu-icon fas fa-file" data-tooltip="Data"></i>
      <i className="left-menu-icon fas fa-film" data-tooltip="Video"></i>
    </div>
  );
};

export default Sidebar;
