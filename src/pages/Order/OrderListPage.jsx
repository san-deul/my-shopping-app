import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import useAuth from "../../hooks/useAuth";
import OrderTable from "../../components/Order/OrderTable";
import Spinner from "../../components/common/Spinner";
import "../../components/Order/OrderList.css";

export default function OrderListPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);

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
            quantity,
            products(
              id,
              image
            )
          
          )
        `)
        .eq("member_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (loading) return <Spinner />;
  if (!orders.length) return <p>주문내역이 없습니다.</p>;

  return (
    <div className="orderlist-container">
      
      <OrderTable orders={orders} />
    </div>
  );
}
