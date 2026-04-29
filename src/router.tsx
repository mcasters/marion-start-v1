import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
import { getMetasFn } from "~/server-functions/meta";
import { getSessionFn } from "~/server-functions/auth";
import { getActiveThemeFn, getPresetColorsFn } from "~/server-functions/theme";
import { getStructHexaTheme } from "~/utils/themeUtils";

export async function getRouter() {
  const theme = await getActiveThemeFn();
  const presetColors = await getPresetColorsFn();
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    context: {
      metas: await getMetasFn(),
      session: await getSessionFn(),
      structTheme: getStructHexaTheme(theme, presetColors),
    },
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
  });
}
