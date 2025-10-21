import OrderItem from "./OrderItem";

export default function OrderList({ orders }) {
  if (!orders || orders.length === 0) {
    return <p>주문 내역이 없습니다.</p>;
  }

  return (
    <ul className="order-list">
      {orders.map(order => (
        <OrderItem key={order.id} order={order} />
      ))}
    </ul>
  );
}
