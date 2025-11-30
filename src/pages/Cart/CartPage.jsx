import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import useAuth from "../../hooks/useAuth";
import CartHeader from "../../components/Cart/CartHeader";
import CartList from "../../components/Cart/CartList";
import CartFooter from "../../components/Cart/CartFooter";
import "../../components/Cart/Cart.css";
import { useLoading } from "../../context/LoadingContext";

export default function CartPage() {
  const { user, loading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [editedItems, setEditedItems] = useState({}); // ✅ 변경된 수량 저장
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
        return;
      }
      fetchCart();
    }
  }, [user, loading, navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("cart")
        .select(`
        id,
        member_id,
        quantity,
        product_id,
        products (
          id,
          name,
          price,
          image
        )
      `)
        .eq("member_id", user.id);

      if (error) throw error;
      setCartItems(data);

    } catch (error) {

    } finally {
      setLoading(false);
    }


  };

  // ✅ 체크 기능
  const handleCheck = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAllCheck = () => {
    if (checkedItems.length === cartItems.length) setCheckedItems([]);
    else setCheckedItems(cartItems.map((i) => i.id));
  };

  // ✅ 수량 변경 (화면에만 반영)
  const handleQuantityChange = (id, qty) => {
    if (qty < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
    setEditedItems((prev) => ({ ...prev, [id]: qty }));
  };

  // ✅ 개별 삭제
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const { error } = await supabase.from("cart").delete().eq("id", id);
      if (error) throw error;
      setCartItems((prev) => prev.filter((i) => i.id !== id));
      setCheckedItems((prev) => prev.filter((cid) => cid !== id));
    } catch (error) {
      console.error("삭제 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 선택 삭제
  const handleCheckedDelete = async () => {
    if (checkedItems.length === 0) return alert("삭제할 상품을 선택하세요.");
    const { error } = await supabase.from("cart").delete().in("id", checkedItems);
    if (!error) {
      setCartItems((prev) => prev.filter((i) => !checkedItems.includes(i.id)));
      setCheckedItems([]);
    }
  };

  // ✅ 전체 삭제
  const handleAllDelete = async () => {
    if (cartItems.length === 0) return;
    if (!window.confirm("장바구니의 모든 상품을 삭제할까요?")) return;
    const { error } = await supabase.from("cart").delete().eq("member_id", user.id);
    if (!error) {
      setCartItems([]);
      setCheckedItems([]);
    }
  };

  // ✅ 개별 저장 (한 개만 DB 반영)
  const handleSaveOne = async (id) => {
    if (!editedItems[id]) return;
    const { error } = await supabase
      .from("cart")
      .update({ quantity: editedItems[id] })
      .eq("id", id);
    if (!error) {
      alert("수량이 저장되었습니다.");
      setEditedItems((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  // ✅ 전체 저장 (변경된 모든 수량 반영)
  const handleSaveAll = async () => {
    const updates = Object.entries(editedItems).map(([id, qty]) => ({
      id,
      quantity: qty,
    }));
    if (updates.length === 0) return alert("변경된 항목이 없습니다.");

    try {
      setLoading(true);
      for (const update of updates) {
        await supabase.from("cart").update({ quantity: update.quantity }).eq("id", update.id);
      }
      alert("변경된 수량이 모두 저장되었습니다.");
      setEditedItems({});
    } catch (error) {
      console.error("저장 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 총합 계산
  const totalPrice = cartItems
    .filter((i) => checkedItems.includes(i.id))
    .reduce((acc, i) => acc + i.products.price * i.quantity, 0);

  const handleOrder = () => {
    const selected = cartItems.filter((i) => checkedItems.includes(i.id));
    if (selected.length === 0) return alert("선택된 상품이 없습니다.");
    const formatted = selected.map((i) => ({
      id: i.products.id,
      name: i.products.name,
      price: i.products.price,
      image: i.products.image,
      quantity: i.quantity
    }));
    navigate("/order", { state: { items: formatted } });
  };

  if (loading) return <div className="cart-container">로딩 중...</div>;

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
            onSaveOne={handleSaveOne}
          />
          <CartFooter
            totalPrice={totalPrice}
            onOrder={handleOrder}
            onCheckedDelete={handleCheckedDelete}
            onAllDelete={handleAllDelete}
            onSaveAll={handleSaveAll}
          />
        </>
      )}
    </div>
  );
}
