import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "../../components/Board/Notice.css";
import NoticeWriteForm from "../../components/Board/NoticeWriteForm";
import useAuth from "../../hooks/useAuth";

export default function NoticeWrite() {
  const navigate = useNavigate();
  const { user, member, loading } = useAuth();

  // ✅ 로그인 정보 세팅
  useEffect(() => {
    if (!loading && user && member) {
      setFormData((prev) => ({ ...prev, userId: member.name }));
    }
  }, [user, member, loading]);

  const [formData, setFormData] = useState({
    userId: "",
    title: "",
    content: "",
    img: [null], // 초기 input 하나 보이도록
    date: new Date().toISOString().split("T")[0],
  });

  const [previews, setPreviews] = useState([null]);

  // ✅ 등록 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userId, title, content, img } = formData;

    if (!title) return alert("제목을 입력해주세요.");
    if (title.length > 30) return alert("제목은 30자 이내로 입력해주세요.");

    try {
      // ✅ 파일 업로드 처리
      const uploadedUrls = [];
      const bucket = "shop_img"; // 버킷명 확인

      for (const file of (img || [])) {
        if (!file) continue;
        const fileName = `${Date.now()}_${file.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (uploadError) {
          console.error("uploadError:", uploadError);
          throw uploadError;
        }
        if (!uploadData || !uploadData.path) {
          console.warn("upload returned no path:", uploadData);
          throw new Error("Upload failed: no path returned");
        }

        // getPublicUrl 결과 구조가 버전에 따라 달라질 수 있으니 안전하게 처리
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(uploadData.path);

        const publicUrl =
          (publicUrlData && (publicUrlData.publicUrl || publicUrlData.public_url || publicUrlData.publicURL)) ||
          null;

        if (!publicUrl) {
          console.warn("public url not found, publicUrlData:", publicUrlData);
        }

        uploadedUrls.push(publicUrl || uploadData.path);
      }

      // ✅ DB insert
      const { error } = await supabase.from("notices").insert([
        {
          title,
          content,
          user_id: userId,
          date: formData.date,
          img: uploadedUrls, // 배열로 저장 (notices.img 컬럼이 json/array 타입이어야 함)
        },
      ]);

      if (error) {
        console.error("insert error:", error);
        throw error;
      }

      alert("공지사항이 등록되었습니다.");
      navigate("/notice");
    } catch (err) {
      console.error("등록 중 오류:", err);
      alert("등록 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
    }
  };

  return (
    <div className="section notice_write">
      <div className="section_in">
        <NoticeWriteForm
          formData={formData}
          setFormData={setFormData}
          previews={previews}
          setPreviews={setPreviews}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
