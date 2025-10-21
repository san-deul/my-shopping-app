import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import ProductInfoBox from "../../components/Product/ProductInfoBox";
import ProductImgViewer from "../../components/Product/ProductImgViewer";
import useAuth from "../../hooks/useAuth"; // ✅ 로그인 훅 불러오기

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ 로그인한 사용자 정보
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("상품 불러오기 실패:", error);
        return;
      }

      setProduct(data);
      setMainImage(data.image);
    };

    fetchProduct();
  }, [id]);

  const handleBuy = () => {
    navigate("/order", { state: { product, quantity } });
  };

  // ✅ 장바구니 추가 함수
  const handleAddToCart = async () => {
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
      .from("cart")
      .insert([
        {
          member_id: user.id, // useAuth로 가져온 로그인 ID
          product_id: product.id,
          quantity: quantity,
        },
      ])
      .select();

    if (error) {
      console.error("장바구니 추가 실패:", error);
      alert("장바구니에 상품을 담는 중 오류가 발생했습니다.");
      return;
    }

    alert("상품이 장바구니에 추가되었습니다!");
    console.log("장바구니 저장 결과:", data);
  };

  if (!product) return <p>로딩중...</p>;

  return (
    <div className="product-detail">
      <ProductImgViewer
        thumbnails={product.thumbnails}
        mainImage={mainImage}
        setMainImage={setMainImage}
        alt={product.name}
      />
      <ProductInfoBox
        product={product}
        quantity={quantity}
        setQuantity={setQuantity}
        onBuy={handleBuy}
        onAddToCart={handleAddToCart} // ✅ 이거 추가!
      />
    </div>
  );
}
