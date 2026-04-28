import { Theme } from "~/lib/type";
import { useAdminContext } from "~/components/admin/context/adminProvider";

export default function ThemeCancel() {
  const { workTheme, setWorkTheme, setIsSaved, isSaved, themes } =
    useAdminContext();

  return (
    <button
      onClick={() => {
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
