import { Link, useLocation, useNavigate } from "react-router-dom";

export default function UtilMenus({ menus, openUtil, setOpenUtil }) {


  return (
    <ul className="pc_util">
      {menus.map((menu) => (
        <li
          className="pc_utilmy"
          key={menu.key}
          onMouseEnter={menu.children ? () => setOpenUtil(menu.key) : undefined}
          onMouseLeave={menu.children ? () => setOpenUtil(null) : undefined}
        >
          <Link to={menu.to}>
            <img src={menu.icon} alt={menu.key} />
          </Link>

          {menu.children && (
            <ul
              className="pc_utilmy_in"
              style={{ display: openUtil === menu.key ? "block" : "none" }}
            >
              {menu.children.map((child) => (
                <li key={child.key}>
                  {child.onClick ? (
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        child.onClick();
                      }}
                    >
                      {child.label}
                    </Link>
                  ) : (
                    <Link to={child.to} state={child.state}>{child.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
