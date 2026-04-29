import { THEME } from "~/constants/admin";
import { Theme } from "~/lib/type";
import { deleteThemeFn } from "~/server-functions/theme";
import { useAdminContext } from "~/components/admin/context/adminProvider";
import { useAlert } from "~/components/admin/context/alertProvider";

export default function ThemeDelete() {
  const { workTheme, setWorkTheme, setThemes } = useAdminContext();
  const alert = useAlert();

  const handleDelete = async () => {
    const { message, isError, updatedThemes } = await deleteThemeFn({
      data: { id: workTheme.id },
    });
    if (updatedThemes) {
      setThemes(updatedThemes);
      setWorkTheme(updatedThemes.find((t) => t.isActive) as Theme);
    }
    alert(message, isError);
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
