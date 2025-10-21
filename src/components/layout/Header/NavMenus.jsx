import { Link } from "react-router-dom";

export default function NavMenus({ menus, openMenu, setOpenMenu }) {

  return (
    <ul className="pc_menu">
      {menus.map((menu) => (
        <li
          key={menu.key}
          onMouseEnter={menu.children ? () => setOpenMenu(menu.key) : undefined}
          onMouseLeave={menu.children ? () => setOpenMenu(null) : undefined}
        >
          <Link to={menu.to}>{menu.label}</Link>

          {menu.children && (
            <ul
              className="pc_sub_menu"
              style={{ display: openMenu === menu.key ? "block" : "none" }}
            >
              {menu.children.map((child) => (
                <li key={child.label}>
                  <Link to={child.to}>{child.label}</Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
