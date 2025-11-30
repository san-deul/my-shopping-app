import { useState, useEffect } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";


export default function MyModify({ userData, onSubmit, onVerifyPassword }) {
  const [form, setForm] = useState({
    userId: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    name: "",
    phone: "",
    zipcode: "",
    basic_address: "",
    detail_address: "",
  });

  const open = useDaumPostcodePopup();

  /** ✅ 초기 데이터 설정 */
  useEffect(() => {
    if (userData) {
      setForm({
        userId: userData.userId || "",
        email: userData.email || "",
        name: userData.name || "",
        phone: userData.phone || "",
        zipcode: userData.zipcode || "",
        basic_address: userData.basic_address || "",
        detail_address: userData.detail_address || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [userData]);

  /** ✅ 입력값 변경 */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      let numbersOnly = value.replace(/[^0-9]/g, "");
      if (numbersOnly.length < 4) {
        numbersOnly = numbersOnly;
      } else if (numbersOnly.length < 8) {
        numbersOnly = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
      } else {
        numbersOnly = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
      }
      setForm((prev) => ({ ...prev, [name]: numbersOnly }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ 정규식 검증 */
  const validatePassword = (pw) => /^(?=.*[0-9]).{6,}$/.test(pw);
  const validatePhone = (phone) => /^01[0-9]-\d{3,4}-\d{4}$/.test(phone);

  /** ✅ 주소검색 */
  const handlePostcodeComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") extraAddress += data.bname;
      if (data.buildingName !== "")
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
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

    // 비밀번호 변경하는 경우
    if (form.newPassword) {
      if (!form.currentPassword) {
        return alert("현재 비밀번호를 입력해주세요.");
      }

      // 현재 비밀번호 확인
      const isValidPassword = await onVerifyPassword(form.currentPassword);
      if (!isValidPassword) {
        return alert("현재 비밀번호가 일치하지 않습니다.");
      }

      if (!validatePassword(form.newPassword)) {
        return alert("비밀번호는 숫자를 포함해 6자 이상이어야 합니다.");
      }

      if (form.newPassword !== form.confirmPassword) {
        return alert("새 비밀번호가 일치하지 않습니다.");
      }
    }

    if (!validatePhone(form.phone)) {
      return alert("휴대폰번호 형식이 올바르지 않습니다.");
    }

    try {
      await onSubmit(form);
    } catch (error) {
      // 에러는 부모 컴포넌트에서 처리
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <form className="join-form" onSubmit={handleSubmit}>
      {/* 이메일 (읽기전용) */}
      <div className="form-group">
        <label htmlFor="email">이메일 (ID)</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
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
          placeholder="비밀번호 변경 시 입력"
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
          required
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
          readOnly
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