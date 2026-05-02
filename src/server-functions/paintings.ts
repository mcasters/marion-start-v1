import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { PaintingCategory, Work } from "~/lib/type";
import { painting, paintingCategory, TYPE } from "~/db/schema";
import { db } from "~/db";
import { getNoCategory } from "~/utils/commonUtils";
import {
  createAdminCategoryObjects,
  createCategoryData,
  createPaintingData,
  createWorkObject,
} from "~/utils/workUtils";
import { asc, eq } from "drizzle-orm";
import { handleAddFiles, handleRemoveFiles } from "./serverUtils";

export const getPaintingCategoriesFn = createServerFn().handler(
  async (): Promise<{ categories: PaintingCategory[]; years: number[] }> => {
    const categories = await db.query.paintingCategory.findMany({
      where: { paintings: true },
      orderBy: { value: "desc" },
    });

    const paintingWithNoCategory = await db.query.painting.findFirst({
      where: { categoryId: { isNull: true } },
    });

    if (paintingWithNoCategory)
      categories.push(getNoCategory(TYPE.PAINTING) as PaintingCategory);

    const yearsData = await db
      .selectDistinct({
        date: painting.date,
      })
      .from(painting)
      .orderBy(asc(painting.date));

    const years: number[] = [];
    yearsData.forEach((item) => years.push(new Date(item.date).getFullYear()));

    return { categories, years: [...new Set(years)] };
  },
);

export const getPaintingWorksByYearFn = createServerFn({ method: "POST" })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    const dbData = await db.query.painting.findMany({
      columns: {
        createdAt: false,
      },
      where: {
        date: {
          gte: new Date(`${data}-01-01`),
          lte: new Date(`${data}-12-31`),
        },
      },
      orderBy: { date: "desc" },
    });

    const works = dbData.map((data) => createWorkObject(data));
    return { works, year: data };
  });

export const getPaintingsByCategoryFn = createServerFn({ method: "POST" })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    let category: PaintingCategory | undefined;
    let works: Work[] = [];

    if (data === "no-category") {
      category = getNoCategory(TYPE.PAINTING) as PaintingCategory;
      const paintings = await db.query.painting.findMany({
        columns: {
          createdAt: false,
        },
        where: { categoryId: { isNull: true } },
        orderBy: { date: "desc" },
      });
      works = paintings.map((data) => createWorkObject(data));
    } else {
      category = await db.query.paintingCategory.findFirst({
        where: { key: data },
      });
      if (category) {
        const paintings = await db.query.painting.findMany({
          columns: {
            createdAt: false,
          },
          where: { categoryId: category.id },
          orderBy: { date: "desc" },
        });
        works = paintings.map((d) => createWorkObject(d));
      }
    }
    if (!category) {
      throw notFound();
    }
    return { works: works as Array<Work>, category };
  });

/*
*
ADMIN
*
 */

export const getAdminPaintingCategoriesFn = createServerFn().handler(
  async () => {
    const paintings = await db.query.painting.findMany({
      columns: {
        createdAt: false,
      },
      orderBy: { date: "desc" },
    });
    const works = paintings.map((p) => {
      return { ...createWorkObject(p) } as Work;
    });

    const categories = await db.query.paintingCategory.findMany({
      orderBy: { value: "desc" },
    });
    return createAdminCategoryObjects(categories, works, TYPE.PAINTING);
  },
);

export const createPaintingFn = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    const title = formData.get("title") as string;
    const type = TYPE.PAINTING;

    try {
      if (await db.query.painting.findFirst({ where: { title } }))
        return {
          message: `Erreur : le titre "${title}" existe déjà`,
          isError: true,
        };

      const fileInfos = await handleAddFiles(type, formData);
      const data = createPaintingData(formData, fileInfos);
      await db.insert(painting).values(data);

      return { message: `Peinture ajoutée`, isError: false };
    } catch (e) {
      return { message: `Erreur à l'enregistrement : ${e}`, isError: true };
    }
  });

export const updatePaintingFn = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    const rawFormData = Object.fromEntries(formData);
    const type = TYPE.PAINTING;
    const id = Number(rawFormData.id as string);
    const title = rawFormData.title as string;

    try {
      const itemToUpdate = await db.query.painting.findFirst({ where: { id } });
      if (!itemToUpdate)
        return { message: `Peinture introuvable`, isError: true };

      if (itemToUpdate.title !== title) {
        const titleAlreadyExists = await db.query.painting.findFirst({
          where: { title },
        });
        if (titleAlreadyExists)
          return {
            message: `Erreur : le titre "${title}" existe déjà`,
            isError: true,
          };
      }

      if (!!formData.get("oldCategoryId"))
        await db
          .update(paintingCategory)
          .set({
            imageFilename: "",
          })
          .where(
            eq(paintingCategory.imageFilename, itemToUpdate.imageFilename),
          );

      const fileInfos = await handleAddFiles(type, formData);
      const data = createPaintingData(formData, fileInfos);
      await db.update(painting).set(data).where(eq(painting.id, id));

      const filenamesDeleted = await handleRemoveFiles(type, formData);
      if (filenamesDeleted) {
        for (const filename of filenamesDeleted)
          await db
            .update(paintingCategory)
            .set({ imageFilename: "" })
            .where(eq(paintingCategory.imageFilename, filename));
      }

      return { message: "Peinture modifiée", isError: false };
    } catch (e) {
      return { message: `Erreur à l'enregistrement : ${e}`, isError: true };
    }
  });

export const deletePaintingFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data: { id } }) => {
    try {
      const itemToDelete = await db.query.painting.findFirst({
        where: { id },
      });

      if (!itemToDelete)
        return { message: `Peinture introuvable`, isError: true };

      await db.delete(painting).where(eq(painting.id, id));
      await handleRemoveFiles(TYPE.PAINTING, undefined, [
        itemToDelete.imageFilename,
      ]);

      return { message: `Peinture supprimée`, isError: false };
    } catch (e) {
      return { message: `Erreur à la suppression`, isError: true };
    }
  });

export const createPaintingCategoryFn = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    const value = formData.get("value") as string;
    const data = createCategoryData(formData);

    try {
      const alreadyExists = await db.query.paintingCategory.findFirst({
        where: { value },
      });
      if (alreadyExists)
        return {
          message: "Erreur : nom de catégorie déjà existant",
          isError: true,
        };
      await db.insert(paintingCategory).values(data);
      return { message: "Catégorie ajoutée", isError: false };
    } catch (e) {
      return { message: "Erreur à la création", isError: true };
    }
  });

export const updatePaintingCategoryFn = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    const id = Number(formData.get("id"));
    const data = createCategoryData(formData);

    try {
      const catToUpdate = await db.query.paintingCategory.findFirst({
        where: { id },
      });
      if (catToUpdate) {
        await db
          .update(paintingCategory)
          .set(data)
          .where(eq(paintingCategory.id, id));
      }
      return { message: "Catégorie modifiée", isError: false };
    } catch (e) {
      return { message: "Erreur à la modification", isError: true };
    }
  });

export const deletePaintingCategoryFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data: { id } }) => {
    try {
      const catToDelete = await db.query.paintingCategory.findFirst({
        where: { id },
      });
      if (catToDelete) {
        await db.delete(paintingCategory).where(eq(paintingCategory.id, id));
      }
      return { message: "Catégorie supprimée", isError: false };
    } catch (e) {
      return { message: `Erreur à la suppression : ${e}`, isError: true };
    }
  });
