import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import useAuth from "../../hooks/useAuth";
import OrderProductList from "../../components/Order/OrderProductList";
import OrderMemberInfo from "../../components/Order/OrderMemberInfo";
import OrderDeliveryInfo from "../../components/Order/OrderDeliveryInfo";
import "../../components/Order/Order.css";

export default function OrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [member, setMember] = useState(null);
  const [products, setProducts] = useState([]);
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  // 장바구니 or 단일 상품 데이터 받기
  useEffect(() => {
    const data = location.state;
    if (data?.products) setProducts(data.products); // 여러개
    else if (data?.product) setProducts([{ ...data.product, quantity: data.quantity || 1 }]);
  }, [location.state]);

  // 회원정보 가져오기
  useEffect(() => {
    const fetchMember = async () => {
      if (!user?.email) return;
      const { data, error } = await supabase
        .from("member")
        .select("*")
        .eq("email", user.email)
        .single();
      if (!error && data) {
        setMember(data);
        setDeliveryInfo(data); // 기본 배송지 동일하게
      }
    };
    fetchMember();
  }, [user]);

  if (loading) return <p>로그인 상태 확인 중...</p>;
  if (!user) return <p>로그인이 필요합니다.</p>;
  if (!member) return <p>회원 정보를 불러오는 중...</p>;
  if (!products.length) return <p>상품 정보가 없습니다.</p>;

  // 총합 계산
  const totalPrice = products.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0);

  // 🔹 결제 버튼 클릭 시 필수값 검증
  /*
  const handleOrderSubmit = () => {
    // 주문자 필수 입력 체크
    const memberRequired = ["name", "phone"];
    const memberMissing = memberRequired.filter((f) => !member[f] || member[f].trim() === "");
    if (memberMissing.length > 0) {
      alert("주문자 정보를 모두 입력해주세요!");
      return;
    }

    // 배송지 필수 입력 체크
    const deliveryRequired = ["zipcode", "basic_address", "detail_address"];
    const deliveryMissing = deliveryRequired.filter(
      (f) => !deliveryInfo[f] || deliveryInfo[f].trim() === ""
    );
    if (deliveryMissing.length > 0) {
      alert("배송 정보를 모두 입력해주세요!");
      return;
    }

    // 모든 필수값 입력되면 결제 진행
    alert("구매가 완료되었습니다!");
    navigate("/mypage");
  };*/
  const handleOrderSubmit = async () => {
    // 1️⃣ 필수값 검증
    const memberRequired = ["name", "phone"];
    const memberMissing = memberRequired.filter((f) => !member[f] || member[f].trim() === "");
    if (memberMissing.length > 0) {
      alert("주문자 정보를 모두 입력해주세요!");
      return;
    }

    const deliveryRequired = ["zipcode", "basic_address", "detail_address"];
    const deliveryMissing = deliveryRequired.filter(
      (f) => !deliveryInfo[f] || deliveryInfo[f].trim() === ""
    );
    if (deliveryMissing.length > 0) {
      alert("배송 정보를 모두 입력해주세요!");
      return;
    }

    try {
      // 2️⃣ 주문 메인(orders) 데이터 생성
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            member_id: user.id, // 🔸 Auth user.id (text)
            total_price: totalPrice,
            order_name: member.name,
            order_phone: member.phone,
            zipcode: deliveryInfo.zipcode,
            basic_address: deliveryInfo.basic_address,
            detail_address: deliveryInfo.detail_address,
            extra_info: deliveryInfo.extra_info || null, // 선택사항
            payment_method: "card", // 추후 선택 가능
            status: "pending", // 결제대기
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 3️⃣ 주문 상세(order_items) 데이터 생성
      const orderItems = products.map((p) => ({
        order_id: orderData.id,
        product_id: p.id,
        product_name: p.name, // 🔸 product_name 필수
        price: p.price,
        quantity: p.quantity || 1,
        // subtotal은 DB에서 자동 계산됨
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      // 4️⃣ 성공 처리
      alert("주문이 완료되었습니다!");
      navigate("/mypage");
    } catch (err) {
      console.error("🧨 주문 처리 중 오류:", err);
      alert("주문 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };



  // 취소 버튼
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="order_container">
      <h2>주문/결제</h2>

      <OrderProductList products={products} totalPrice={totalPrice} />
      <OrderMemberInfo member={member} setMember={setMember} />
      <OrderDeliveryInfo deliveryInfo={deliveryInfo} setDeliveryInfo={setDeliveryInfo} />

      <div className="order_buttons">
        <button className="order_btn pay" onClick={handleOrderSubmit}>
          결제하기
        </button>
        <button className="order_btn cancel" onClick={handleCancel}>
          취소하기
        </button>
      </div>
    </div>
  );
}
