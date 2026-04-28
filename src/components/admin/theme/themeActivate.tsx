import { Theme } from "~/lib/type";
import { activateThemeFn } from "~/server-functions/theme";
import { useAdminContext } from "~/components/admin/context/adminProvider";
import { useAlert } from "~/components/admin/context/alertProvider";

export default function ThemeActivate() {
  const { setThemes, workTheme, setWorkTheme, themes } = useAdminContext();
  const alert = useAlert();

  const handleActivate = async () => {
    const res = await activateThemeFn({ data: { id: workTheme.id } });
    setWorkTheme({ ...workTheme, isActive: true } as Theme);
    setThemes(
      themes.map((t) => {
        return t.id !== workTheme.id && t.isActive === true
          ? ({ ...t, isActive: false } as Theme)
          : t.id === workTheme.id
            ? ({ ...t, isActive: true } as Theme)
            : t;
      }),
    );
    alert(res.message, res.isError);
  };
  return (
    <>
      <button
        onClick={(e) => alert("coucou", false)}
      >{`${themes[0].isActive}`}</button>
      <button
        onClick={async (e) => {
          console.log("ENTER");
          e.preventDefault();
          await handleActivate();
        }}
        className="adminButton"
      >
        Activer
      </button>
    </>
  );
}
