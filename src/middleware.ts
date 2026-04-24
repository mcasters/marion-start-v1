import { createMiddleware } from "@tanstack/react-start";
import { getSession } from "~/server-functions/auth";

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await getSession({ headers: request.headers });
    if (!session) {
      throw new Error("Unauthorized");
    }
    return next({
      context: { session },
    });
  },
);
