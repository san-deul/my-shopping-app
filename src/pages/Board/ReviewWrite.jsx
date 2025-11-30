import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

import "../../components/Board/Review.css";
import ReviewWriteForm from "../../components/Board/ReviewWriteForm";
import ReviewModal from "../../components/Board/ReviewModal";
import { supabase } from "../../lib/supabase";

export default function ReviewWrite() {
  const navigate = useNavigate();
  const { user, member, loading } = useAuth();

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    title: "",
    userId: "",
    content: "",
    file: null,
    date: new Date().toISOString().split("T")[0],
  });

  // ✅ 로그인 정보 세팅
  useEffect(() => {
    if (!loading && user && member) {
      setFormData((prev) => ({ ...prev, userId: member.name }));
    }
  }, [user, member, loading]);

  // ✅ 상품 선택
  const handleSelectProduct = (productId, productName) => {
    setFormData((prev) => ({
      ...prev,
      productId,
      productName // ✅ 이름도 저장
    }));
    setShowOrderModal(false);
  };
  // ✅ 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { productId, title, content, userId, file } = formData;
    if (!productId) return alert("상품을 선택해주세요.");
    if (!title) return alert("제목을 입력해주세요.");
    if (!content) return alert("내용을 입력해주세요.");

    try {
      let imgUrl = null;

      if (file) {
        const fileName = `${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("review_img") // <- 스토리지 버킷 이름 (없다면 Supabase 콘솔에서 생성)
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("review_img")
          .getPublicUrl(uploadData.path);

        imgUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("reviews").insert([
        {
          product_id: productId,
          title,
          user_id: userId,
          content,
          date: formData.date,
          img: imgUrl, // 이미지 URL 저장
        },
      ]);

      if (error) throw error;

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
        {/* ✅ 폼을 별도 컴포넌트로 */}
        <ReviewWriteForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onOpenModal={() => setShowOrderModal(true)}
        />

        {showOrderModal && (
          <ReviewModal
            userId={user?.id}
            onSelect={handleSelectProduct}
            onClose={() => setShowOrderModal(false)}
          />
        )}
      </div>
    </div>
  );
}
