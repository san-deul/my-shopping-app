export default function OrderProductList({ products }) {
  // 총 수량과 총 가격 계산
  const totalQuantity = products.reduce((sum, p) => sum + (p.quantity || 1), 0);
  const totalPrice = products.reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0);

  return (
    <section className="order_section">
      <h3>주문 상품 정보</h3>
      <div className="product_list">
        {products.map((p, idx) => (
          <div className="order_product" key={idx}>
            <img src={p.image || "/img/sample.jpg"} alt={p.name} className="order_thumb" />
            <div className="order_info">
              <p className="prd_name">{p.name}</p>
              <p className="prd_quantity">수량: {p.quantity}개</p>
              <p className="prd_price">{(p.price * p.quantity).toLocaleString()}원</p>
            </div>
          </div>
        ))}
      </div>
      <div className="product_summary">
        <p>총 수량: <span>{totalQuantity}개</span></p>
        <p>총 결제금액: <span>{totalPrice.toLocaleString()}원</span></p>
      </div>
    </section>
  );
}
