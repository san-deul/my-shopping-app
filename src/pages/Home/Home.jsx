// src/pages/Home/Home.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; // axios 대신 supabase
import PrdList from "../../components/ProductList/PrdList";
import Visual from "../../components/Visual/Visual";
import "../../styles/default.css"
import ReviewSlider from "../../components/ProductList/ReviewSlider";

function Home() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([])
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, reviewRes] = await Promise.all([
          supabase.from("products").select("*"),
          supabase.from("reviews").select("*").order("id", { ascending: false }),
        ]);

        if (productRes.error) throw productRes.error;
        if (reviewRes.error) throw reviewRes.error;

        setProducts(productRes.data);
        setReviews(reviewRes.data);
      } catch (error) {
        console.error("데이터 불러오기 오류:", error);
      }
    }
    fetchData();
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1023);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])
  console.log('reviews-->',reviews)
  const newProducts = products.filter((item) => item.isNew);
  console.log('newProducts-->' , newProducts)
  const bestProducts = products.filter((item) => item.isBest);
  const itemLimit = isMobile ? 4 : 8;
  
  return (
    <>
      <Visual />
      <PrdList title="Best Seller" products={bestProducts} limit={itemLimit} showMore={true} moreLink="/shop/best" />
      <PrdList title="New Item" products={newProducts} limit={itemLimit} showMore={true} moreLink="/shop/new" />
      <ReviewSlider title="Review" reviews={reviews} showMore={true} moreLink="/review" />
    </>
  )
}

export default Home;