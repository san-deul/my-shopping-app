export default function CartFooter({ totalPrice, onOrder, onCheckedDelete, onAllDelete, onSaveAll }) {
  return (
    <div className="cart-footer">
      <div className="footer-buttons">
        <button className="delete-checked-btn" onClick={onCheckedDelete}>선택 삭제</button>
        <button className="delete-all-btn" onClick={onAllDelete}>전체 삭제</button>
        <button className="save-all-btn" onClick={onSaveAll}>전체 저장</button>
      </div>
      <p>
        선택 상품 금액: <strong>{totalPrice.toLocaleString()}원</strong>
      </p>
      <button className="order-btn" onClick={onOrder}>주문하기</button>
    </div>
  );
}
