import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/reset.css"
import "../../../styles/font.css"
import "./Header.css";

import myIcon from "../../../assets/images/pc_my.png"
import cartIcon from "../../../assets/images/pc_cart.png"
import wishIcon from "../../../assets/images/wish.png"
import logo from "../../../assets/images/logo1.png"
import moreBtn from "../../../assets/images/menu_open.png"
import closeBtn from "../../../assets/images/menu_close.png"

// 메뉴 데이터

// 유틸메뉴
const utilMenus = [
  {
    key: "my",
    icon: myIcon,
    to: "#",
    children: [
      { key: 1, label: "회원가입", to: "/join" },
      { key: 2, label: "로그인", to: "/login" },
      { key: 3, label: "마이페이지", to: "/bbs/login.php" },
    ],
  },
  {
    key: "cart",
    icon: cartIcon,
    to: "/bbs/login.php",
    badge: 0, // 장바구니 갯수
  },
  {
    key: "wish",
    icon: wishIcon,
    to: "/bbs/login.php",
  },
];

const allMenus = [
  {
    key: 1,
    label: "전체상품보기",
    to: "/",
  },
  {
    key: 2,
    label: "GLOWLY",
    to: "/",
    children: [{ label: "브랜드소개", to: "" }, { label: "인증사항", to: "" }]
  },
  {
    key: 3,
    label: "스킨케어",
    to: "/shop/10",
    children: [{ label: "스킨/토너", to: "/shop/1010" }, { label: "로션", to: "/shop/1020" }, { label: "크림", to: "/shop/1030" }]
  },
  {
    key: 4,
    label: "메이크업",
    to: "/shop/20",
    children: [{ label: "베이스", to: "/shop/2010" }, { label: "아이", to: "/shop/2020" }, { label: "립", to: "/shop/2030" }]
  },
  {
    key: 5,
    label: "헤어케어",
    to: "/shop/30",
    children: [{ label: "샴푸", to: "/shop/3010" }, { label: "린스", to: "/shop/3020" }, { label: "트리트먼트", to: "/shop/3030" }]
  },
  {
    key: 6,
    label: "바디케어",
    to: "/shop/40",
    children: [{ label: "로션", to: "/shop/4010" }, { label: "핸드케어", to: "/shop/4020" }, { label: "풋케어", to: "/shop/4030" }]
  },
  {
    key: 7,
    label: "고객센터",
    to: "/",
    children: [{ label: "공지사항", to: "/" }]
  },
  {
    key: 8,
    label: "마이페이지",
    to: "/",
    children: [{ label: "회원가입", to: "/" }]
  },
]

export default function Header({ className, onMouseEnter, onMouseLeave }) {

  const [openMenu, setOpenMenu] = useState(null)
  const [openUtil, setOpenUtil] = useState(null)
  const [openAllMenu, setOpenAllMenu] = useState(false)
  const [openMobile, setOpenMobile] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState([]);

  const toggleMenu = () => {
    setOpenAllMenu((prev) => !prev);
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

  return (
    <header
      className={`pc_header ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>

      <div className="pc_header_in">

        {/* 로고 */}
        <div className={`mobile_btn ${openMobile ? "on" : ""}`} onClick={toggleMobileMenu}>
          <span className="b"></span>
          <span className="t"></span>
          <span className="n"></span>
        </div>

        <Link to="/" className="logo">
          <h1>
            <img src={logo} />
          </h1>
        </Link>



        <div className="pc_header_nav">
          <div onClick={toggleMenu} className={`pc_btn ${openAllMenu ? "on" : ""}`}>
            <span className="b"></span>
            <span className="t"></span>
            <span className="n"></span>
          </div>

          <ul className="pc_menu">
            {menus.map((menu) => (
              // menu.key를 최상위 li에 할당합니다.
              <li
                key={menu.key} // 👈 menu.key를 최상위 li에 할당
                onMouseEnter={menu.children ? () => setOpenMenu(menu.key) : undefined} // children이 있을 때만 이벤트 추가
                onMouseLeave={menu.children ? () => setOpenMenu(null) : undefined}
              >
                <Link to={menu.to}>{menu.label}</Link>

                {/* children이 있을 경우에만 sub menu 렌더링 */}
                {menu.children && (
                  <ul
                    className="pc_sub_menu"
                    style={{ display: openMenu === menu.key ? "block" : "none" }}
                  >
                    {menu.children.map((child) => (
                      // child.label을 key로 사용하거나 고유 ID를 사용해야 합니다.
                      <li key={child.label}>
                        <Link to={child.to}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <ul className="pc_util">
            {utilMenus.map((menu) => (
              <li className="pc_utilmy"
                key={menu.key}
                onMouseEnter={menu.children ? () => setOpenUtil(menu.key) : undefined}
                onMouseLeave={menu.children ? () => setOpenUtil(null) : undefined}
              >
                <Link to={menu.to}>
                  <img src={menu.icon} />
                </Link>
                {menu.children && (
                  <ul className="pc_utilmy_in"
                    style={{ display: openUtil === menu.key ? "block" : "none" }}
                  >
                    {menu.children.map((child) => (
                      <li key={child.key}>
                        <Link to={child.to}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                )
                }
              </li>
            ))}
          </ul>
        </div>

        <div className={`mobile_open ${openMobile ? "active" : ""}`}>
          <div className="open_in">
            <ul className="mobile_menu">
              {menus.map((menu) => (
                <li key={menu.key}>
                  <div
                    className="mobile_menu_item"
                    onClick={() => menu.children && toggleSubMenu(menu.key)} >
                    <Link to={menu.to || "#"}>
                      {menu.label}
                      {menu.children && (
                        <span className={`more_img ${openSubMenus === menu.key ? "on" : ""}`}>
                          <img src={openSubMenus === menu.key ? closeBtn : moreBtn} />
                        </span>
                      )}
                    </Link>
                  </div>
                  {menu.children && (
                    <ul className={`mobile_sub_menu ${openSubMenus.includes(menu.key)  ? "active" : ""}`}>
                      {menu.children.map((child) => (
                        <li key={child.label}>
                          <Link to={child.to}>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}

            </ul>
            <div className="mobile_util">
              <div>
                <Link to>
                  <p><img src={myIcon} /></p>
                  <p>로그인</p>
                </Link>
              </div>
              <div>
                <Link to>
                  <p><img src={myIcon} /></p>
                  <p>회원가입</p>
                </Link>
              </div>
              <div>
                <Link to>
                  <p><img src={cartIcon} /></p>
                  <p>장바구니</p>
                </Link>
              </div>
              <div>
                <Link to>
                  <p><img src={wishIcon} /></p>
                  <p>위시리스트</p>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div
        className={`pc_allmenu ${openAllMenu ? "open" : ""}`}
      >
        <div className="pc_allmenu_in">
          <ul>
            {allMenus.map((menu) => (
              <li key={menu.key}>
                <Link to={menu.to}>{menu.label}</Link>

                {menu.children && (
                  <ul>
                    {menu.children.map((child) => (
                      <li key={child.label}>
                        <Link to={child.to}>
                          {child.label}
                        </Link>
                      </li>
                    ))}

                  </ul>
                )}
              </li>

            ))}
          </ul>
        </div>
      </div>



    </header>
  );
}
