import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
import { getMetas } from "~/server-functions/meta";
import { getSession } from "~/server-functions/auth";
import { getActiveTheme } from "~/server-functions/theme";

export async function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    context: {
      metas: await getMetas(),
      session: await getSession(),
      theme: await getActiveTheme(),
      alert: undefined!,
    },
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
  });
}
