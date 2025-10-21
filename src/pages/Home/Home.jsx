// src/pages/Home/Home.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; // axios 대신 supabase
import PrdList from "../../components/ProductList/PrdList";
import Visual from "../../components/Visual/Visual";
import "../../styles/default.css"

function Home() {
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // axios 대신 supabase 쿼리
        const { data, error } = await supabase
          .from("products")
          .select("*");
        
          //console.log('data-->', data)
        if (error) throw error;
        
        setProducts(data);
        //console.log('products1-->',products)
      } catch (error) {
        console.error("데이터 불러오기 오류:", error);
      }
    }
    //console.log('products-->', products)
    fetchProducts();
    //console.log('products22222-->', products)
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1023);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])
  //console.log('productss333-->',products)
  const newProducts = products.filter((item) => item.isNew);
  console.log('newProducts-->' , newProducts)
  const bestProducts = products.filter((item) => item.isBest);
  const itemLimit = isMobile ? 4 : 8;
  
  return (
    <>
      <Visual />
      <PrdList title="Best Seller" products={bestProducts} limit={itemLimit} showMore={true} moreLink="/shop/best" />
      <PrdList title="New Item" products={newProducts} limit={itemLimit} showMore={true} moreLink="/shop/new" />
    </>
  )
}

export default Home;