import React from "react";
import { THEME } from "~/constants/admin";

import { Theme } from "~/lib/type";
import { deleteTheme } from "~/server-functions/theme";
import { Route } from "~/routes/admin";

export default function ThemeDelete() {
  const {
    useAlert,
    adminContext: { workTheme, setWorkTheme, setThemes },
  } = Route.useRouteContext();

  const handleDelete = async () => {
    const { message, isError, updatedThemes } = await deleteTheme({
      data: { id: workTheme.id },
    });
    if (updatedThemes) {
      setThemes(updatedThemes);
      setWorkTheme(updatedThemes.find((t) => t.isActive) as Theme);
    }
    useAlert(message, isError);
  };

  return (
    <button
      disabled={workTheme.name === THEME.BASE_THEME_NAME}
      onClick={handleDelete}
      className="adminButton"
    >
      Supprimer
    </button>
  );
}
