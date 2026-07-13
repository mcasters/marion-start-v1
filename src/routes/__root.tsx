import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";
import { HomeLayout } from "~/lib/type";
import { getHomeLayout } from "~/utils/commonUtils";
import { ROUTES } from "~/constants/specific/routes";
import { getStructHexaTheme, hexToRgb } from "~/utils/themeUtils";
import Footer from "~/components/layout/footer";
import Header from "~/components/layout/header";
import { KEY_META } from "~/constants/admin";
import HomeHeader from "~/components/layout/homeHeader";
import AdminNav from "~/components/layout/admin/adminNav";
import AuthStatus from "~/components/auth/authStatus";
import s from "~/components/layout/layout.module.css";
import { getActiveThemeFn, getPresetColorsFn } from "~/server-functions/theme";
import { getMetasFn } from "~/server-functions/meta";
import { getCurrentSessionFn } from "~/server-functions/auth";
import { getHomeTextFn } from "~/server-functions/content";

export const Route = createRootRoute({
  // context
  beforeLoad: async () => {
    const theme = await getActiveThemeFn();
    const presetColors = await getPresetColorsFn();
    return {
      metas: await getMetasFn(),
      session: await getCurrentSessionFn(),
      structTheme: getStructHexaTheme(theme, presetColors),
    };
  },
  loader: async () => await getHomeTextFn(),
  head: () => ({
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/icon.svg",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "/logo-192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        href: "/logo-512.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#be2d01" },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  const { metas, session, structTheme } = Route.useRouteContext();
  const homeText = Route.useLoaderData();
  const location = useLocation();
  const path = location.pathname;
  const isPlainHomeLayout = getHomeLayout(metas) === HomeLayout.PLAIN;
  const isHome = path === ROUTES.HOME;
  const isWork =
    path.startsWith(ROUTES.PAINTING) ||
    path.startsWith(ROUTES.SCULPTURE) ||
    path.startsWith(ROUTES.DRAWING);
  const page = isHome ? "home" : isWork ? "work" : "other";
  const gradientRgbObject = hexToRgb(structTheme.home.menu1.background);
  const gradientRgb = `${gradientRgbObject?.r},${gradientRgbObject?.g},${gradientRgbObject?.b}`;

  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        <div
          className={s.wrapper}
          style={{
            backgroundColor: structTheme[page].main.background,
            color: structTheme[page].main.text,
          }}
        >
          <div
            className={s.line}
            style={{ backgroundColor: structTheme.general.lineColor }}
          ></div>
          {session && session.email && <AuthStatus email={session.email} />}
          {isHome && !isPlainHomeLayout && (
            <div
              className={s.gradient}
              style={{
                background: `
          linear-gradient(
            to top,
            rgba(${gradientRgb}, 0) 0%,
            rgba(${gradientRgb}, 0.013) 8.1%,
            rgba(${gradientRgb}, 0.049) 15.5%,
            rgba(${gradientRgb}, 0.104) 22.5%,
            rgba(${gradientRgb}, 0.175) 29%,
            rgba(${gradientRgb}, 0.259) 35.3%,
            rgba(${gradientRgb}, 0.352) 41.2%,
            rgba(${gradientRgb}, 0.45) 47.1%,
            rgba(${gradientRgb}, 0.55) 52.9%,
            rgba(${gradientRgb}, 0.648) 58.8%,
            rgba(${gradientRgb}, 0.741) 64.7%,
            rgba(${gradientRgb}, 0.825) 71%,
            rgba(${gradientRgb}, 0.896) 77.5%,
            rgba(${gradientRgb}, 0.951) 84.5%,
            rgba(${gradientRgb}, 0.987) 91.9%,
            rgb(${gradientRgb}) 100%
          )`,
              }}
            ></div>
          )}
          {path.startsWith(ROUTES.ADMIN) ? (
            <AdminNav />
          ) : isHome ? (
            <HomeHeader
              isPlainHomeLayout={isPlainHomeLayout}
              title={metas.get(KEY_META.OWNER) || ""}
              introduction={homeText || ""}
            />
          ) : (
            <Header themePage={page} />
          )}
          <main className={isHome ? undefined : s.main}>
            <Outlet />
          </main>
          <Footer themePage={page} />
          <style>{`
          a,
          .buttonLink,
          .iconButton {
            color: ${structTheme[page].main.link};
          }

          .icon {
            fill: ${structTheme[page].main.link};
          }

          a:hover,
          .buttonLink:hover,
          .iconButton:hover {
            color: ${structTheme[page].main.linkHover};
          }

          .icon:hover {
            fill: ${structTheme[page].main.linkHover};
          }

          .selected,
          ::selection {
            background: ${structTheme[page].menu2.link};
            color: antiquewhite;
          }

          .selected .icon {
            fill: antiquewhite;
          }
        `}</style>
        </div>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
