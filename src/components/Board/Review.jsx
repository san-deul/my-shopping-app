import React, { useState } from "react";
import "./Review.css";
import { Link } from "react-router-dom";
import Pagination from "../common/Pagination";
import BoardButton from "./BoardButton";
import useAuth from "../../hooks/useAuth";
import noimage from "../../../src/assets/images/noimage.jpg"



export default function Review({ lists = [] }) {
  // --- 상태 관리 ---
  const [selectedItem, setSelectedItem] = useState(null); // 팝업용
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // 페이지네이션용
  const itemsPerPage = 5;

  // --- 페이지네이션 계산 ---
  const totalPages = Math.ceil(lists.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentLists = lists.slice(indexOfFirst, indexOfLast);
  console.log('cccccc-->', currentLists)

  // --- 아이디 마스킹 ---
  const maskUserId = (user_id) => {
    if (user_id && user_id.length > 2) {
      const prefix = user_id.substring(0, 2);
      return prefix + "***";
    }
    return user_id || "";
  };

  // --- 모달 제어 ---
  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  // --- 페이지 변경 ---
  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const { user, member, loading } = useAuth(); // ✅ level 바로 가져오기

  console.log('member-->>', member)
  console.log('=->', currentLists)
  return (
    <div className="section">
      <div className="section_in">
        {member?.level === 1 && (
              <div className="btn_area" style={{ textAlign: "right", marginTop: "20px" }}>
                <BoardButton type="write" boardType="review" />
              </div>
            )}
        {lists.length > 0 ? (
          <>
            
            <ul className="board_lists">
              {currentLists.map((item) => (
                
                <li key={item.id} className="board_list">
                  <div className="list_img">
                    <Link to={`/item/${item.product_id}`}>
                      <img
                        src={item.product_img || noimage}
                        onError={(e) => e.target.src = noimage}
                        alt={item.name || "상품 이미지"}
                      />

                    </Link>
                  </div>

                  {/* ✅ 클릭 시 팝업 열림 */}
                  <div
                    className="list_con"
                    onClick={() => openModal(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <p className="list_name">{item.product_name}</p>
                    <p className="list_title">{item.title}</p>
                    <p className="list_content">{item.content}</p>

                  </div>

                  <div className="list_etc">
                    <p className="list_user">작성자: {maskUserId(item.user_id)}</p>
                    <p className="list_date">{item.date}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* ✅ 페이지네이션 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange} />
          </>
        ) : (
          
          <p>등록된 후기가 없습니다.</p>
        )}

        {/* ✅ 팝업 모달 */}
        {isModalOpen && selectedItem && (
          <div className="modal_overlay" onClick={closeModal}>
            <div
              className="modal_content"
              onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫히지 않게
            >
              <button className="modal_close" onClick={closeModal}>
                ✕
              </button>
              <div className="modal_body">
                <div className="modal_img">
                  
                  <img src={selectedItem.img || noimage } 
                      alt={selectedItem.title} 
                      onError={(e) => e.target.src = noimage}/>

                </div>

                <h3>{selectedItem.title}</h3>
                <p>상품명 {selectedItem.product_name}</p>
                <p>작성자: {maskUserId(selectedItem.user_id)}</p>
                <p className="modal_review">{selectedItem.content}</p>
                <p>작성일: {selectedItem.date}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
