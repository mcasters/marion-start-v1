import s from "~/components/layout/layout.module.css";
import { ROUTES } from "~/constants/specific/routes";
import { KEY_META } from "~/constants/admin";
import React from "react";
import { Link, rootRouteId, useRouteContext } from "@tanstack/react-router";

type Props = {
  themePage: "work" | "home" | "other";
};

export default function Footer({ themePage }: Props) {
  const { metas, structTheme, session } = useRouteContext({
    from: rootRouteId,
  });
  return (
    <footer
      className={s.footer}
      style={{
        color: structTheme[themePage].footer.text,
        backgroundColor: structTheme[themePage].footer.background,
      }}
    >
      <p>{metas.get(KEY_META.FOOTER)}</p>
      {!session?.email && (
        <Link
          to={ROUTES.LOGIN}
          style={{ color: structTheme[themePage].footer.link }}
        >
          Admin
        </Link>
      )}
    </footer>
  );
}
