import React from "react";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="ring"></div>
      <div className="ring"></div>
      <div className="ring"></div>
      <span className="loader-text animated1"></span>
    </div>
  );
};

export default Loader;
