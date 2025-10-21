import React, { useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";

export default function OrderDeliveryInfo({ deliveryInfo, setDeliveryInfo }) {
  const [editMode, setEditMode] = useState(false);
  const open = useDaumPostcodePopup();

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extra = "";
    if (data.addressType === "R") {
      if (data.bname) extra += data.bname;
      if (data.buildingName)
        extra += (extra ? `, ${data.buildingName}` : data.buildingName);
      fullAddress += extra ? ` (${extra})` : "";
    }
    setDeliveryInfo({
      ...deliveryInfo,
      zipcode: data.zonecode,
      basic_address: fullAddress,
      extra_info: extra,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo({ ...deliveryInfo, [name]: value });
  };

  return (
    <section className="order_section">
      <h3>배송 정보</h3>
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? "수정완료" : "수정"}
      </button>

      <div className="input_group">
        <label>우편번호</label>
        <div className="zipcode_box">
          <input type="text" name="zipcode" value={deliveryInfo.zipcode || ""} readOnly />
          {editMode && (
            <button type="button" onClick={() => open({ onComplete: handleComplete })}>
              주소찾기
            </button>
          )}
        </div>
      </div>

      <div className="input_group">
        <label>기본주소</label>
        <input
          type="text"
          name="basic_address"
          value={deliveryInfo.basic_address || ""}
          readOnly
        />
      </div>

      <div className="input_group">
        <label>상세주소</label>
        <input
          type="text"
          name="detail_address"
          value={deliveryInfo.detail_address || ""}
          onChange={handleChange}
          readOnly={!editMode}
        />
      </div>

      <div className="input_group">
        <label>배송 메모</label>
        <input
          type="text"
          name="memo"
          value={deliveryInfo.memo || ""}
          onChange={handleChange}
          readOnly={!editMode}
        />
      </div>
    </section>
  );
}
