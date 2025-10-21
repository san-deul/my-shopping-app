import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleBuy = () => {
    navigate("/order", { state: { product, quantity } });
  };

  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setMainImage(data.image);
      });
  }, [id]);

  if (!product) return <p>로딩중...</p>;

  return (
    <div className="product-detail">
      {/* 왼쪽 이미지 영역 */}
      <div className="product-detail-left">
        <div className="thumbnail-swiper">
          <Swiper direction="vertical" spaceBetween={10} slidesPerView={3}>
            {product.thumbnails?.map((thumb, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={thumb}
                  alt="thumbnail"
                  className={mainImage === thumb ? "active" : ""}
                  onClick={() => setMainImage(thumb)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="main-image">
          <img src={mainImage} alt={product.name} />
        </div>
      </div>

      {/* 오른쪽 정보 영역 */}
      <div className="product-detail-right">
        <h2 className="product-name">{product.name}</h2>

        <div className="tags">
          {product.isNew && <span className="tag new">NEW</span>}
          {product.isBest && <span className="tag best">BEST</span>}
        </div>

        <p className="desc">{product.description}</p>

        <div className="price-box">
          <p className="sale-price">{product.price.toLocaleString()}원</p>
          {product.originalPrice && (
            <p className="original-price">
              {product.originalPrice.toLocaleString()}원
            </p>
          )}
        </div>

        <div className="quantity-box">
          <span>{product.name}</span>
          <div className="quantity-btns">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>
          <span className="price-inline">
            +{(product.price * (quantity - 1)).toLocaleString()}원
          </span>
        </div>

        <div className="total">
          <strong>총 금액:</strong>{" "}
          <span>{(product.price * quantity).toLocaleString()}원</span>
        </div>

        <div className="action-buttons">
          <button className="buy" onClick={handleBuy}>구매하기</button>
          <button className="cart">장바구니</button>
          <button className="wish">관심상품</button>
        </div>
      </div>
    </div>
  );
}
