// src/pages/CreateAdmin.jsx
import { supabase } from "../lib/supabase";

export default function CreateAdmin() {
  const handleCreateAdmin = async () => {
    // 1️⃣ Auth 계정 생성
    const { data, error } = await supabase.auth.signUp({
      email: "admin@example.com",
      password: "123456",
    });

    if (error) {
      alert(`❌ Auth 계정 생성 실패: ${error.message}`);
      return;
    }

    if (data.user) {
      // 2️⃣ member 테이블에 추가 정보 등록
      const { error: insertError } = await supabase.from("member").insert({
        id: data.user.id,
        name: "관리자",
        email: data.user.email,
        level: 10,
      });

      if (insertError) alert(`❌ member 등록 실패: ${insertError.message}`);
      else alert("✅ 관리자 계정이 성공적으로 생성되었습니다!");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>관리자 계정 생성</h2>
      <button
        onClick={handleCreateAdmin}
        style={{
          padding: "0.7rem 1.5rem",
          background: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        관리자 계정 생성
      </button>
    </div>
  );
}
