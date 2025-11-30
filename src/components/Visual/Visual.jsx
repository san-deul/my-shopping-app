import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

/*import './styles.css';*/

// import required modules
import { Navigation, Autoplay } from 'swiper/modules';

import "./Visual.css";
//import v1 from "../../assets/images/visual1.png";
import v1 from "../../assets/images/visual1.png"
import v2 from "../../assets/images/visual2-1.png"

//import v3 from "../../assets/images/visual3.png"

import btnLeft from "../../assets/images/slide_left.png"
import btnRight from "../../assets/images/slide_right.png"

const visualImages = [
 
  { id: 1, src: v1, alt: "비주얼 슬라이드 2" },
  { id: 2, src: v2, alt: "비주얼 슬라이드 3" },
];



export default function Visual() {
  const swiperRef = useRef(null); 

  return (
    <div className="visual v_pc">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={false} 
        autoplay={{delay:2500,  disableOnInteraction: false}} 
        loop={true}
        className="mySwiper visualSwiper"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}>
        {visualImages.map((image) => (
          <SwiperSlide key={image.id}>
            {/* key={image.id}는 React에서 필수 */}
            <img src={image.src} alt={image.alt} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-button">
        <button
          className="swiper-button-prev"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          {/* 여기에 원하는 이전 버튼 이미지/아이콘을 넣습니다. */}
          <img src={btnLeft} alt="이전 슬라이드" />
        </button>

        <button
          className="swiper-button-next"
          onClick={() => swiperRef.current?.slideNext()}
        >
          {/* 여기에 원하는 다음 버튼 이미지/아이콘을 넣습니다. */}
          <img src={btnRight} alt="다음 슬라이드" />
        </button>
      </div>

    </div>
  );
}