import React from "react";

const Menu = () => {
  return (
    <div className="menu-container">
      <ul className="menu-list">
        <li className="menu-list-item" id="home">
          Home
        </li>
        <li className="menu-list-item" id="edm">
          Edm
        </li>
        <li className="menu-list-item" id="content">
          Add Content
        </li>
        <li className="menu-list-item" id="data">
          Data
        </li>
        <li className="menu-list-item" id="kimochi">
          Kimochi
        </li>
      </ul>
    </div>
  );
};

export default Menu;
