import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./Login.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",   // Supabase Auth는 이메일 기준 로그인
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      // Supabase 로그인
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert("로그인 실패: " + error.message);
        return;
      }

      // 로그인 성공
      console.log("로그인 유저:", data.user);
      localStorage.setItem("loginUser", JSON.stringify(data.user));
      alert(`${data.user.email}님, 로그인 되었습니다! 🎉`);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("서버 연결 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="login-container">
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-wrap">
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="input-wrap">
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="login-btn">
          LOG-IN
        </button>
      </form>
    </div>
  );
}
