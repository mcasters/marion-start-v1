import s from "./authentication.module.css";
import { ROUTES } from "~/constants/specific/routes";
import { logoutFn } from "~/server-functions/auth";
import { Link } from "@tanstack/react-router";

type Props = {
  email: string;
};

export default function AuthStatus({ email }: Props) {
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
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await logoutFn();
          }}
          className={s.logoutForm}
        >
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
