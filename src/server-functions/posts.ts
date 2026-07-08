import { createPostData, createPostObject } from "~/utils/workUtils";
import { post, postImage, TYPE } from "~/db/schema";
import { db } from "~/db";
import {
  handleAddFiles,
  handleRemoveFiles,
} from "~/server-functions/serverUtils";
import { asc, eq } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";
import { authMiddleware } from "~/utils/middleware/authMiddleware";

export const getPostsFn = createServerFn().handler(async () => {
  const rows = await db
    .select({
      post: post,
      postImage: postImage,
    })
    .from(post)
    .innerJoin(postImage, eq(postImage.postId, post.id))
    .orderBy(asc(post.date));

  return createPostObject(rows);
});

export const getPostFn = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const { id } = data;
    const postRow = await db
      .select({
        post: post,
        postImage: postImage,
      })
      .from(post)
      .where(eq(post.id, Number(id)))
      .innerJoin(postImage, eq(postImage.postId, Number(id)))
      .orderBy(asc(post.date));

    if (postRow.length === 0) throw notFound();
    return createPostObject(postRow)[0];
  });

export const createPostFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    const title = formData.get("title") as string;

    try {
      if (await db.query.post.findFirst({ where: { title } }))
        return {
          message: `Erreur : le titre "${title}" existe déjà`,
          isError: true,
        };
      const data = createPostData(formData);
      const newId = await db.insert(post).values(data).$returningId();

      const fileInfos = await handleAddFiles(TYPE.POST, formData);
      if (fileInfos) {
        const images = fileInfos.map((fileInfo) => {
          return { ...fileInfo, postId: newId[0].id };
        });
        await db.insert(postImage).values(images);
      }

      return { message: `Post ajouté`, isError: false };
    } catch (e) {
      return { message: `Erreur à l'enregistrement`, isError: true };
    }
  });

export const updatePostFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    const rawFormData = Object.fromEntries(formData);
    const type = TYPE.POST;
    const id = Number(rawFormData.id as string);
    const title = rawFormData.title as string;

    try {
      const postToUpdate = await db.query.post.findFirst({
        where: { id },
      });
      if (!postToUpdate) return { message: `Post introuvable`, isError: true };

      if (postToUpdate.title !== title) {
        const titleAlreadyExists = await db.query.post.findFirst({
          where: { title },
        });
        if (titleAlreadyExists)
          return {
            message: `Erreur : le titre "${title}" existe déjà`,
            isError: true,
          };
      }

      const data = createPostData(formData);
      await db.update(post).set(data).where(eq(post.id, id));

      const fileInfos = await handleAddFiles(type, formData);
      if (fileInfos) {
        const images = fileInfos.map((fileInfo) => {
          return { ...fileInfo, postId: id };
        });
        await db.insert(postImage).values(images);
      }

      const filenamesDeleted = await handleRemoveFiles(type, formData);
      if (filenamesDeleted) {
        for (const filename of filenamesDeleted) {
          await db.delete(postImage).where(eq(postImage.filename, filename));
        }
      }

      return { message: "Post modifié", isError: false };
    } catch (e) {
      return { message: `Erreur à l'enregistrement`, isError: true };
    }
  });

export const deletePostFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ data: { id } }) => {
    try {
      const postToDelete = await db.query.post.findFirst({
        where: { id },
      });
      if (!postToDelete) return { message: `Post introuvable`, isError: true };

      const images = await db.query.postImage.findMany({
        where: { postId: postToDelete.id },
      });

      await db.delete(post).where(eq(post.id, id));
      await handleRemoveFiles(
        TYPE.POST,
        undefined,
        images.map((image) => image.filename),
      );

      return { message: `Post supprimé`, isError: false };
    } catch (e) {
      return { message: `Erreur à la suppression`, isError: true };
    }
  });
