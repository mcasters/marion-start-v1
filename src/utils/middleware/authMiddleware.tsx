import { createMiddleware } from "@tanstack/react-start";
import { getSessionFn } from "~/server-functions/auth";

export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const session = await getSessionFn();
    if (!session) {
      throw new Error("Unauthorized");
    }
    return next({
      context: { session },
    });
  },
);
