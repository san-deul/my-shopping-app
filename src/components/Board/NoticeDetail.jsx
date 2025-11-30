import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; // 경로 맞게 수정
import "./Notice.css";
import BoardButton from "./BoardButton";

export default function NoticeDetail() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const { data, error } = await supabase
          .from("notices")
          .select("*")
          .eq("id", id)
          .single(); // 단일 데이터 반환

        if (error) throw error;

        setNotice(data);
      } catch (err) {
        console.error("공지사항 상세 불러오기 오류:", err.message);
      }
    };

    fetchNotice();
  }, [id]);

  if (!notice) return <p>공지사항을 불러오는 중입니다...</p>;

  return (
    <div className="section notice_detail">
      <div className="section_in">
        <table className="notice_view_table">
          <tbody>
            <tr>
              <th className="head">제목</th>
              <td>{notice.title}</td>
            </tr>
            <tr>
              <th className="head">작성일</th>
              <td>{notice.date}</td>
            </tr>
            <tr>
              <th className="head">글쓴이</th>
              <td>{notice.userId || "관리자"}</td>
            </tr>
          </tbody>
        </table>

        <div className="notice_content">
          {Array.isArray(notice.img) && notice.img.length > 0 && (
            <div className="notice_image_wrap">
              {notice.img.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${notice.title} 이미지 ${index + 1}`}
                  className="notice_image"
                />
              ))}
            </div>
          )}
          <div className="notice_text">{notice.content}</div>
        </div>

        <div className="btn_area">
          <BoardButton type="list" boardType="notice" />
        </div>
      </div>
    </div>
  );
}
