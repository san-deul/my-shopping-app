import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Review.css";

export default function ReviewWrite() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productId: "",
    title: "",
    userId: "user01", // 로그인된 사용자 ID라 가정
    content: "",
    files: [],
    date: new Date().toISOString().split("T")[0],
  });

  const [previews, setPreviews] = useState([]);

  /** ✅ 입력 핸들러 */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /** ✅ 파일 추가 */
  const handleFileChange = (e, index) => {
    const newFiles = [...formData.files];
    const file = e.target.files[0];

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("첨부파일의 최대 크기는 10MB입니다.");
        return;
      }

      newFiles[index] = file;
      setFormData({ ...formData, files: newFiles });

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...previews];
        newPreviews[index] = reader.result;
        setPreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  /** ✅ 파일 input 추가 (최대 5개) */
  const handleAddFileInput = () => {
    if (formData.files.length >= 5) {
      alert("최대 5개의 파일만 등록할 수 있습니다.");
      return;
    }
    setFormData({ ...formData, files: [...formData.files, null] });
  };

  /** ✅ 파일 input 삭제 */
  const handleRemoveFileInput = (index) => {
    const newFiles = [...formData.files];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFormData({ ...formData, files: newFiles });
    setPreviews(newPreviews);
  };

  /** ✅ 등록 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, content, productId } = formData;

    if (!productId) {
      alert("상품 ID를 입력해주세요.");
      return;
    }
    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content) {
      alert("내용을 입력해주세요.");
      return;
    }

    const data = new FormData();
    data.append("productId", formData.productId);
    data.append("title", formData.title);
    data.append("userId", formData.userId);
    data.append("content", formData.content);
    data.append("date", formData.date);

    formData.files.forEach((file) => {
      if (file) data.append("files", file);
    });

    try {
      await axios.post("http://localhost:5000/reviews", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("상품후기가 등록되었습니다.");
      navigate("/review");
    } catch (err) {
      console.error(err);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="section review_write">
      <div className="section_in">
        <div className="title">상품후기 작성</div>

        <form onSubmit={handleSubmit}>
          <table className="review_view_table">
            <tbody>
              {/* 상품 ID */}
              <tr>
                <th className="head">상품 ID</th>
                <td>
                  <input
                    type="text"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    placeholder="상품 ID를 입력해주세요."
                    className="input_text"
                  />
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
                  ></textarea>
                </td>
              </tr>

              {/* 파일첨부 */}
              <tr>
                <th className="head">
                  사진첨부
                  <span className="file_add_btn" onClick={handleAddFileInput}>
                    추가
                  </span>
                </th>
                <td>
                  <p className="file_notice">※ 첨부파일은 최대 5개까지 가능합니다.</p>
                  <div className="review_inputs_area">
                    {formData.files.map((file, index) => (
                      <div className="review_input_area" key={index}>
                        <input
                          type="file"
                          className="input_file"
                          onChange={(e) => handleFileChange(e, index)}
                        />
                        {previews[index] && (
                          <img
                            src={previews[index]}
                            alt="preview"
                            className="preview_img"
                          />
                        )}
                        <span
                          className="del_btn"
                          onClick={() => handleRemoveFileInput(index)}
                        >
                          ✕
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="btn_area">
            <button type="submit" className="btn_submit">
              등록
            </button>
            <Link to="/review" className="btn_list">
              목록
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
