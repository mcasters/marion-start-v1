"use server";

import { Content, Image } from "~/lib/type";
import { db } from "~/db";
import { content, contentImage, LABEL } from "~/db/schema";
import { eq, or } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";

export const getHomeText = createServerFn().handler(
  async (): Promise<string | undefined> => {
    const content = await db.query.content.findFirst({
      columns: { text: true },
      where: { label: LABEL.INTRO },
    });
    return content?.text;
  },
);

export const getHomeImagesFn = createServerFn().handler(
  async (): Promise<Image[]> =>
    db
      .select({
        filename: contentImage.filename,
        width: contentImage.width,
        height: contentImage.height,
        isMain: contentImage.isMain,
      })
      .from(content)
      .where(eq(content.label, LABEL.SLIDER))
      .innerJoin(contentImage, eq(contentImage.contentId, content.id)),
);

export const getContactContentFn = createServerFn().handler(
  async (): Promise<Content> => {
    const contents = await db.query.content.findMany({
      columns: { label: true, text: true },
      where: {
        label: {
          OR: [LABEL.ADDRESS, LABEL.PHONE, LABEL.EMAIL, LABEL.TEXT_CONTACT],
        },
      },
    });
    const map = new Map();
    contents.forEach((content) =>
      map.set(content.label, { text: content.text }),
    );
    return map;
  },
);

export const getPresentationContentFn = createServerFn().handler(
  async (): Promise<Content> => {
    const contents = await db
      .select({
        label: content.label,
        text: content.text,
        filename: contentImage.filename,
        width: contentImage.width,
        height: contentImage.height,
      })
      .from(content)
      .where(
        or(
          eq(content.label, LABEL.DEMARCHE),
          eq(content.label, LABEL.INSPIRATION),
          eq(content.label, LABEL.PRESENTATION),
        ),
      )
      .innerJoin(contentImage, eq(contentImage.contentId, content.id))
      .limit(1);

    const map = new Map();
    contents.forEach((content) => {
      map.set(content.label, {
        text: content.text,
        image: {
          filename: content.filename,
          width: content.width,
          height: content.height,
        },
      });
    });
    return map;
  },
);

export const updateContentFn = createServerFn({ method: "POST" })
  .inputValidator((data: { key: string; text: string }) => data)
  .handler(async ({ data }) => {
    try {
      await db
        .update(content)
        .set({ text: data.text })
        .where(eq(content.label, data.key as LABEL));

      return { message: "Enregistré", isError: false };
    } catch (e) {
      return { message: "Erreur à l'enregistrement", isError: true };
    }
  });
