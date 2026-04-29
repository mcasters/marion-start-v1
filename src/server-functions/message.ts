import { db } from "~/db";
import { message, user } from "~/db/schema";
import { desc, eq } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";

export const getMessagesFn = createServerFn().handler(async () => {
  return db
    .select({
      id: message.id,
      date: message.date,
      dateUpdated: message.dateUpdated,
      text: message.text,
      author: { email: user.email },
    })
    .from(message)
    .innerJoin(user, eq(message.userId, user.id))
    .orderBy(desc(message.date));
});

export const addMessageFn = createServerFn({ method: "POST" })
  .inputValidator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error("Expected FormData");
    }
    return {
      text: data.get("text")?.toString() || "",
      userId: data.get("userId")?.toString() || "0",
    };
  })
  .handler(async ({ data }) => {
    const { userId, text } = data;
    try {
      await db.insert(message).values({
        date: new Date(),
        text,
        userId: Number(userId),
      });

      return { message: "Message ajouté", isError: false };
    } catch (e) {
      return { message: `Erreur à l'enregistrement`, isError: true };
    }
  });

export const updateMessageFn = createServerFn({ method: "POST" })
  .inputValidator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error("Expected FormData");
    }
    return {
      id: data.get("id")?.toString() || "0",
      text: data.get("text")?.toString() || "",
    };
  })
  .handler(async ({ data }) => {
    const { id, text } = data;
    try {
      await db
        .update(message)
        .set({
          text,
          dateUpdated: new Date(),
        })
        .where(eq(message.id, Number(id)));

      return { message: "Message modifié", isError: false };
    } catch (e) {
      return { message: `Erreur à l'enregistrement`, isError: true };
    }
  });

export const deleteMessageFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      await db.delete(message).where(eq(message.id, data.id));
    } catch (e) {}
  });
