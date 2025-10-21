import React from "react";
import { Link } from "react-router-dom";

export default function MyPageMenu() {
  const menus = [
    { label: "🧾 주문내역", path: "/mypage/orders" },
    { label: "🛒 장바구니", path: "/cart" },
    { label: "✍️ 작성후기", path: "/mypage/reviews" },
    { label: "📩 문의내역", path: "/mypage/inquiries" },
  ];

  return (
    <section className="mypage-menu">
      <ul>
        {menus.map((menu, idx) => (
          <li key={idx}>
            <Link to={menu.path}>{menu.label}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
