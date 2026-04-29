import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db";
import { meta } from "~/db/schema";
import { eq } from "drizzle-orm";

export const getMetasFn = createServerFn().handler(
  async (): Promise<Map<string, string>> => {
    const metas = await db.query.meta.findMany({
      columns: { id: false },
    });
    const map = new Map();
    metas.forEach((meta) => map.set(meta.key, meta.text));
    return map;
  },
);

export const getMetasByKeyFn = createServerFn({ method: "POST" })
  .inputValidator((d: string[]) => d)
  .handler(async ({ data }): Promise<Map<string, string>> => {
    const metas = await db.query.meta.findMany({
      columns: { id: false },
      where: {
        key: { OR: [...data] },
      },
    });
    const map = new Map();
    metas.forEach((meta) => map.set(meta.key, meta.text));
    return map;
  });

export const updateMetaFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      key: string;
      text: string;
      layout?: string;
      darkBackground?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { key, text } = data;
    try {
      const metaFound = await db.query.meta.findFirst({
        where: { key },
      });

      if (!metaFound) {
        await db.insert(meta).values({
          key,
          text,
        });
      } else {
        await db.update(meta).set({ text }).where(eq(meta.key, key));
      }

      return { message: "Modification enregistrée", isError: false };
    } catch (e) {
      return { message: "Erreur à l'enregistrement", isError: true };
    }
  });
