import { useState } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const [isMember, setIsMember] = useState(true);
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ 입력값 유효성 검사
    if (!formData.userId.trim() || !formData.password.trim()) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      // 2️⃣ json-server로 아이디 조회 요청
      const res = await axios.get(`http://localhost:5000/member?id=${formData.userId}`);
      const user = res.data[0];

      // 3️⃣ 아이디 존재 여부 확인
      if (!user) {
        alert(
          "아이디(로그인 전화번호, 로그인 전용 아이디) 또는 비밀번호가 잘못 되었습니다. 아이디와 비밀번호를 정확히 입력해 주세요."
        );
        return;
      }

      // 4️⃣ 비밀번호 확인
      if (user.password !== formData.password) {
        alert(
          "아이디(로그인 전화번호, 로그인 전용 아이디) 또는 비밀번호가 잘못 되었습니다. 아이디와 비밀번호를 정확히 입력해 주세요."
        );
        return;
      }

      // 5️⃣ 로그인 성공
      alert(`${user.name}님, 로그인 되었습니다! 🎉`);

      // ✅ 이후 로직 (예: 로그인 상태 저장)
      localStorage.setItem("loginUser", JSON.stringify(user));
      navigate("/");
      // ✅ 페이지 이동 (필요시)
       //window.location.href = "/";
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("서버 연결 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>

      <div className="tab-wrap">
        <button
          className={`tab-btn ${isMember ? "active" : ""}`}
          onClick={() => setIsMember(true)}
        >
          회원
        </button>
        <button
          className={`tab-btn ${!isMember ? "active" : ""}`}
          onClick={() => setIsMember(false)}
        >
          비회원 주문내역
        </button>
      </div>

      {isMember && (
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-wrap">
            <input
              type="text"
              name="userId"
              placeholder="아이디"
              value={formData.userId}
              onChange={handleChange}
            />
            <span className="required">*</span>
          </div>
          <div className="input-wrap">
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
            />
            <span className="required">*</span>
          </div>
          <button type="submit" className="login-btn">
            LOG-IN
          </button>
        </form>
      )}

      <div className="login-links">
        <a href="#">아이디·비밀번호찾기</a>
        <span>|</span>
        <a href="#">회원가입</a>
      </div>
    </div>
  );
}
