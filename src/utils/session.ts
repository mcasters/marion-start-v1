import { useSession } from "@tanstack/react-start/server";
import { Session } from "~/lib/type";

export function useAppSession() {
  return useSession<Session>({
    name: "app-session",
    password: process.env.AUTH_SECRET!, // At least 32 characters
    cookie: {
      secure: process.env.URL?.startsWith("https") ?? false,
      sameSite: "lax",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
    },
  });
}
