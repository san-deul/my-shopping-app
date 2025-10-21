import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Notice.css";

export default function NoticeWrite() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    signal: false, // 중요공지 여부
    userId: "관리자",
    content: "",
    files: [], // 파일 배열
    date: new Date().toISOString().split("T")[0],
  });

  // 이미지 미리보기 배열
  const [previews, setPreviews] = useState([]);

  /** ✅ 제목 입력 */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /** ✅ 중요 체크박스 */
  const handleSignalChange = (e) => {
    setFormData({ ...formData, signal: e.target.checked });
  };

  /** ✅ 파일 추가 (최대 5개) */
  const handleFileChange = (e, index) => {
    const newFiles = [...formData.files];
    const file = e.target.files[0];
    if (file) {
      // 용량 체크 (10MB 제한)
      if (file.size > 10 * 1024 * 1024) {
        alert("첨부파일의 최대 크기는 10MB입니다.");
        return;
      }

      newFiles[index] = file;
      setFormData({ ...formData, files: newFiles });

      // 미리보기
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
      alert("더 이상 파일을 추가할 수 없습니다. (최대 5개)");
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
    const { title, content, files } = formData;

    if (!title) {
      alert("제목은 필수입니다.");
      return;
    }
    if (title.length > 30) {
      alert("제목의 글자수는 30자 이내로 설정해주세요.");
      return;
    }

    // multipart/form-data 전송
    const data = new FormData();
    data.append("title", formData.title);
    data.append("userId", formData.userId);
    data.append("content", formData.content);
    data.append("signal", formData.signal ? 1 : 0);
    data.append("date", formData.date);
    files.forEach((file) => {
      if (file) data.append("files", file);
    });

    try {
      await axios.post("http://localhost:5000/notices", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("공지사항이 등록되었습니다.");
      navigate("/notice");
    } catch (err) {
      console.error(err);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="section notice_write">
      <div className="section_in">
        <div className="title">공지사항 작성</div>
        <form onSubmit={handleSubmit}>
          <table className="notice_view_table">
            <tbody>
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

              {/* 중요 체크 */}
              <tr>
                <th className="head">중요</th>
                <td>
                  <label className="chk_label">
                    <input
                      type="checkbox"
                      name="signal"
                      checked={formData.signal}
                      onChange={handleSignalChange}
                    />{" "}
                    중요한 공지사항일 시 체크해주세요.
                  </label>
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
                    placeholder="내용을 입력해주세요"
                    className="input_area"
                  ></textarea>
                </td>
              </tr>

              {/* 첨부파일 */}
              <tr>
                <th className="head">
                  파일첨부
                  <span
                    className="file_add_btn"
                    onClick={handleAddFileInput}
                  >
                    추가
                  </span>
                </th>
                <td>
                  <p className="file_notice">※ 첨부파일은 최대 5개까지 가능합니다.</p>
                  <div className="notice_inputs_area">
                    {formData.files.map((file, index) => (
                      <div className="notice_input_area" key={index}>
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
            <Link to="/notice" className="btn_list">
              목록
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
