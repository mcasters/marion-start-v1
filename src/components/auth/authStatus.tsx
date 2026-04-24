"use client";

import s from "./authentication.module.css";
import { ROUTES } from "~/constants/specific/routes";
import React from "react";
import { logoutFn } from "~/server-functions/auth";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

type Props = {
  email: string;
};

export default function AuthStatus({ email }: Props) {
  const logout = useServerFn(logoutFn);

  const handleSubmit = async () => logout();
  return (
    <div className={s.authStatusWrapper}>
      <div className={s.container}>
        <p>
          <small>Signed in as :</small>
          <br />
          <strong>{email}</strong>
        </p>
        <br />
        <Link to={ROUTES.ADMIN}>Administration du site</Link>
        <br />
        <form onSubmit={handleSubmit} className={s.logoutForm}>
          <button type="submit" className="buttonLink">
            Déconnexion
          </button>
        </form>
        <br />
        <Link to={ROUTES.HOME}>Home</Link>
      </div>
    </div>
  );
}
