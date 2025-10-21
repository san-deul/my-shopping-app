
import React from "react";
import { Link } from "react-router-dom";

export default function MyPageInfo({ user, member }) {
  return (
    <section className="mypage-header">
      <div className="mypage-info">
        <div className="mypage-profile">
          <h2>{member?.name || "회원"}님</h2>
          <p>ID: {user.email}</p>
          <p>회원등급: {member?.level || "일반회원"}</p>
        </div>
        <button className="mypage-edit-btn">
          <Link to="/mypage/modify">내 정보 변경</Link>
        </button>
      </div>
    </section>
  );
}
