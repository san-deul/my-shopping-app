// routes/router.jsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout/Layout";
import Home from "../pages/Home/Home";
import Join from "../pages/Auth/Join";
import Login from "../pages/Auth/Login";
import ReviewBoard from "../pages/Board/ReviewBoard";
import ShopBoard from "../pages/Board/ShopBoard";
import NotFound from "../components/layout/Etc/NotFound";
import NoticeBoard from "../pages/Board/NoticeBoard";
import NoticeDetail from "../components/Board/NoticeDetail";
import PrivateRoute from "../components/common/PrivateRoute";
import ProductDetailPage from "../pages/Product/ProductDetailPage";
import OrderPage from "../pages/Order/OrderPage";
import CartPage from "../pages/Cart/CartPage";
import MyPage from "../pages/Auth/MyPage";
import OrderListPage from "../pages/Order/OrderListPage";
import ReviewWrite from "../pages/Board/ReviewWrite";
import NoticeWrite from "../pages/Board/NoticeWrite";
import MypageModify from "../pages/Auth/MyPageModify";
// import CreateAdmin from "../pages/CreateAdmin";


export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/join", element: <Join />, handle: {title:"회원가입"} },
      { path: "/login", element: <Login />, handle: {title:"로그인"} },
      {/* path: "/mypage", element: <MyPage /> , handle: {title:"마이페이지"} */},
      { path: "/mypage", element: <PrivateRoute element={<MyPage />} />, handle: { title: "마이페이지" } },
      { path: "/mypage/modify", element: <MypageModify /> , handle: {title:"마이페이지"} },
      { path: "/cart", element: <CartPage /> , handle: {title:"장바구니"} },
      { path: "/mypage/orders", element: <OrderListPage /> , handle: {title:"주문내역"} },
      { path: "/mypage/orders2", element: <OrderPage /> , handle: {title:"주문내역"} },

      // 제품 관련
      { path: "/shop/:categoryId", element: <ShopBoard />, handle: {title:""} },
      { path: "/item/:id", element: <ProductDetailPage />, handle: {title:"상품상세페이지"} },
      { path: "/order", element: <OrderPage />, handle: {title:"상품구매"} },


      // 이외 게시판
      { path: "/review", element: <ReviewBoard />, handle: {title:"사용후기"} },
      { path: "/review/write", element: <ReviewWrite />, handle: {title:"사용후기"} },
      { path: "/notice", element: <NoticeBoard />, handle: {title:"공지사항"} },
      { path: "/notice/:id", element: <NoticeDetail />, handle: {title:"공지사항"} },
      { path: "/notice/write", element: <NoticeWrite />, handle: {title:"공지사항"} },

       // ✅ 관리자 계정 생성 페이지 추가
      {/* path: "/create-admin", element: <CreateAdmin />, handle: { title: "관리자 계정 생성" } */},
      


    ],
  },
  { path: "*", element: <NotFound /> },
]);
