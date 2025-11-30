import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./ReviewSlider.css";
import { Link } from "react-router-dom";
import moreBtn from "../../assets/images/plus_btn.png"
import noimage from "../../../src/assets/images/noimage.jpg"


export default function ReviewSlider({ title, reviews, showMore = false, moreLink = "#"  }) {

  const titleArea = (
    <p className="title">{title}</p>
  )
  const homeArea = (
    <>
      {titleArea}
      {showMore && (
        <div className="main_more">
          <Link to={moreLink}>
            <img src={moreBtn} />
          </Link>
        </div>
      )}
    </>
  )


  return (
    <div className="section_in">
      <div className="swiper-wrap">
        {homeArea}
        <section className="review-slider-wrap">
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="review-slider"
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1200: { slidesPerView: 4, spaceBetween: 30 },
            }}
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={index}>
                <div className="review-card">
                  <div className="review-image">
                    <img 
                      src={review.img ? review.img : `${noimage}` } 
                      alt={review.title || "이미지 없음"}
                      onError={(e) => e.target.src = noimage} 
                      />
                  </div>
                  <div className="review-content">
                    <h3 className="review-title">{review.title}</h3>
                    <p className="review-text">{review.content}</p>
                    <div className="review-footer">
                      <span className="review-writer">{review.writer}</span>
                      <span className="review-date">{review.date}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>
    </div>
  );
}
