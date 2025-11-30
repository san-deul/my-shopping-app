import { Link } from "react-router-dom";
import noimage from "../../../src/assets/images/noimage.jpg"

export default function OrderTable({ orders }) {

  console.log('order-->', orders)
  return (
    <table className="order-table">
      <thead>
        <tr>
          <th>날짜/주문번호</th>
          <th>상품정보</th>
          <th>금액/수량</th>
          <th>주문상태</th>
          <th>확인/취소</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) =>
          order.order_items.map((item) => (
            <tr key={item.id}>
              <td>
                <div>
                  <div>{new Date(order.created_at).toLocaleDateString()}</div>
                  <div className="order-id">{order.id}</div>
                </div>
              </td>
              <td className="product-info">
                <Link to={`/item/${item.products?.id}`}>
                  <img
                    src={item.products?.image ? item.products.image : noimage}
                    alt={item.product_name || "이미지 없음"}
                    onError={(e) => (e.target.src = noimage)}
                  />
                  <span>{item.product_name}</span>
                </Link>
              </td>
              <td>
                {item.price.toLocaleString()}원 / {item.quantity}개
              </td>
              <td>{order.status === "paid" ? "입금완료" : order.status}</td>
              <td>
                <button
                  onClick={() => alert(`주문상세(${order.id})`)}
                  className="order-detail-btn"
                >
                  주문상세
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
