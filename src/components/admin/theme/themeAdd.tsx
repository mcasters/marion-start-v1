import React, { useState } from "react";
import { createTheme } from "~/server-functions/theme";
import { Route } from "~/routes/admin";

export default function ThemeAdd() {
  const {
    adminContext: { workTheme, setWorkTheme, setThemes, themes, setIsSaved },
    useAlert,
  } = Route.useRouteContext();
  const [themeName, setThemeName] = useState<string>("");

  const handleAdd = async () => {
    if (themeName === "")
      useAlert("Le nom du nouveau thème est manquant", true);
    else {
      const { theme, message, isError } = await createTheme({
        data: {
          ...workTheme,
          name: themeName,
          isActive: false,
        },
      });
      if (theme) {
        setThemes([...themes, theme]);
        setWorkTheme(theme);
        setIsSaved(true);
        setThemeName("");
      }
      useAlert(message, isError);
    }
  };

  return (
    <>
      <input
        name="newTheme"
        required
        placeholder="Nom du nouveau thème"
        type="text"
        value={themeName}
        onChange={(e) => {
          setThemeName(e.target.value);
        }}
        style={{
          width: "230px",
        }}
      />
      <button
        onClick={handleAdd}
        className="adminButton"
        style={{ marginLeft: "0" }}
      >
        Sauvegarder en nouveau thème
      </button>
    </>
  );
}
