import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "~/components/auth/loginForm";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h1>Espace administration</h1>
      <h2>Authentification</h2>
      <LoginForm />
    </>
  );
}
