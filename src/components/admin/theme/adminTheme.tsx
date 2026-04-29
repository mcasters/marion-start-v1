import s from "~/components/admin/admin.module.css";
import themeStyle from "./adminTheme.module.css";
import ThemeSelect from "~/components/admin/theme/ThemeSelect";
import PresetColorDashboard from "~/components/admin/theme/dashboard/presetColor/presetColorDashboard";
import ThemeCancel from "~/components/admin/theme/themeCancel";
import ThemeUpdate from "~/components/admin/theme/themeUpdate";
import ThemeAdd from "~/components/admin/theme/themeAdd";
import Dashboard from "~/components/admin/theme/dashboard/dashboard";
import ThemeDelete from "~/components/admin/theme/themeDelete";

export default function AdminTheme() {
  return (
    <>
      <h3 className={s.title3}>Thèmes :</h3>
      <ThemeSelect />
      <ThemeDelete />
      <div className="smallSeparate" />
      <h3 className={s.title3}>Détail du thème sélectionné :</h3>
      <Dashboard />
      <div className={themeStyle.actionContainer}>
        <ThemeAdd />
        <ThemeUpdate />
        <ThemeCancel />
      </div>
      <div className="smallSeparate" />
      <h3 className={s.title3}>Couleurs mémorisées</h3>
      <PresetColorDashboard />
    </>
  );
}
