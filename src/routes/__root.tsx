import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";
import { HomeLayout, Session, StructTheme } from "~/lib/type";
import { useAlert } from "~/context/alertProvider";
import { getHomeLayout } from "~/utils/commonUtils";
import { ROUTES } from "~/constants/specific/routes";
import { hexToRgb } from "~/utils/themeUtils";
import s from "~/components/layout/layout.module.css";
import AuthStatus from "~/components/auth/authStatus";
import AdminNav from "~/components/layout/admin/adminNav";
import HomeHeader from "~/components/layout/homeHeader";
import { KEY_META } from "~/constants/admin";
import Header from "~/components/layout/header";
import Footer from "~/components/layout/footer";
import { getHomeText } from "~/server-functions/content";

interface MyRouterContext {
  metas: Map<string, string>;
  session: Session | null;
  theme: StructTheme;
  alert: ReturnType<typeof useAlert>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  loader: () => getHomeText(),
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title:
          "TanStack Start | Type-Safe, Client-First, Full-Stack React Framework",
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const introduction = Route.useLoaderData();
  const { metas, theme, session } = Route.useRouteContext();
  const location = useLocation();
  const path = location.pathname;
  const isPlainHomeLayout = getHomeLayout(metas) === HomeLayout.PLAIN;
  const isHome = path === ROUTES.HOME;
  const isWork =
    path.startsWith(ROUTES.PAINTING) ||
    path.startsWith(ROUTES.SCULPTURE) ||
    path.startsWith(ROUTES.DRAWING);
  const page = isHome ? "home" : isWork ? "work" : "other";
  const gradientRgbObject = hexToRgb(theme.home.menu1.background);
  const gradientRgb = `${gradientRgbObject?.r},${gradientRgbObject?.g},${gradientRgbObject?.b}`;

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <div
          className={s.wrapper}
          style={{
            backgroundColor: theme[page].main.background,
            color: theme[page].main.text,
          }}
        >
          <div
            className={s.line}
            style={{ backgroundColor: theme.general.lineColor }}
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
          {path === ROUTES.ADMIN ? (
            <AdminNav />
          ) : isHome ? (
            <HomeHeader
              isPlainHomeLayout={isPlainHomeLayout}
              title={metas.get(KEY_META.OWNER) || ""}
              introduction={introduction ?? ""}
            />
          ) : (
            <Header themePage={page} />
          )}
          <main className={isHome ? undefined : s.main}>{children}</main>
          <Footer themePage={page} />
          <style>{`
          a,
          .buttonLink,
          .iconButton {
            color: ${theme[page].main.link};
          }

          .icon {
            fill: ${theme[page].main.link};
          }

          a:hover,
          .buttonLink:hover,
          .iconButton:hover {
            color: ${theme[page].main.linkHover};
          }

          .icon:hover {
            fill: ${theme[page].main.linkHover};
          }

          .selected,
          ::selection {
            background: ${theme[page].menu2.link};
            color: antiquewhite;
          }

          .selected .icon {
            fill: antiquewhite;
          }
        `}</style>
        </div>
        <hr />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
