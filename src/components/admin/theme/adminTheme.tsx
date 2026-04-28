import s from "~/components/admin/admin.module.css";
import ThemeSelect from "~/components/admin/theme/ThemeSelect";
import ThemeActivate from "~/components/admin/theme/themeActivate";

export default function AdminTheme() {
  return (
    <>
      <h3 className={s.title3}>Thèmes :</h3>
      <ThemeSelect />
      <ThemeActivate />
      {/*  <ThemeDelete />
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
      <PresetColorDashboard />*/}
    </>
  );
}
