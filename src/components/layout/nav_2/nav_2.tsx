import { MENU_2 } from "~/constants/specific/routes";
import s from "~/components/layout/nav_2/nav_2.module.css";
import { KEY_META } from "~/constants/admin";
import LogoIconT from "~/components/icons/logoIconT";
import LogoIconM from "~/components/icons/logoIconM";
import { Link, rootRouteId, useRouteContext } from "@tanstack/react-router";

interface Props {
  fixed: boolean;
  themePage: "work" | "home" | "other";
}

export default function Nav_2({ fixed, themePage }: Props) {
  const { metas, structTheme } = useRouteContext({ from: rootRouteId });
  const owner = metas.get(KEY_META.OWNER);

  return (
    <nav
      className={fixed ? `${s.fixed} ${s.nav} fixed nav2` : `${s.nav} nav2`}
      style={{
        backgroundColor: fixed
          ? themePage === "home"
            ? structTheme.home.menu2.background + "aa"
            : structTheme[themePage].menu2.background
          : undefined,
      }}
    >
      <ul className={s.ul}>
        {MENU_2.map((menuItem) => {
          if (menuItem.TAG === "Home")
            return (
              <li key={menuItem.TAG}>
                <Link to={menuItem.ROUTE} key={menuItem.TAG}>
                  {owner?.startsWith("T") && (
                    <LogoIconT width={30} height={30} />
                  )}
                  {owner?.startsWith("M") && (
                    <LogoIconM width={35} height={35} />
                  )}
                </Link>
              </li>
            );
          return (
            <li key={menuItem.TAG}>
              <Link to={menuItem.ROUTE} key={menuItem.TAG}>
                {menuItem.TAG}
              </Link>
            </li>
          );
        })}
      </ul>
      <style>{`
        .nav2 a {
          color: ${structTheme[themePage].menu2.link};
        }

        .nav2 a:hover {
          color: ${structTheme[themePage].menu2.linkHover};
        }

        .homeIcon {
          fill: ${structTheme[themePage].menu1.link};
        }

        .homeIcon:hover {
          fill: ${structTheme[themePage].menu1.linkHover};
        }
      `}</style>
    </nav>
  );
}
