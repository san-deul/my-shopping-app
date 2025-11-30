import React from "react";
import { Link } from "react-router-dom";
import BoardButton from "./BoardButton";
import CommonBtn from "../common/CommonBtn";

export default function ReviewWriteForm({ formData, setFormData, onSubmit, onOpenModal }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("첨부파일의 최대 크기는 10MB입니다.");
      return;
    }
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
  };

  return (
    <form onSubmit={onSubmit}>
      <table className="review_view_table">
        <tbody>
          {/* 상품 선택 */}
          <tr>
            <th className="head">상품 선택</th>
            <td>
              <div className="product_select_area">
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  readOnly
                  placeholder="상품을 선택해주세요."
                  className="input_text"
                />
                <CommonBtn
                  label="주문내역 보기"
                  type="default"
                  onClick={onOpenModal}
                  buttonType="button"  
                />
              </div>
            </td>
          </tr>

          {/* 제목 */}
          <tr>
            <th className="head">제목</th>
            <td>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="제목을 입력해주세요."
                className="input_text"
              />
            </td>
          </tr>

          {/* 작성자 */}
          <tr>
            <th className="head">작성자</th>
            <td>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                readOnly
                className="input_text"
              />
            </td>
          </tr>

          {/* 내용 */}
          <tr>
            <th className="head">내용</th>
            <td>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="상품후기 내용을 입력해주세요."
                className="input_area"
              />
            </td>
          </tr>

          {/* 파일 첨부 */}
          <tr>
            <th className="head">사진첨부</th>
            <td>
              <div className="review_input_area">
                {!formData.file ? (
                  <input
                    type="file"
                    className="input_file"
                    onChange={handleFileChange}
                  />
                ) : (
                  <div className="file_info">
                    <span>{formData.file.name}</span>
                    <button
                      type="button"
                      className="del_btn"
                      onClick={handleRemoveFile}
                    >
                      ✕ 삭제
                    </button>
                  </div>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="btn_area">
        <BoardButton type="submit" boardType="review" />
        <BoardButton type="list" boardType="review" />

      </div>
    </form>
  );
}
