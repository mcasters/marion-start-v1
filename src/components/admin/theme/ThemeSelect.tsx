import { Theme } from "~/lib/type";
import { useAdminContext } from "~/components/admin/context/adminProvider";
import { useAlert } from "~/components/admin/context/alertProvider";
import { activateThemeFn } from "~/server-functions/theme";
import { useRouter } from "@tanstack/react-router";

export default function ThemeSelect() {
  const { setThemes, workTheme, setWorkTheme, themes } = useAdminContext();
  const alert = useAlert();
  const router = useRouter();

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
    router.invalidate();
    alert(res.message, res.isError);
  };

  return (
    <>
      <select
        name="name"
        value={workTheme.id}
        onChange={(e) => {
          const selectedWorkTheme = themes.find(
            (t) => t.id === Number(e.target.value),
          ) as Theme;
          setWorkTheme(selectedWorkTheme);
        }}
        autoComplete="true"
        className="inputContainer"
      >
        {themes.map((t: Theme) => (
          <option key={t.id} value={t.id.toString()}>
            {`${t.name} ${t.isActive ? `(ACTIF)` : ""}`}
          </option>
        ))}
      </select>
      <button onClick={handleActivate} className="adminButton">
        Activer
      </button>
    </>
  );
}
