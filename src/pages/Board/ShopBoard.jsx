import { useParams } from "react-router-dom";
import PrdList from "../../components/ProductList/PrdList";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import CategoryList from "../../components/ProductList/Category";
import Pagination from "../../components/common/Pagination";
import { supabase } from "../../lib/supabase";
//import { Pagination } from "swiper/modules";

const PRODUCTS_PER_PAGE = 8;

export default function ShopBoard() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 카테고리 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId]);

  // 상품 및 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        /*
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:5000/products"),
          axios.get("http://localhost:5000/categories"),
        ]);*/

        const [productsRes, categoriesRes] = await Promise.all([
          supabase.from("products").select("*"),
          supabase.from("category").select("*")
        ]);

        if (productsRes.error) throw productsRes.error;
        if (categoriesRes.error) throw categoriesRes.error;


        const allProducts = productsRes.data;
        const allCategories = categoriesRes.data;
        setCategories(allCategories);

        let filtered = [];
        let selected = null;

        if (categoryId === "all") {
          filtered = allProducts;
        } else if (categoryId === "best") {
          filtered = allProducts.filter((prd) => prd.isBest);
        } else if (categoryId === "new") {
          filtered = allProducts.filter((prd) => prd.isNew);
        } else {
          selected = allCategories.find(
            (cate) => Number(cate.id) === Number(categoryId)
          );

          if (selected) {
            const subCates = allCategories
              .filter((cate) => cate.parent_id == Number(selected.id))
              .map((cate) => Number(cate.id));

            if (selected.parent_id === null) {
              filtered = allProducts.filter((prd) =>
                subCates.includes(Number(prd.category))
              );
            } else {
              filtered = allProducts.filter(
                (prd) => Number(prd.category) === Number(selected.id)
              );
            }
          }
        }

        setCurrentCategory(selected);
        setProducts(filtered);
      } catch (error) {
        console.error("데이터 불러오기 오류:", error);
      }
    };

    fetchData();
  }, [categoryId]);

  // 페이지네이션 계산
  const { paginatedProducts, totalPages } = useMemo(() => {
    const isPaginatable = !["best", "new"].includes(categoryId);

    if (isPaginatable) {
      const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;
      const paginated = products.slice(startIndex, endIndex);
      const total = Math.ceil(products.length / PRODUCTS_PER_PAGE);

      return { paginatedProducts: paginated, totalPages: total };
    }

    return { paginatedProducts: products, totalPages: 1 };
  }, [products, currentPage, categoryId]);

  return (
    <div className="section">
      <CategoryList
        categories={categories}
        currentCategory={currentCategory}
      />

      {categoryId === "all" && products.some((prd) => prd.isBest) && (
        <PrdList title="Best Seller" products={products.filter(p => p.isBest)} useSwiper={true} />
      )}

      {categoryId === "all" && products.some((prd) => prd.isNew) && (
        <PrdList title="New" products={products.filter(p => p.isNew)} useSwiper={true} />
      )}

      {/* 상품 목록 */}
      <PrdList
        title={
          categoryId === "best"
            ? "Best Seller"
            : categoryId === "new"
              ? "New"
              : currentCategory?.name || "전체 목록"
        }
        products={paginatedProducts}
        useSwiper={false}
        limit={8}
      />

      {/* ✅ 페이지네이션 컴포넌트로 교체 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(num) => {
          setCurrentPage(num);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}
