import { ADMIN_MENU } from "~/constants/specific/routes";
import s from "~/components/layout/admin/adminNav.module.css";
import { Link, useLocation } from "@tanstack/react-router";

export default function AdminNav() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className={s.nav}>
      <span>Administration</span>
      <ul>
        {ADMIN_MENU.map((item) => {
          const isActive = pathname === item.ROUTE;

          return (
            <li key={item.TAG}>
              <Link
                to={item.ROUTE}
                key={item.TAG}
                className={isActive ? `${s.link} ${s.active}` : `${s.link}`}
              >
                {item.TAG}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
