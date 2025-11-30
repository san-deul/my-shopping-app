import React from "react";
import { Link } from "react-router-dom";

export default function NoticeWriteForm({
  formData,
  setFormData,
  previews,
  setPreviews,
  onSubmit,
}) {
  // 제목, 내용 등 입력 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 파일 변경
  const handleFileChange = (e, index) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("첨부파일의 최대 크기는 10MB입니다.");
      return;
    }

    // formData.img 배열 복사하고 해당 인덱스에 파일 삽입
    const newFiles = [...(formData.img || [])];
    newFiles[index] = file;
    setFormData((prev) => ({ ...prev, img: newFiles }));

    // 미리보기
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...(previews || [])];
      newPreviews[index] = reader.result;
      setPreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  // 파일 input 추가
  const handleAddFileInput = () => {
    if ((formData.img || []).length >= 5) {
      alert("첨부파일은 최대 5개까지 가능합니다.");
      return;
    }
    setFormData((prev) => ({ ...prev, img: [...(prev.img || []), null] }));
    setPreviews((prev) => [...(prev || []), null]);
  };

  // 파일 삭제
  const handleRemoveFileInput = (index) => {
    const newFiles = [...(formData.img || [])];
    const newPreviews = [...(previews || [])];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFormData((prev) => ({ ...prev, img: newFiles }));
    setPreviews(newPreviews);
  };

  return (
    <form onSubmit={onSubmit}>
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
                placeholder="내용을 입력해주세요."
                className="input_area"
              ></textarea>
            </td>
          </tr>

          {/* 첨부파일 */}
          <tr>
            <th className="head">
              파일첨부
              <span className="file_add_btn" onClick={handleAddFileInput}>
                추가
              </span>
            </th>
            <td>
              <p className="file_notice">※ 첨부파일은 최대 5개까지 가능합니다.</p>
              <div className="notice_inputs_area">
                {(formData.img || []).map((img, index) => (
                  <div className="notice_input_area" key={index}>
                    <input
                      type="file"
                      className="input_file"
                      onChange={(e) => handleFileChange(e, index)}
                    />
                    {previews && previews[index] && (
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

                {/* img 배열이 비어있으면 기본으로 한개 입력 보여주기 */}
                {(formData.img || []).length === 0 && (
                  <div className="notice_input_area">
                    <input
                      type="file"
                      className="input_file"
                      onChange={(e) => handleFileChange(e, 0)}
                    />
                  </div>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 버튼영역 */}
      <div className="btn_area">
        <button type="submit" className="btn_submit">
          등록
        </button>
        <Link to="/notice" className="btn_list">
          목록
        </Link>
      </div>
    </form>
  );
}
