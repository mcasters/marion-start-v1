import s from "~/styles/page.module.css";

export function NotFound({ children }: { children?: any }) {
  return (
    <div className={s.errorWrapper}>
      <div>{children || <p>La page recherchée n'existe pas.</p>}</div>
      <br />
      <br />
      <p>
        <button onClick={() => window.history.back()} className="buttonLink">
          Précédent
        </button>
      </p>
    </div>
  );
}
