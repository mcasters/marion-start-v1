import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { DrawingCategory, Work } from "~/lib/type";
import { drawing, drawingCategory, TYPE } from "~/db/schema";
import { db } from "~/db";
import { getNoCategory } from "~/utils/commonUtils";
import {
  createAdminCategoryObjects,
  createCategoryData,
  createDrawingData,
  createWorkObject,
} from "~/utils/workUtils";
import { asc, eq } from "drizzle-orm";
import {
  handleAddFiles,
  handleRemoveFiles,
} from "~/server-functions/serverUtils";

export const getDrawingCategoriesFn = createServerFn().handler(
  async (): Promise<{ categories: DrawingCategory[]; years: number[] }> => {
    const categories = await db.query.drawingCategory.findMany({
      where: { drawings: true },
      orderBy: { value: "desc" },
    });

    const drawingWithNoCategory = await db.query.drawing.findFirst({
      where: { categoryId: { isNull: true } },
    });

    if (drawingWithNoCategory)
      categories.push(getNoCategory(TYPE.DRAWING) as DrawingCategory);

    const yearsData = await db
      .selectDistinct({
        date: drawing.date,
      })
      .from(drawing)
      .orderBy(asc(drawing.date));

    const years: number[] = [];
    yearsData.forEach((item) => years.push(new Date(item.date).getFullYear()));

    return { categories, years: [...new Set(years)] };
  },
);

export const getDrawingByYearFn = createServerFn({ method: "POST" })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    const dbData = await db.query.drawing.findMany({
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

export const getDrawingsByCategoryFn = createServerFn({ method: "POST" })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    let category: DrawingCategory | undefined;
    let works: Work[] = [];

    if (data === "no-category") {
      category = getNoCategory(TYPE.DRAWING) as DrawingCategory;
      const drawings = await db.query.drawing.findMany({
        columns: {
          createdAt: false,
        },
        where: { categoryId: { isNull: true } },
        orderBy: { date: "desc" },
      });
      works = drawings.map((data) => createWorkObject(data));
    } else {
      category = await db.query.drawingCategory.findFirst({
        where: { key: data },
      });
      if (category) {
        const drawings = await db.query.drawing.findMany({
          columns: {
            createdAt: false,
          },
          where: { categoryId: category.id },
          orderBy: { date: "desc" },
        });
        works = drawings.map((d) => createWorkObject(d));
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

export const getAdminDrawingCategoriesFn = createServerFn().handler(
  async () => {
    const drawings = await db.query.drawing.findMany({
      columns: {
        createdAt: false,
      },
      orderBy: { date: "desc" },
    });
    const works = drawings.map((p) => {
      return { ...createWorkObject(p) } as Work;
    });

    const categories = await db.query.drawingCategory.findMany({
      orderBy: { value: "desc" },
    });
    return createAdminCategoryObjects(categories, works, TYPE.DRAWING);
  },
);

export const createDrawingFn = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    const title = formData.get("title") as string;
    const type = TYPE.DRAWING;

    try {
      if (await db.query.drawing.findFirst({ where: { title } }))
        return {
          message: `Erreur : le titre "${title}" existe déjà`,
          isError: true,
        };

      const fileInfos = await handleAddFiles(type, formData);
      const data = createDrawingData(formData, fileInfos);
      await db.insert(drawing).values(data);

      return { message: `Dessin ajouté`, isError: false };
    } catch (e) {
      return { message: `Erreur à l'enregistrement : ${e}`, isError: true };
    }
  });

export const updateDrawingFn = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    const rawFormData = Object.fromEntries(formData);
    const type = TYPE.DRAWING;
    const id = Number(rawFormData.id as string);
    const title = rawFormData.title as string;

    try {
      const itemToUpdate = await db.query.drawing.findFirst({ where: { id } });
      if (!itemToUpdate)
        return { message: `Dessin introuvable`, isError: true };

      if (itemToUpdate.title !== title) {
        const titleAlreadyExists = await db.query.drawing.findFirst({
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
          .update(drawingCategory)
          .set({
            imageFilename: "",
          })
          .where(eq(drawingCategory.imageFilename, itemToUpdate.imageFilename));

      const fileInfos = await handleAddFiles(type, formData);
      const data = createDrawingData(formData, fileInfos);
      await db.update(drawing).set(data).where(eq(drawing.id, id));

      const filenamesDeleted = await handleRemoveFiles(type, formData);
      if (filenamesDeleted) {
        for (const filename of filenamesDeleted)
          await db
            .update(drawingCategory)
            .set({ imageFilename: "" })
            .where(eq(drawingCategory.imageFilename, filename));
      }

      return { message: "Dessin modifié", isError: false };
    } catch (e) {
      return { message: `Erreur à l'enregistrement : ${e}`, isError: true };
    }
  });

export const deleteDrawingFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data: { id } }) => {
    try {
      const itemToDelete = await db.query.drawing.findFirst({
        where: { id },
      });

      if (!itemToDelete)
        return { message: `Dessin introuvable`, isError: true };

      await db.delete(drawing).where(eq(drawing.id, id));
      await handleRemoveFiles(TYPE.DRAWING, undefined, [
        itemToDelete.imageFilename,
      ]);

      return { message: `Dessin supprimé`, isError: false };
    } catch (e) {
      return { message: `Erreur à la suppression`, isError: true };
    }
  });

export const createDrawingCategoryFn = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    const value = formData.get("value") as string;
    const data = createCategoryData(formData);

    try {
      const alreadyExists = await db.query.drawingCategory.findFirst({
        where: { value },
      });
      if (alreadyExists)
        return {
          message: "Erreur : nom de catégorie déjà existant",
          isError: true,
        };
      await db.insert(drawingCategory).values(data);

      return { message: "Catégorie ajoutée", isError: false };
    } catch (e) {
      return { message: "Erreur à la création", isError: true };
    }
  });

export const updateDrawingCategoryFn = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    const id = Number(formData.get("id"));
    const data = createCategoryData(formData);

    try {
      const catToUpdate = await db.query.drawingCategory.findFirst({
        where: { id },
      });
      if (catToUpdate) {
        await db
          .update(drawingCategory)
          .set(data)
          .where(eq(drawingCategory.id, id));
      }

      return { message: "Catégorie modifiée", isError: false };
    } catch (e) {
      return { message: "Erreur à la modification", isError: true };
    }
  });

export const deleteDrawingCategoryFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data: { id } }) => {
    try {
      const catToDelete = await db.query.drawingCategory.findFirst({
        where: { id },
      });
      if (catToDelete) {
        await db.delete(drawingCategory).where(eq(drawingCategory.id, id));
      }

      return { message: "Catégorie supprimée", isError: false };
    } catch (e) {
      return { message: `Erreur à la suppression : ${e}`, isError: true };
    }
  });
