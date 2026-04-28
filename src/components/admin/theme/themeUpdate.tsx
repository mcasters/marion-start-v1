import { THEME } from "~/constants/admin";
import { updateTheme } from "~/server-functions/theme";
import { useAlert } from "~/components/admin/context/alertProvider";
import { useAdminContext } from "~/components/admin/context/adminProvider";

export default function ThemeUpdate() {
  const { workTheme, setIsSaved, isSaved, setThemes, themes } =
    useAdminContext();
  const alert = useAlert();

  const handleUpdate = async () => {
    const res = await updateTheme({ data: workTheme });
    if (!res.isError) {
      const updatedThemes = themes.map((t) =>
        t.id === workTheme.id ? workTheme : t,
      );
      setThemes(updatedThemes);
      setIsSaved(true);
    }
    alert(res.message, res.isError);
  };

  return (
    <button
      onClick={handleUpdate}
      className="adminButton"
      disabled={workTheme.name === THEME.BASE_THEME_NAME || isSaved}
    >
      {`Sauvegarder le thème "${workTheme.name}"`}
    </button>
  );
}
