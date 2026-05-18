import type { ErrorComponentProps } from "@tanstack/react-router";
import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";
import s from "~/styles/page.module.css";

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  console.error("DefaultCatchBoundary Error:", error);

  return (
    <div className={s.errorWrapper}>
      <ErrorComponent error={error} />
      <div>
        <button
          onClick={() => {
            router.invalidate();
          }}
          className="buttonLink"
        >
          Réessayer
        </button>
        {"   -   "}
        {isRoot ? (
          <Link to="/">Home</Link>
        ) : (
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            Précédent
          </Link>
        )}
      </div>
    </div>
  );
}
