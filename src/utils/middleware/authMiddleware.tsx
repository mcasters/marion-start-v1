import { createMiddleware } from "@tanstack/react-start";
import { getCurrentSessionFn } from "~/server-functions/auth";

export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const session = await getCurrentSessionFn();
    if (!session) {
      throw new Error("Unauthorized");
    }
    return next({
      context: { session },
    });
  },
);
