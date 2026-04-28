import s from "../adminTheme.module.css";
import { THEME_LABEL } from "~/constants/admin";
import { getStructuredTheme } from "~/utils/themeUtils";
import SubDashboard from "~/components/admin/theme/dashboard/subDashboard";
import { useAdminContext } from "~/components/admin/context/adminProvider";

export default function Dashboard() {
  const { workTheme, isSaved } = useAdminContext();
  const structuredTheme = getStructuredTheme(workTheme);

  return (
    <>
      <section className={`${s.dashboard} ${isSaved ? undefined : s.toUpdate}`}>
        <section>
          <h4 className={s.sectionTitle}>{THEME_LABEL.general}</h4>
          <SubDashboard
            structuredTheme={structuredTheme}
            themeKey={"general"}
          />
        </section>
        <section>
          <h4 className={s.sectionTitle}>{THEME_LABEL.home}</h4>
          <SubDashboard structuredTheme={structuredTheme} themeKey={"home"} />
        </section>
        <section>
          <h4 className={s.sectionTitle}>{THEME_LABEL.work}</h4>
          <SubDashboard structuredTheme={structuredTheme} themeKey={"work"} />
        </section>
        <section>
          <h4 className={s.sectionTitle}>{THEME_LABEL.other}</h4>
          <SubDashboard structuredTheme={structuredTheme} themeKey={"other"} />
        </section>
        <p>* lorsque la souris survole le texte</p>
      </section>
      {!isSaved && (
        <div className={s.message}>Thème modifié (à sauvegarder)</div>
      )}
    </>
  );
}
