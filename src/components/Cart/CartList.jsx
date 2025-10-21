import CartItem from "./CartItem";

export default function CartList({
  items,
  checkedItems,
  onCheck,
  onQuantityChange,
  onDelete,
  onSaveOne, // ✅ 추가
}) {
  return (
    <ul className="cart-list">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          checked={checkedItems.includes(item.id)}
          onCheck={() => onCheck(item.id)}
          onQuantityChange={onQuantityChange}
          onDelete={() => onDelete(item.id)}
          onSaveOne={onSaveOne} // ✅ 이 부분 추가!
        />
      ))}
    </ul>
  );
}
