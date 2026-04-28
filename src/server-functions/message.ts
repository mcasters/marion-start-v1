import { db } from "~/db";
import { message, user } from "~/db/schema";
import { desc, eq } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";

export const getMessages = createServerFn().handler(async () => {
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

export const addMessage = async (initialState: any, formData: FormData) => {
  const rawFormData = Object.fromEntries(formData);
  const text = rawFormData.text as string;
  const userId = Number(rawFormData.userId as string);
  try {
    await db.insert(message).values({
      date: new Date(),
      text,
      userId,
    });

    return { message: "Message ajouté", isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement`, isError: true };
  }
};
export const updateMessage = async (initialState: any, formData: FormData) => {
  const rawFormData = Object.fromEntries(formData);
  const id = Number(rawFormData.id as string);
  const text = rawFormData.text as string;
  try {
    await db
      .update(message)
      .set({
        text,
        dateUpdated: new Date(),
      })
      .where(eq(message.id, id));

    return { message: "Message modifié", isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement`, isError: true };
  }
};

export const deleteMessage = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      await db.delete(message).where(eq(message.id, data.id));
    } catch (e) {}
  });
