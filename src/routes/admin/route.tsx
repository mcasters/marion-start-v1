import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminProvider } from "~/components/admin/context/adminProvider";
import {
  getActiveTheme,
  getPresetColors,
  getThemes,
} from "~/server-functions/theme";
import * as React from "react";
import { AlertProvider } from "~/components/admin/context/alertProvider";
import { getSession } from "~/server-functions/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => await getSession(),
  loader: async ({ context }) => {
    if (!context.session)
      throw redirect({
        to: "/login",
      });
    const themes = await getThemes();
    const activeTheme =
      themes.find((t) => t.isActive) || (await getActiveTheme());
    const presetColors = await getPresetColors();
    return { themes, activeTheme, presetColors };
  },
  component: RouteComponent,
});

async function RouteComponent() {
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
