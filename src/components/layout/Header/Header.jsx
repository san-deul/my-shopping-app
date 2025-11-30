import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/reset.css"
import "../../../styles/font.css"
import "./Header.css";

// 메뉴데이터
import { allMenus, mobileMenus, navMenus, utilMenus } from "../../../data/menuData";
import NavMenus from "./NavMenus";



import logo from "../../../assets/images/logo.png"
import AllMenus from "./AllMenus";
import UtilMenus from "./UtilMenus";
import MobileMenus from "./MobileMenus";
import MobileUtil from "./MobileUtil";
import useAuth from "../../../hooks/useAuth";
import { supabase } from "../../../lib/supabase";


export default function Header({ className, onMouseEnter, onMouseLeave, onAllMenuToggle }) {

  const [openMenu, setOpenMenu] = useState(null)
  const [openUtil, setOpenUtil] = useState(null)
  const [openAllMenu, setOpenAllMenu] = useState(false)
  const [openMobile, setOpenMobile] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState([]);

  const toggleMenu = () => {
    setOpenAllMenu((prev) => {
      const newState = !prev;
      if (onAllMenuToggle) onAllMenuToggle(newState); // ✅ Layout에 전달
      return newState;
    });
  }

  const toggleMobileMenu = () => {
    setOpenMobile((prev) => !prev);
  };

  const toggleSubMenu = (key) => {
    // 이미 열린 메뉴를 다시 클릭하면 닫히게
    setOpenSubMenus((prev) => {
      // 이미 열려있으면 닫기
      if (prev.includes(key)) {
        return prev.filter((item) => item !== key);
      } else {
        // 안 열려있으면 추가
        return [...prev, key];
      }
    });
  };


  useEffect(() => {
    // openAllMenu가 true(열려있는 상태)일 때만 setOpenAllMenu(false)를 호출하여 닫습니다.
    if (openAllMenu) {
      setOpenAllMenu(false);
      if (onAllMenuToggle) onAllMenuToggle(false);
    }
    // 의존성 배열에 location.pathname을 넣으면 경로가 바뀔 때마다 이 훅이 실행됩니다.
  }, [location.pathname]); // 👈 location.pathname이 바뀔 때마다 실행

  // 이전 단계에서 추가했던 closeAllMenu 함수 및 모든 onClick 핸들러를 제거하고
  // useEffect에 모든 것을 맡기거나, allMenu 내부에만 onClick을 남겨도 됩니다.
  // 여기서는 useEffect에 맡기는 방식으로 정리했습니다.


  useEffect(() => {
    if (openMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // cleanup
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openMobile]);


  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("로그아웃 되었습니다.");
  };


  const dynamicUtilMenus = utilMenus.map((menu) => {
    if (menu.key === "my") {
      // 로그인 상태별로 children 다르게 설정
      const children = !user
        ? [
          { key: 1, label: "회원가입", to: "/join" },
          { key: 2, label: "로그인", to: "/login", state: { from: location.pathname }, },
        ]
        : [
          { key: 3, label: "마이페이지", to: "/mypage" },
          { key: 4, label: "로그아웃", to: "#", onClick: handleLogout },
        ];
      return { ...menu, children };
    }
    return menu;
  });

  return (
    <header
      className={` ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>

      <div className="header_in">

        {/* 로고 */}
        <div className={`mobile_btn ${openMobile ? "on" : ""}`} onClick={toggleMobileMenu}>
          <span className="b"></span>
          <span className="t"></span>
          <span className="n"></span>
        </div>

        <Link to="/" className="logo">
          <h1>
            {<img src={logo} />}
            
          </h1>
        </Link>



        <div className="pc_header_nav">
          <div onClick={toggleMenu} className={`pc_btn ${openAllMenu ? "on" : ""}`}>
            <span className="b"></span>
            <span className="t"></span>
            <span className="n"></span>
          </div>

          <NavMenus menus={navMenus} openMenu={openMenu} setOpenMenu={setOpenMenu} />
          {<UtilMenus menus={dynamicUtilMenus} openUtil={openUtil} setOpenUtil={setOpenUtil} />}


        </div>

        <div className={`mobile_open ${openMobile ? "active" : ""}`}>
          <div className="open_in">
            <MobileMenus
              menus={mobileMenus} // 전체 메뉴 데이터를 모바일 메뉴에 전달
              toggleSubMenu={toggleSubMenu}
              openSubMenus={openSubMenus}
              closeMobileMenu={toggleMobileMenu} />
            <MobileUtil
              closeMobileMenu={toggleMobileMenu}
            />
          </div>
        </div>

      </div>
      <AllMenus menus={allMenus} openAllMenu={openAllMenu} />


    </header>
  );
}
