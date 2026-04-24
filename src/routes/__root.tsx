import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";
import { Session, StructTheme } from "~/lib/type";
import { useAlert } from "~/context/alertProvider";

interface MyRouterContext {
  metas: Map<string, string>;
  session: Session | null;
  theme: StructTheme;
  alert: ReturnType<typeof useAlert>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
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
  const { session } = Route.useRouteContext();
  console.log("__root :", session);
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>{" "}
          <Link
            to="/posts"
            activeProps={{
              className: "font-bold",
            }}
          >
            Posts
          </Link>{" "}
          <Link
            to="/users"
            activeProps={{
              className: "font-bold",
            }}
          >
            Users
          </Link>{" "}
          <Link
            to="/route-a"
            activeProps={{
              className: "font-bold",
            }}
          >
            Pathless Layout
          </Link>{" "}
          <Link
            to="/presentation"
            activeProps={{
              className: "font-bold",
            }}
          >
            Présentation
          </Link>{" "}
          <Link
            to="/peintures"
            activeProps={{
              className: "font-bold",
            }}
          >
            Peintures
          </Link>{" "}
          <Link
            to="/sculptures"
            activeProps={{
              className: "font-bold",
            }}
          >
            Sculptures
          </Link>{" "}
          <Link
            to="/dessins"
            activeProps={{
              className: "font-bold",
            }}
          >
            Dessins
          </Link>{" "}
          <Link
            to="/admin"
            activeProps={{
              className: "font-bold",
            }}
          >
            Admin
          </Link>{" "}
          <Link
            // @ts-expect-error
            to="/this-route-does-not-exist"
            activeProps={{
              className: "font-bold",
            }}
          >
            This Route Does Not Exist
          </Link>
        </div>
        <hr />
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
