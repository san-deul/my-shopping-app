import { Link } from "react-router-dom";
import moreBtn from "../../../assets/images/menu_open.png";
import closeBtn from "../../../assets/images/menu_close.png";

export default function MobileMenus({
  menus,
  toggleSubMenu,
  openSubMenus,
  closeMobileMenu
}) {
  return (
    <ul className="mobile_menu">
      {menus.map((menu) => {
        const isOpen = openSubMenus.includes(menu.key);
        const hasChildren = !!menu.children;

        return (
          <li key={menu.key}>
            <div
              className="mobile_menu_item"
              onClick={() => hasChildren && toggleSubMenu(menu.key)}
            >
              {/* 
                hasChildren이 있으면 단순 텍스트 + 아이콘만,
                없으면 Link로 이동 가능
              */}
              {hasChildren ? (
                <>
                  <span className="menu_label">{menu.label}</span>
                  <span className={`more_img ${isOpen ? "on" : ""}`}>
                    <img
                      src={isOpen ? closeBtn : moreBtn}
                      alt="토글 버튼"
                    />
                  </span>
                </>
              ) : (
                <Link to={menu.to || "#"} onClick={closeMobileMenu}>
                  {menu.label}
                </Link>
              )}
            </div>

            {/* 서브 메뉴 목록 */}
            {hasChildren && (
              <ul className={`mobile_sub_menu ${isOpen ? "active" : ""}`}>
                {menu.children.map((child) => (
                  <li key={child.label}>
                    <Link to={child.to} onClick={closeMobileMenu}>
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
