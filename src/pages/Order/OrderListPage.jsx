import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import useAuth from "../../hooks/useAuth";
import "../../components/Order/OrderList.css";

export default function OrderListPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          created_at,
          status,
          total_price,
          order_items (
            id,
            product_name,
            product_image,
            price,
            quantity
          )
        `)
        .eq("member_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setOrders(data);
    };
    fetchOrders();
  }, [user]);

  if (!orders.length) return <p>주문내역이 없습니다.</p>;

  return (
    <div className="orderlist-container">
      <h2>주문내역</h2>
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
                  <img src={item.product_image} alt={item.product_name} />
                  <span>{item.product_name}</span>
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
    </div>
  );
}
