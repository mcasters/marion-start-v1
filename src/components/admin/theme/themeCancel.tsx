import React from "react";
import { Theme } from "~/lib/type";
import { Route } from "~/routes/admin";

export default function ThemeCancel() {
  const {
    adminContext: { workTheme, setWorkTheme, setIsSaved, isSaved, themes },
  } = Route.useRouteContext();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setWorkTheme(themes.find((t) => t.id === workTheme.id) as Theme);
        setIsSaved(true);
      }}
      className="adminButton"
      disabled={isSaved}
    >
      Annuler les changements
    </button>
  );
}
