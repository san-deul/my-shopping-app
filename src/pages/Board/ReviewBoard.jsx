import { useEffect, useState } from "react";
import Review from "../../components/Board/Review";
import axios from "axios";
import { supabase } from "../../lib/supabase";

export default function ReviewBoard() {
  //console.log('g???')
  const [lists, setLists] = useState([]);

useEffect(() => {
  const fetchLists = async () => {
    try {
      const { data: reviews, error: reviewError } = await supabase
        .from("reviews")
        .select("*")
        .order("id", { ascending: false })
        
      if (reviewError) throw reviewError;

      const { data: products, error: productError } = await supabase
        .from("products")
        .select("id, name, image");
      if (productError) throw productError;

      // 리뷰에 상품명 매칭
      const merged = reviews.map((review) => {
        const product = products.find(p => p.id === review.product_id);
        
        return {
          ...review,
          product_name: product?.name || "알 수 없는 상품",
          product_img: product?.image || "",
        };
      });

      setLists(merged);
    } catch (error) {
      console.error("데이터 불러오기 오류:", error);
    }
  };

  fetchLists();
}, []);


  console.log('list!!!!s-->', lists)

  return (
    <Review lists={lists} />
  )

}
