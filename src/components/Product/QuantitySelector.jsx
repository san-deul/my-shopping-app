import React from "react";

export default function QuantitySelector({ name, price, quantity, setQuantity }) {
  return (
    <div className="quantity-box">
      <span>{name}</span>
      <div className="quantity-btns">
        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(q => q + 1)}>+</button>
      </div>
      <span className="price-inline">
        +{(price * (quantity - 1)).toLocaleString()}원
      </span>
    </div>
  );
}
