import s from "~/components/layout/layout.module.css";
import { ROUTES } from "~/constants/specific/routes";
import { KEY_META } from "~/constants/admin";
import React from "react";
import { Route } from "~/routes/__root";
import { Link } from "@tanstack/react-router";

type Props = {
  themePage: "work" | "home" | "other";
};

export default function Footer({ themePage }: Props) {
  const { metas, theme, session } = Route.useRouteContext();

  return (
    <footer
      className={s.footer}
      style={{
        color: theme[themePage].footer.text,
        backgroundColor: theme[themePage].footer.background,
      }}
    >
      <p>{metas.get(KEY_META.FOOTER)}</p>
      {!session?.email && (
        <Link to={ROUTES.LOGIN} style={{ color: theme[themePage].footer.link }}>
          Admin
        </Link>
      )}
    </footer>
  );
}
