import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import SubTitle from "../SubTitle/SubTitle";
import "../../../styles/default.css"
import Footer from "../Footer/Footer";
import { useEffect, useState } from "react";
import { LoadingProvider } from "../../../context/LoadingContext";

function Layout() {

  const location = useLocation(); // 현재 라우트 정보를 가져옴
  const isMainPage = location.pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAllMenuOpen, setIsAllMenuOpen] = useState(false); 

  const handleScroll = () => {
    // 윈도우의 스크롤 위치가 120px을 초과하면 true로 설정
    if (window.scrollY > 120) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    if (isMainPage) {
      // 메인 페이지일 때만 리스너 등록
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      // 언마운트 시 또는 페이지 변경 시 리스너 해제 (메모리 누수 방지)
      if (isMainPage) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isMainPage]); // isMainPage가 변경될 때마다 재실행

  // 3. 더 단순하고 명확하게:
  let dynamicClass = '';

  if (isMainPage) {
    if (scrolled) {
      // 스크롤이 내려갔으면 무조건 흰색
      dynamicClass = "";
    } else {
      // 맨 위일 때
      if (isAllMenuOpen) {
        // allMenu 열렸을 때는 무조건 흰색
        dynamicClass = "";
      } else if (isHovered) {
        // hover 시 흰색
        dynamicClass = "";
      } else {
        // hover X + allMenu 닫힘 상태 → 투명
        dynamicClass = "main-header";
      }
    }
  } else {
    // 서브 페이지는 고정 흰색
    dynamicClass = "sub-header";
  }

  const headerClass = dynamicClass; // 최종 클래스
  const contentClass = isMainPage ? 'main-content' : 'subpage-content';


  return (
    <LoadingProvider>
      <Header
        className={`${headerClass}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)} 
        onAllMenuToggle={setIsAllMenuOpen} />

      <main className={`content-area ${contentClass}`}>
        <SubTitle />
        <Outlet /> {/* 여기에 페이지들이 바뀌면서 들어옴 */}
      </main>
      <Footer />

    </LoadingProvider>
  );
}

export default Layout;