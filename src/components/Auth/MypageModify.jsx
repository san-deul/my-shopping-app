import { useState, useEffect } from "react";
import axios from "axios";
import "../Auth/Join.css"; // 기존 Join 스타일 그대로 사용
import { useDaumPostcodePopup } from "react-daum-postcode";

export default function MypageModify() {
  const [form, setForm] = useState({
    id: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    name: "",
    email: "",
    phone: "",
    zipcode: "",
    basic_address: "",
    detail_address: "",
  });

  const API_URL = "http://localhost:5000/member";
  const open = useDaumPostcodePopup();

  /** ✅ 기존 회원정보 불러오기 (예시용) */
  useEffect(() => {
    // 실제로는 로그인된 유저의 ID를 가져와야 함
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_URL}/1`); // 예: /member/1
        const data = res.data;
        setForm({
          id: data.id || "",
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          zipcode: data.address?.zipcode || "",
          basic_address: data.address?.basic_address || "",
          detail_address: data.address?.detail_address || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("회원정보 로드 오류:", error);
      }
    };

    fetchUserData();
  }, []);

  /** ✅ 입력값 변경 */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      const noKorean = value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, "");
      setForm((prev) => ({ ...prev, [name]: noKorean }));
      return;
    }

    if (name === "phone") {
      let numbersOnly = value.replace(/[^0-9]/g, "");
      if (numbersOnly.length < 4) {
        numbersOnly = numbersOnly;
      } else if (numbersOnly.length < 8) {
        numbersOnly = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
      } else {
        numbersOnly = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(
          3,
          7
        )}-${numbersOnly.slice(7, 11)}`;
      }
      setForm((prev) => ({ ...prev, [name]: numbersOnly }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ 정규식 검증 */
  const validatePassword = (pw) => /^(?=.*[0-9]).{6,}$/.test(pw);
  const validateEmail = (email) => {
    if (!email) return true;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };
  const validatePhone = (phone) => /^01[0-9]-\d{3,4}-\d{4}$/.test(phone);

  /** ✅ 주소검색 */
  const handlePostcodeComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") extraAddress += data.bname;
      if (data.buildingName !== "")
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
    }

    if (extraAddress !== "") fullAddress += ` (${extraAddress})`;

    setForm((prev) => ({
      ...prev,
      zipcode: data.zonecode,
      basic_address: fullAddress,
      detail_address: "",
    }));
  };

  const handleOpenPostcode = () => {
    open({ onComplete: handlePostcodeComplete });
  };

  /** ✅ 수정 제출 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword && !validatePassword(form.newPassword))
      return alert("비밀번호는 숫자를 포함해 6자 이상이어야 합니다.");
    if (form.newPassword !== form.confirmPassword)
      return alert("새 비밀번호가 일치하지 않습니다.");
    if (!validatePhone(form.phone))
      return alert("휴대폰번호 형식이 올바르지 않습니다.");
    if (!validateEmail(form.email))
      return alert("이메일 형식이 올바르지 않습니다.");

    const updatedData = {
      ...form,
      password: form.newPassword ? form.newPassword : form.currentPassword,
      address: {
        zipcode: form.zipcode,
        basic_address: form.basic_address,
        detail_address: form.detail_address,
      },
    };

    try {
      await axios.put(`${API_URL}/1`, updatedData); // 실제 유저 ID에 맞게 수정
      alert("✅ 회원정보가 수정되었습니다!");
    } catch (error) {
      console.error("정보수정 오류:", error);
      alert("정보수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <form className="join-form" onSubmit={handleSubmit}>
      {/* 아이디 */}
      <div className="form-group">
        <label htmlFor="id">아이디</label>
        <input
          type="text"
          id="id"
          name="id"
          value={form.id}
          disabled
          className="disabled"
        />
      </div>

      {/* 비밀번호 */}
      <div className="form-group">
        <label htmlFor="currentPassword">현재 비밀번호</label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          placeholder="현재 비밀번호 입력"
        />
      </div>

      <div className="form-group">
        <label htmlFor="newPassword">새 비밀번호</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="새 비밀번호 (변경 시)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">새 비밀번호 확인</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="새 비밀번호 재입력"
        />
      </div>

      {/* 이름 */}
      <div className="form-group">
        <label htmlFor="name">이름</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      {/* 이메일 */}
      <div className="form-group">
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@domain.com"
        />
      </div>

      {/* 휴대폰 */}
      <div className="form-group">
        <label htmlFor="phone">휴대폰번호</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="010-1234-5678"
        />
      </div>

      {/* 주소 */}
      <div className="form-group">
        <label htmlFor="address">주소</label>
        <div className="address-wrap">
          <input
            type="text"
            placeholder="우편번호"
            name="zipcode"
            value={form.zipcode}
            readOnly
          />
          <button
            type="button"
            className="btn-small"
            onClick={handleOpenPostcode}
          >
            주소검색
          </button>
        </div>
        <input
          type="text"
          placeholder="기본주소"
          name="basic_address"
          value={form.basic_address}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="상세주소"
          name="detail_address"
          value={form.detail_address}
          onChange={handleChange}
        />
      </div>

      {/* 버튼 */}
      <div className="join-btn-wrap">
        <button type="button" className="btn-cancel" onClick={handleCancel}>
          취소
        </button>
        <button type="submit" className="btn-submit">
          정보수정
        </button>
      </div>
    </form>
  );
}
