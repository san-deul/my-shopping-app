export default function CartItem({ item, checked, onCheck, onQuantityChange, onDelete, onSaveOne }) {
  return (
    <li className="cart-item">
      <input type="checkbox" checked={checked} onChange={onCheck} />
      <img src={item.products.image} alt={item.products.name} className="cart-image" />
      <div className="cart-info">
        <p className="cart-name">{item.products.name}</p>
        <p className="cart-price">{item.products.price.toLocaleString()}원</p>
        <div className="cart-quantity">
          <button onClick={() => onQuantityChange(item.id, item.quantity - 1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => onQuantityChange(item.id, item.quantity + 1)}>+</button>
          <button className="save-btn" onClick={() => onSaveOne(item.id)}>저장</button>
        </div>
      </div>
      <button className="cart-delete" onClick={onDelete}>✕</button>
    </li>
  );
}
