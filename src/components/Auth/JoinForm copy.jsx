import { useState } from "react";
import axios from "axios";
import "../Auth/Join.css";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { supabase } from "../../lib/supabase";

export default function JoinForm() {
  const [form, setForm] = useState({
    id: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    phone: "",
    zipcode: "",
    basic_address: "",
    detail_address: "",
    extra_info: "",
  });

  const [isIdChecked, setIsIdChecked] = useState(false);

  const API_URL = "http://localhost:5000/member";
  const open = useDaumPostcodePopup(); // ✅ 팝업 API 훅

  /** ✅ 입력값 변경 처리 */
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

  /** ✅ 정규식 검증 함수들 */
  const validateId = (id) => /^[A-Za-z0-9]{4,}$/.test(id);
  const validatePassword = (password) => /^(?=.*[0-9]).{6,}$/.test(password);
  const validateEmail = (email) => {
    if (!email) return true;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };
  const validatePhone = (phone) => /^01[0-9]-\d{3,4}-\d{4}$/.test(phone);

  /** ✅ 아이디 중복체크 */
const handleIdCheck = async () => {
  if (!validateId(form.id)) {
    alert("아이디는 영어 또는 숫자로 4자 이상이어야 합니다.");
    return;
  }

  const { data, error } = await supabase
    .from("member")
    .select("id")
    .eq("id", form.id);

  if (error) {
    console.error("중복체크 오류:", error);
    alert("중복체크 중 오류가 발생했습니다.");
    return;
  }

  if (data.length > 0) {
    alert("⚠️ 이미 사용 중인 아이디입니다.");
    setIsIdChecked(false);
  } else {
    alert("✅ 사용 가능한 아이디입니다!");
    setIsIdChecked(true);
  }
};

  /** ✅ 주소 검색 완료 시 콜백 */
  const handlePostcodeComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") extraAddress += data.bname;
      if (data.buildingName !== "")
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
    }
    if (extraAddress !== "") {
      fullAddress += ` (${extraAddress})`; // ✅ 참고항목을 괄호로 붙이기
    }

    setForm((prev) => ({
      ...prev,
      zipcode: data.zonecode,
      basic_address: fullAddress,
      detail_address: "",
    }));
  };

  /** ✅ 팝업 열기 */
  const handleOpenPostcode = () => {
    open({ onComplete: handlePostcodeComplete });
  };

  /** ✅ 회원가입 제출 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.id) return alert("아이디를 입력해주세요.");
    if (!validateId(form.id))
      return alert("아이디는 영어 또는 숫자로 4자 이상이어야 합니다.");
    if (!isIdChecked) return alert("아이디 중복체크를 해주세요.");
    if (!validatePassword(form.password))
      return alert("비밀번호는 숫자를 포함해 6자 이상이어야 합니다.");
    if (form.password !== form.confirmPassword)
      return alert("비밀번호가 일치하지 않습니다.");
    if (!form.name) return alert("이름을 입력해주세요.");
    if (!form.phone) return alert("전화번호를 입력해주세요.");
    if (!validatePhone(form.phone))
      return alert("휴대폰번호 형식이 올바르지 않습니다. (예: 010-1234-5678)");
    if (!validateEmail(form.email))
      return alert("이메일 형식이 올바르지 않습니다.");

    const newMember = {
      id: form.id,
      password: form.password,
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: {
        zipcode: form.zipcode,
        basic_address: form.basic_address,
        detail_address: form.detail_address,
        //extra_info: form.extra_info,
      },
    };

    try {
      await axios.post(API_URL, newMember);
      alert("🎉 회원가입이 완료되었습니다!");
      setForm({
        id: "",
        password: "",
        confirmPassword: "",
        name: "",
        email: "",
        phone: "",
        zipcode: "",
        basic_address: "",
        detail_address: "",
        //extra_info: "",
      });
      setIsIdChecked(false);
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    
    <form className="join-form" onSubmit={handleSubmit}>
      {/* 아이디 */}
      <div className="form-group">
        <label htmlFor="id">아이디 *</label>
        <div className="id-check-wrap">
          <input
            type="text"
            id="id"
            name="id"
            value={form.id}
            onChange={handleChange}
            required
          />
          <button type="button" className="btn-small" onClick={handleIdCheck}>
            중복체크
          </button>
        </div>
      </div>

      {/* 비밀번호 */}
      <div className="form-group">
        <label htmlFor="password">비밀번호 *</label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      {/* 비밀번호 확인 */}
      <div className="form-group">
        <label htmlFor="confirmPassword">비밀번호 확인 *</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      {/* 이름 */}
      <div className="form-group">
        <label htmlFor="name">이름 *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
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
        <label htmlFor="phone">휴대폰번호 *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="010-1234-5678"
          required
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
        <button type="button" className="btn-cancel">
          취소
        </button>
        <button type="submit" className="btn-submit">
          회원가입
        </button>
      </div>
    </form>
    
  );
}
