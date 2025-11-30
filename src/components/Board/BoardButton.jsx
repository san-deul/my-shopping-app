import React from "react";
import { useNavigate } from "react-router-dom";
import "./BoardButton.css"; // 버튼 스타일 분리

export default function BoardButton({ 
  type = "list",   // 기본값: 목록버튼
  to = "",          // 이동할 주소 (없으면 자동 설정)
  onClick,          // 클릭 이벤트 (선택적)
  boardType = "notice" // notice | review 구분 가능
}) {
  const navigate = useNavigate();

  const labels = {
    list: "목록",
    write: "글쓰기",
    edit: "수정",
    delete: "삭제",
    submit: "등록",
  };

  const defaultRoutes = {
    list: `/${boardType}`,
    write: `/${boardType}/write`,
    edit: `/${boardType}/edit`,
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(to || defaultRoutes[type] || `/${boardType}`);
    }
  };

  return (
    <button
      type={type === "submit" ? "submit" : "button"}
      className={`board-btn board-btn-${type}`}
      onClick={type === "submit" ? undefined : handleClick}
    >
      {labels[type] || "버튼"}
    </button>
  );
}
