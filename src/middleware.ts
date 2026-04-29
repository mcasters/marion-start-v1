import { createMiddleware } from "@tanstack/react-start";
import { getSessionFn } from "~/server-functions/auth";

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await getSessionFn({ headers: request.headers });
    if (!session) {
      throw new Error("Unauthorized");
    }
    return next({
      context: { session },
    });
  },
);
