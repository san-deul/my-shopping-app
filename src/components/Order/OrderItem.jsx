import { Link } from "react-router-dom";

export default function OrderItem({ order }) {
  return (
    <li className="order-item">
      <Link to={`/order/${order.id}`}>
        <div className="order-info">
          <p>주문번호: {order.id}</p>
          <p>주문일자: {new Date(order.created_at).toLocaleDateString()}</p>
          <p>총금액: {order.total_price?.toLocaleString()}원</p>
          <p>상태: {order.status}</p>
        </div>
      </Link>
    </li>
  );
}
