import s from "./authentication.module.css";
import { ROUTES } from "~/constants/specific/routes";
import { logoutFn } from "~/server-functions/auth";
import { Link, useRouter } from "@tanstack/react-router";
import React from "react";

type Props = {
  email: string;
};

export default function AuthStatus({ email }: Props) {
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const res = await logoutFn();
    if (res.success) {
      router.navigate({ to: "/" });
      router.invalidate();
    }
  };

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
