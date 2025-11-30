import React, { useState } from "react";
import "./Notice.css";
import { Link } from "react-router-dom";
import Pagination from "../common/Pagination";
import BoardButton from "./BoardButton";
import useAuth from "../../hooks/useAuth"


export default function Notice({ lists = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(lists.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentLists = lists.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

    const { user, member, loading } = useAuth(); // ✅ level 바로 가져오기


 
  return (
    <div className="section notice">
      <div className="section_in">
        <table className="notice_table">
          <thead>
            <tr>
              <th >번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {currentLists.length > 0 ? (
              currentLists.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td className="title_cell">
                    <Link to={`/notice/${item.id}`}>{item.title}</Link>
                  </td>
                  <td>{item.user_id === "admin" ? "관리자" : item.user_id}</td>
                  <td>{item.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">등록된 공지사항이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ✅ 버튼 영역 */}
        {member?.level === 10 && (

          <div className="btn_area" style={{ textAlign: "right", marginTop: "20px" }}>
            <BoardButton type="write" boardType="notice" />
          </div>
        )}

        {/* ✅ 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
