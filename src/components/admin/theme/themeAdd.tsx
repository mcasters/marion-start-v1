import { useState } from "react";
import { createTheme } from "~/server-functions/theme";
import { useAdminContext } from "~/components/admin/context/adminProvider";
import { useAlert } from "~/components/admin/context/alertProvider";

export default function ThemeAdd() {
  const { workTheme, setWorkTheme, setThemes, themes, setIsSaved } =
    useAdminContext();
  const alert = useAlert();
  const [themeName, setThemeName] = useState<string>("");

  const handleAdd = async () => {
    if (themeName === "") alert("Le nom du nouveau thème est manquant", true);
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
      alert(message, isError);
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
