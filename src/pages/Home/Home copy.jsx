// db.json 에서 가져오는 데이터 axios 로 가져올 때 코드 

import { useEffect, useState } from "react";
import axios from "axios";
import PrdList from "../../components/ProductList/PrdList";
import Visual from "../../components/Visual/Visual";
import "../../styles/default.css"

function Home() {
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/products")
        //console.log('data-->' ,data)
        setProducts(data);
      } catch (error) {
        console.error("데이터 불러오기 오류:", error);
      }
    }
    fetchProducts();

    const handleResize = () => {
      // 화면 너비가 768px 이하이면 isMobile을 true로 설정
      setIsMobile(window.innerWidth <= 1023);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, [])

  const newProducts = products.filter((item) => item.isNew);
  const bestProducts = products.filter((item) => item.isBest);

  const itemLimit = isMobile ? 4 : 8; // 모바일이면 4개, 아니면 8개

  return (
    <>
      <Visual />
      <PrdList title="Best Seller" products={bestProducts} limit={itemLimit} showMore={true} moreLink="/shop/best" />
      <PrdList title="New Item" products={newProducts} limit={itemLimit} showMore={true} moreLink="/shop/new" />
    </>
  )
}
export default Home;