export default function CartHeader({ allChecked, onToggleAll }) {
  return (
    <div className="cart-header">
      <label>
        <input type="checkbox" checked={allChecked} onChange={onToggleAll} />
        전체 선택
      </label>
    </div>
  );
}
