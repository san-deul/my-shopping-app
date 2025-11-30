import React from "react";
import QuantitySelector from "./QuantitySelector";

export default function ProductInfoBox({
  product,
  quantity,
  setQuantity,
  onBuy,
  onAddToCart, // ✅ 추가
}) {
  const totalPrice = product.price * quantity;

  return (
    <div className="product-detail-right">
      <h2 className="product-name">{product.name}</h2>

      <div className="tags">
        {product.isNew && <span className="tag new">NEW</span>}
        {product.isBest && <span className="tag best">BEST</span>}
      </div>

      <p className="desc">{product.description}</p>

      <div className="price-box">
        <p className="sale-price">{product.price.toLocaleString()}원</p>
        {product.originalPrice && (
          <p className="original-price">
            {product.originalPrice.toLocaleString()}원
          </p>
        )}
      </div>

      <QuantitySelector
        name={product.name}
        price={product.price}
        quantity={quantity}
        setQuantity={setQuantity}
      />

      <div className="total">
        <strong>총 금액:</strong>{" "}
        <span>{totalPrice.toLocaleString()}원</span>
      </div>

      <div className="action-buttons">
        <button className="buy" onClick={onBuy}>
          구매하기
        </button>
        <button className="cart" onClick={onAddToCart}>
          장바구니
        </button>

      </div>
    </div>
  );
}
