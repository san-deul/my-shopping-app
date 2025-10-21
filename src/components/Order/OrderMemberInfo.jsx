import React, { useState } from "react";

export default function OrderMemberInfo({ member, setMember }) {
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  return (
    <section className="order_section">
      <h3>주문자 정보</h3>
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? "수정완료" : "수정"}
      </button>

      <div className="input_group">
        <label>이름</label>
        <input
          type="text"
          name="name"
          value={member.name || ""}
          onChange={handleChange}
          readOnly={!editMode}
        />
      </div>
      <div className="input_group">
        <label>전화번호</label>
        <input
          type="text"
          name="phone"
          value={member.phone || ""}
          onChange={handleChange}
          readOnly={!editMode}
        />
      </div>
      <div className="input_group">
        <label>이메일</label>
        <input type="text" value={member.email || ""} readOnly />
      </div>
    </section>
  );
}
