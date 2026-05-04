import { createPostData, createPostObject } from "~/utils/workUtils";
import { db } from "~/db";
import { createServerFn } from "@tanstack/react-start";
import { post, postImage, TYPE } from "~/db/schema";
import {
  handleAddFiles,
  handleRemoveFiles,
} from "~/server-functions/serverUtils";
import { asc, eq } from "drizzle-orm";
import { Post } from "~/lib/type";

export const createPostFn = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    const title = formData.get("title") as string;
    const type = TYPE.POST;

    try {
      if (await db.query.post.findFirst({ where: { title } }))
        return {
          message: `Erreur : le titre "${title}" existe déjà`,
          isError: true,
        };
      const data = createPostData(formData);
      const newId = await db.insert(post).values(data).$returningId();

      const fileInfos = await handleAddFiles(type, formData);
      if (fileInfos) {
        const images = fileInfos.map((fileInfo) => {
          return { ...fileInfo, postId: newId[0].id };
        });
        await db.insert(postImage).values(images);
      }

      return { message: `Post ajouté`, isError: false };
    } catch (e) {
      return { message: `Erreur à l'enregistrement : ${e}`, isError: true };
    }
  });

export const updatePostFn = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
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
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data: { id } }) => {
    const type = TYPE.POST;

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
        type,
        undefined,
        images.map((image) => image.filename),
      );

      return { message: `Post supprimé`, isError: false };
    } catch (e) {
      return { message: `Erreur à la suppression`, isError: true };
    }
  });

export const getPostsFn = createServerFn().handler(
  async (): Promise<Post[]> => {
    const rows = await db
      .select({
        post: post,
        postImage: postImage,
      })
      .from(post)
      .innerJoin(postImage, eq(postImage.postId, post.id))
      .orderBy(asc(post.date));

    return createPostObject(rows);
  },
);
