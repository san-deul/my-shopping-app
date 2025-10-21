import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import useAuth from "../../hooks/useAuth";
import CartHeader from "../../components/Cart/CartHeader";
import CartList from "../../components/Cart/CartList";


//import CartFooter from "../components/CartFooter";
//import "../styles/Cart.css";

export default function CartPage() {
  const { user, loading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 🚨 로딩이 완료된 후(loading이 false일 때)에만 로그인 상태를 확인합니다.
    if (!loading) {
      if (!user) {
        navigate("/login");
        return;
      }
      // 로딩이 완료되었고 user가 존재하면 카트 데이터를 가져옵니다.
      fetchCart();
      console.log('user---->', user)
    }
  }, [user, loading, navigate]);

  const fetchCart = async () => {
    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("member_id", user.id);
    if (error) console.error(error);
    else setCartItems(data);
  };
  //console.log(cartItems)

  const handleCheck = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAllCheck = () => {
    if (checkedItems.length === cartItems.length) setCheckedItems([]);
    else setCheckedItems(cartItems.map((i) => i.id));
  };

  const handleQuantityChange = async (id, qty) => {
    if (qty < 1) return;
    const { error } = await supabase.from("cart").update({ quantity: qty }).eq("id", id);
    if (!error) {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
      );
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("cart").delete().eq("id", id);
    if (!error) setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalPrice = cartItems
    .filter((i) => checkedItems.includes(i.id))
    .reduce((acc, i) => acc + i.price * i.quantity, 0);

  const handleOrder = () => {
    const selected = cartItems.filter((i) => checkedItems.includes(i.id));
    if (selected.length === 0) return alert("선택된 상품이 없습니다.");
    navigate("/order", { state: { items: selected } });
  };

  if (loading) {
    return <div className="cart-container">로딩 중...</div>;
  }

  return (
    <div className="cart-container">

      {cartItems.length === 0 ? (
        <p className="empty">장바구니가 비어 있습니다.</p>
      ) : (
        <>
          <CartHeader
            allChecked={checkedItems.length === cartItems.length}
            onToggleAll={handleAllCheck}
          />
         <CartList
            items={cartItems}
            checkedItems={checkedItems}
            onCheck={handleCheck}
            onQuantityChange={handleQuantityChange}
            onDelete={handleDelete}
          />
         {/* <CartFooter totalPrice={totalPrice} onOrder={handleOrder} />*/}
        </>
      )}
    </div>
  );
}
