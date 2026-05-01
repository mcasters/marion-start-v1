import bcrypt from "bcryptjs";
import { Session } from "~/lib/type";
import { db } from "~/db";
import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";

function useAppSession() {
  return useSession<Session>({
    name: "app-session",
    password: process.env.AUTH_SECRET!, // At least 32 characters
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
    },
  });
}

export const getSessionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession();
    return session.data.userId ? (session.data as Session) : null;
  },
);

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const user = await db.query.user.findFirst({
      where: { email: data.email },
    });
    if (!user) return { success: false, error: "Erreur d'authentification" };
    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) return { success: false, error: "Erreur d'authentification" };

    const session = await useAppSession();
    await session.update({
      userId: user.id,
      email: user.email,
      isAdmin: !!user.isAdmin,
    });
    // throw redirect({ to: "/admin" });
    return { success: true, error: "" };
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAppSession();
  await session.clear();
  return { success: true, error: "" };
});
