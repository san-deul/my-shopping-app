// src/components/common/Spinner.jsx
import React from "react";
import "./Spinner.css"; // CSS로 회전 애니메이션

export default function Spinner() {
  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
    </div>
  );
}
