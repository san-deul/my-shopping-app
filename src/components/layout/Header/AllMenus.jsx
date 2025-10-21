import { Link } from "react-router-dom";


export default function AllMenus({ menus, openAllMenu }) {
  return (
    <div className={`pc_allmenu ${openAllMenu ? "open" : ""}`}>
      <div className="pc_allmenu_in">
        <ul>
          {menus.map((menu) => (
            <li key={menu.key}>
              <Link to={menu.to}>{menu.label}</Link>

              {menu.children && (
                <ul>
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
      </div>
    </div>
  );
}
