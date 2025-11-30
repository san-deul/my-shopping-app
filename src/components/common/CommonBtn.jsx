// src/components/common/CommonBtn.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./CommonBtn.css";

export default function CommonBtn({
  label,
  type = "default", // default | write | edit | delete
  to, // 링크 이동용 (옵션)
  onClick,
  disabled = false,
  style = {},
   buttonType = "button", // 추가: HTML button type 속성
}) {
  const className = `common-btn common-btn-${type}`;

  // Link 버튼
  if (to) {
    return (
      <Link to={to} className={className} style={style}>
        {label}
      </Link>
    );
  }

  // 일반 버튼
  return (
    <button
     type={buttonType}  
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {label}
    </button>
  );
}
