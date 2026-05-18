import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db";
import { meta } from "~/db/schema";
import { eq } from "drizzle-orm";
import { KEY_META } from "~/constants/admin";
import { KeyMeta } from "~/lib/type";
import { authMiddleware } from "~/middleware";

export const getMetasFn = createServerFn().handler(async () => {
  const metas = await db.query.meta.findMany({
    columns: { id: false },
  });
  const map = new Map();
  metas.forEach((meta) => map.set(meta.key, meta.text));
  return map;
});

export const updateMetaFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(
    (data: {
      key: KeyMeta;
      text: string;
      layout?: string;
      darkBackground?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    let { key, text, layout, darkBackground } = data;
    try {
      if (
        key === KEY_META.PAINTING_LAYOUT ||
        key === KEY_META.SCULPTURE_LAYOUT ||
        key === KEY_META.DRAWING_LAYOUT
      ) {
        text = `${layout},${darkBackground}`;
      }

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
