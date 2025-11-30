
import React from "react";
import { Link } from "react-router-dom";
import CommonBtn from "../common/CommonBtn";

export default function MyPageInfo({ user, member }) {
  return (
    <section className="mypage-header">
      <div className="mypage-info">
        <div className="mypage-profile">
          <p>{member?.name || "회원"} 님의 마이페이지입니다</p>
          <p>ID: {user.email}</p>
          <p>
            회원등급: {
              member?.level === 1
                ? "일반회원"
                : member?.level === 10
                  ? "관리자"
                  : "일반회원"  // 기본값
            }
          </p>
        </div>
        <CommonBtn
          label="내 정보 변경"
          type="edit"
          to="/mypage/modify"
        />

      </div>
    </section>
  );
}
