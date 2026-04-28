import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
import { getMetas } from "~/server-functions/meta";
import { getSession } from "~/server-functions/auth";
import { getActiveTheme, getPresetColors } from "~/server-functions/theme";
import { getStructHexaTheme } from "~/utils/themeUtils";

export async function getRouter() {
  const theme = await getActiveTheme();
  const presetColors = await getPresetColors();
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    context: {
      metas: await getMetas(),
      session: await getSession(),
      structTheme: getStructHexaTheme(theme, presetColors),
      useAlert: undefined!,
      adminContext: undefined!,
    },
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
  });
}
