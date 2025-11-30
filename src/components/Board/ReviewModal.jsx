// src/components/Review/OrderSelectModal.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "../Board/ReviewModal.css"

export default function ReviewModal({ userId, onSelect, onClose }) {
  const [orders, setOrders] = useState([]);


  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
        id,
        created_at,
        total_price,
        order_items (
          id,
          product_id,
          product_name,
          quantity,
          price
        )
      `)
        .eq("member_id", userId);

      if (error) {
        console.error(error);
      } else {

        setOrders(data);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="modal_bg">
      <div className="modal_box">
        <button className="close_btn" onClick={onClose}>
          ✕
        </button>
        <h3>주문내역 선택</h3>
        <ul className="order_list">
          {orders.length > 0 ? (
            orders.map((order) =>
              order.order_items.map((item) => (
                <li
                  key={item.id}
                  onClick={() => onSelect(item.product_id, item.product_name)}
                  className="order_item"
                >
                  <strong>{item.product_name}</strong>
                  <br />
                  
                </li>
              ))
            )
          ) : (
            <p>주문내역이 없습니다.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
