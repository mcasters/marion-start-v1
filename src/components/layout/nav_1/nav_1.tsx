"use client";

import { MENU_1_ITEMS } from "~/constants/specific/routes";
import s from "~/components/layout/nav_1/nav_1.module.css";
import { getDarkerColor } from "~/utils/themeUtils";
import { getHomeLayout } from "~/utils/commonUtils";
import { HomeLayout } from "~/lib/type";
import { Link, useLocation } from "@tanstack/react-router";
import { Route } from "~/routes/__root";

type Props = {
  fixed: boolean;
  themePage: "work" | "home" | "other";
};

export default function Nav_1({ fixed, themePage }: Props) {
  const { metas, theme } = Route.useRouteContext();
  const location = useLocation();
  const isPlainHomeLayout = getHomeLayout(metas) === HomeLayout.PLAIN;

  return (
    <nav
      className={fixed ? `${s.fixed} ${s.nav} nav1` : `${s.nav} nav1`}
      style={{
        backgroundColor: fixed ? theme[themePage].menu1.background : undefined,
        borderBottomColor: fixed
          ? getDarkerColor(theme[themePage].menu1.background, -40)
          : undefined,
      }}
    >
      <div className={s.parent}>
        <ul
          className={s.ul}
          style={{
            borderBottomColor: fixed
              ? undefined
              : getDarkerColor(theme.home.menu1.background, -20),
          }}
        >
          {MENU_1_ITEMS.map((item) => {
            return (
              <li key={item.TAG}>
                <Link
                  to={item.ROUTE}
                  className={
                    item.ROUTE === location.pathname ? "active" : undefined
                  }
                >
                  {item.TAG}
                </Link>
              </li>
            );
          })}
        </ul>
        {themePage === "home" && !isPlainHomeLayout && (
          <div className={s.shadow} />
        )}
      </div>
      <style>{`
        .nav1 a {
          color: ${theme[themePage].menu1.link};
        }
        .nav1 a:hover {
          color: ${theme[themePage].menu1.linkHover};
        }
        .nav1 a.active {
          border-bottom: solid 2px ${theme[themePage].menu1.linkHover};
        }
      `}</style>
    </nav>
  );
}
