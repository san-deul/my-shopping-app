import { useState } from "react";
import "../Auth/Join.css";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function JoinForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    zipcode: "",
    basic_address: "",
    detail_address: "",
  });

  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const open = useDaumPostcodePopup();

  /** 입력값 변경 */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      const noKorean = value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, "");
      setForm((prev) => ({ ...prev, [name]: noKorean }));
      return;
    }

    if (name === "phone") {
      let numbersOnly = value.replace(/[^0-9]/g, "");
      if (numbersOnly.length < 4) numbersOnly = numbersOnly;
      else if (numbersOnly.length < 8)
        numbersOnly = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
      else
        numbersOnly = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(
          3,
          7
        )}-${numbersOnly.slice(7, 11)}`;
      setForm((prev) => ({ ...prev, [name]: numbersOnly }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "confirmPassword" || name === "password") {
      setPasswordMatch(
        name === "password"
          ? value === form.confirmPassword
          : form.password === value
      );
    }

  };

  /** 정규식 검증 */
  const validateEmail = (email) =>
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  const validatePassword = (password) => /^(?=.*[0-9]).{6,}$/.test(password);
  const validatePhone = (phone) => /^01[0-9]-\d{3,4}-\d{4}$/.test(phone);

  /** 이메일 중복체크 */
  const handleEmailCheck = async () => {
    if (!validateEmail(form.email)) {
      alert("이메일 형식으로 입력해주세요. (예: example@domain.com)");
      return;
    }

    const { data, error } = await supabase
      .from("member")
      .select("email")
      .eq("email", form.email);

    if (error) {
      console.error("중복체크 오류:", error);
      alert("중복체크 중 오류가 발생했습니다.");
      return;
    }

    if (data.length > 0) {
      alert("⚠️ 이미 사용 중인 이메일입니다.");
      setIsEmailChecked(false);
    } else {
      alert("✅ 사용 가능한 이메일입니다!");
      setIsEmailChecked(true);
    }
  };

  /** 주소 검색 */
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

  /** 회원가입 제출 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 체크
    if (!form.email) return alert("이메일을 입력해주세요.");
    if (!validateEmail(form.email))
      return alert("이메일 형식으로 입력해주세요.");
    if (!isEmailChecked) return alert("이메일 중복체크를 해주세요.");
    if (!validatePassword(form.password))
      return alert("비밀번호는 숫자를 포함해 6자 이상이어야 합니다.");
    if (form.password !== form.confirmPassword)
      return alert("비밀번호가 일치하지 않습니다.");
    if (!form.name) return alert("이름을 입력해주세요.");
    if (!form.phone) return alert("휴대폰번호를 입력해주세요.");
    if (!validatePhone(form.phone))
      return alert("휴대폰번호 형식이 올바르지 않습니다. (예: 010-1234-5678)");

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) {
        throw new Error(`Auth 생성 실패: ${authError.message}`);
      }
      const userId = authData.user.id;

      const { error: insertError } = await supabase.from("member").insert([
        {
          id: userId,
          email: form.email,
          name: form.name,
          phone: form.phone,
          zipcode: form.zipcode,
          basic_address: form.basic_address,
          detail_address: form.detail_address,
          level: 1,
        },
      ]);

      if (insertError) {
        throw new Error(`회원 정보 저장 실패: ${insertError.message}`);
      }

      const confirmGoMain = window.confirm(
        `🎉 회원가입을 축하합니다, ${form.name}님!\n\n메인 페이지로 이동하시겠습니까?`
      );

      if (confirmGoMain) {
        navigate("/");
      }
      setForm({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        phone: "",
        zipcode: "",
        basic_address: "",
        detail_address: "",
      });
      setIsEmailChecked(false);
    
  } catch (error) {
    console.error(error);
    alert(`회원가입 실패: ${error.message}`);
  }
};

const handleResetForm = () => {
  const ok = window.confirm("작성 중인 내용을 모두 지우시겠습니까?");
  if (!ok) return;

  setForm({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    zipcode: "",
    basic_address: "",
    detail_address: "",
  });
  setIsEmailChecked(false);
  setPasswordMatch(true);
  setTimeout(() => {
    const emailInput = document.getElementById("email");
    if (emailInput) emailInput.focus();
  }, 50);
};

return (
  <form className="join-form" onSubmit={handleSubmit}>
    {/* 이메일(ID) */}
    <div className="form-group">
      <span class="pp">* 필수</span>
      <label htmlFor="email"><span class="point">*</span> 아이디 (사용가능한 이메일을 적어주세요) </label>
      <div className="id-check-wrap">
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@domain.com"
          required
        />
        <button type="button" className="btn-small" onClick={handleEmailCheck}>
          중복체크
        </button>
      </div>
    </div>

    {/* 비밀번호 */}
    <div className="form-group">
      <label htmlFor="password"><span class="point">*</span> 비밀번호 </label>
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
      <label htmlFor="confirmPassword"><span class="point">*</span> 비밀번호 확인 </label>
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />
      {!passwordMatch && form.confirmPassword && (
        <p className="error-text">비밀번호가 일치하지 않습니다.</p>
      )}
    </div>

    {/* 이름 */}
    <div className="form-group">
      <label htmlFor="name"><span class="point">*</span> 이름 </label>
      <input
        type="text"
        id="name"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />
    </div>

    {/* 휴대폰 */}
    <div className="form-group">
      <label htmlFor="phone"><span class="point">*</span> 휴대폰번호</label>
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
      <button type="button" className="btn-cancel" onClick={handleResetForm}>
        취소
      </button>
      <button type="submit" className="btn-submit">
        회원가입
      </button>
    </div>
  </form>
);
}
