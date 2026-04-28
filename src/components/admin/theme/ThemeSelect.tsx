import React from "react";
import { Theme } from "~/lib/type";
import { useAdminContext } from "~/components/admin/context/adminProvider";

export default function ThemeSelect() {
  const { workTheme, setWorkTheme, themes } = useAdminContext();

  return (
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
  );
}
