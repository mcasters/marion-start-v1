import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminProvider } from "~/components/admin/context/adminProvider";
import {
  getActiveThemeFn,
  getPresetColorsFn,
  getThemes,
} from "~/server-functions/theme";
import * as React from "react";
import { AlertProvider } from "~/components/admin/context/alertProvider";
import { getSessionFn } from "~/server-functions/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    return { session: await getSessionFn() };
  },
  loader: async ({ context }) => {
    if (!context.session)
      throw redirect({
        to: "/login",
      });
    const themes = await getThemes();
    const activeTheme =
      themes.find((t) => t.isActive) || (await getActiveThemeFn());
    const presetColors = await getPresetColorsFn();
    return { themes, activeTheme, presetColors };
  },
  ssr: false,
  component: RouteComponent,
});

function RouteComponent() {
  const { themes, activeTheme, presetColors } = Route.useLoaderData();
  return (
    <AdminProvider
      defaultThemes={themes}
      defaultWorkTheme={activeTheme}
      defaultPresetColors={presetColors}
    >
      <AlertProvider>
        <Outlet />
      </AlertProvider>
    </AdminProvider>
  );
}
