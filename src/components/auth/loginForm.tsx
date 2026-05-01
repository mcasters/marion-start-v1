import s from "./authentication.module.css";
import { loginFn } from "~/server-functions/auth";
import React, { useState } from "react";
import { useRouter } from "@tanstack/react-router";

export default function LoginForm() {
  const [error, setError] = useState("");
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const res = await loginFn({ data: credentials });
      if (res.success) {
        router.invalidate();
        router.navigate({ to: "/admin" });
      } else setError(res.error);
    } catch (error) {
      setError(String(error));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={s.loginForm}
      style={{ width: "50%", margin: "auto" }}
    >
      {error !== "" && <p>{error}</p>}
      <input
        type="email"
        name="email"
        placeholder="Email"
        autoComplete="true"
        value={credentials.email}
        onChange={(e) =>
          setCredentials({ ...credentials, email: e.target.value })
        }
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        autoComplete="true"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        required
      />
      <button type="submit" className="adminButton">
        OK
      </button>
    </form>
  );
}
