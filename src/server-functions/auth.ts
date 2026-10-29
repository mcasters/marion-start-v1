import bcrypt from "bcryptjs";
import { Session } from "~/lib/type";
import { db } from "~/db";
import { createServerFn } from "@tanstack/react-start";
import { getAppSession } from "~/utils/session";

export const getCurrentSessionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await getAppSession();
    return session.userId ? (session as Session) : null;
  },
);

export const loginFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const user = await db.query.user.findFirst({
      where: { email: data.email },
    });
    if (!user) return { success: false, error: "Erreur d'authentification" };
    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) return { success: false, error: "Erreur d'authentification" };

    const session = await getAppSession();
    session.userId = user.id;
    session.email = user.email;
    session.isAdmin = user.isAdmin;
    await session.save();
    return { success: true, error: "" };
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getAppSession();
  session.destroy();
  return { success: true, error: "" };
});
