import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./Product.css";

export default function ProductImgViewer({ thumbnails, mainImage, setMainImage, alt }) {
  return (
    <div className="product-detail-left">
      <div className="thumbnail-swiper">
        <Swiper direction="vertical" spaceBetween={10} slidesPerView={3}>
          {thumbnails?.map((thumb, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={thumb}
                alt={`thumbnail-${idx}`}
                className={mainImage === thumb ? "active" : ""}
                onClick={() => setMainImage(thumb)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="main-image">
        <img src={mainImage} alt={alt} />
      </div>
    </div>
  );
}
