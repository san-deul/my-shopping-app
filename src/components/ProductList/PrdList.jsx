import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import 'swiper/css/pagination';
import 'swiper/css/navigation';


import moreBtn from "../../assets/images/plus_btn.png"
import { Link } from "react-router-dom";


import { Pagination, Navigation } from 'swiper/modules';

import "./PrdList.css";

import btnLeft from "../../assets/images/slide_left2.png"
import btnRight from "../../assets/images/slide_right2.png"




export default function PrdList({ title, products = [], useSwiper = false, limit, showMore = false, moreLink = "#" }) {

  //console.log('products-->PRDLIST', products)
  const displayedProducts = limit ? products.slice(0, limit) : products;

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  const swiperRef = useRef(null); // Swiper 인스턴스 담을 ref




  const content = displayedProducts.map((item) => (

    <li className="sct_li list" key={item.id}>
      <div className="item_img">
        <Link to={`/item/${item.id}`}>
          <img src={item.image} />
        </Link>
      </div>
      <div className="item_txt">
        <p className="i_title">
          <Link to={`/item/${item.id}`}>
            {item.name}
          </Link>
        </p>
        <div className="i_price">
          <div className="i_price1">
            <span>{item.originalPrice.toLocaleString()}</span>원
          </div>
          <div className="i_price2">
            <span>{item.price.toLocaleString()}</span>원
          </div>
        </div>
      </div>
    </li>

  ));

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

    <>
      {useSwiper ? (
        <div className="swiper-wrap">
          {titleArea}
          
          <Swiper
            slidesPerView={4}
            spaceBetween={20}
            modules={[Pagination, Navigation]}
            pagination={{
              type: 'progressbar',
              el: paginationRef.current,
            }}

            breakpoints={{
              // 0px 이상 (모든 화면, 즉 기본 모바일) 에서 slidesPerView: 2, spaceBetween: 10
              0: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              // 768px 이상일 때 slidesPerView: 4, spaceBetween: 20 (기존 데스크탑 설정)
              1023: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}

            className="mySwiper"
            //navigation={true}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            // onBeforeInit로 ref에 연결 (안정적)
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper

              setTimeout(() => {
                // ref 연결이 끝난 뒤 수동 지정
                if (swiper.params && swiper.params.navigation && swiper.params.pagination) {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.params.pagination.el = paginationRef.current;

                  swiper.navigation.init();
                  swiper.navigation.update();
                  swiper.pagination.init();
                  swiper.pagination.update();
                }
              });

            }} // Swiper 인스턴스 저장
          >

            {displayedProducts.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="item_img">
                  <Link to={`/item/${item.id}`}>
                    <img src={item.image} />
                  </Link>
                </div>
                <div className="item_txt">
                  <p className="i_title">
                    <Link to={`/item/${item.id}`}>
                      {item.name}
                    </Link>
                  </p>
                  <div className="i_price">
                    <p className="i_price1">
                      <span>
                        {item.originalPrice.toLocaleString()}
                      </span>원
                    </p>
                    <p className="i_price2">
                      <span>
                        {item.price.toLocaleString()}
                      </span>원
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="custom-area">
            <div ref={paginationRef} className="custom-pagination"></div>
            <div className="custom-button">
              <div ref={prevRef} className="custom-prev"><img src={btnLeft} /></div>
              <div ref={nextRef} className="custom-next"><img src={btnRight} /></div>
            </div>

          </div>

        </div>
      ) : (
       
          <div className="section_in">
            {homeArea}
            <ul className="section_lists">{content}</ul>
          </div>
        
      )}


    </>

  );
}
