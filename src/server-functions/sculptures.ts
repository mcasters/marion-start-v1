import { db } from "~/db";
import {
  sculpture,
  sculptureCategory,
  sculptureImage,
  TYPE,
} from "~/db/schema";
import { SculptureCategory } from "~/lib/type";
import { getNoCategory } from "~/utils/commonUtils";
import { and, asc, desc, eq, getColumns, gte, isNull, lte } from "drizzle-orm";
import {
  createAdminCategoryObjects,
  createCategoryData,
  createSculptureData,
  createSculptureWorkObject,
} from "~/utils/workUtils";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  handleAddFiles,
  handleRemoveFiles,
} from "~/server-functions/serverUtils";
import { authMiddleware } from "~/middleware";

export const getSculptureCategoriesFn = createServerFn().handler(
  async (): Promise<{
    categories: SculptureCategory[];
    years: number[];
  }> => {
    const categories = await db.query.sculptureCategory.findMany({
      where: { sculptures: true },
      orderBy: { value: "desc" },
    });

    const sculptureWithNoCategory = await db.query.sculpture.findFirst({
      where: { categoryId: { isNull: true } },
    });

    if (sculptureWithNoCategory)
      categories.push(getNoCategory(TYPE.SCULPTURE) as SculptureCategory);

    const dbData = await db
      .selectDistinct({
        date: sculpture.date,
      })
      .from(sculpture)
      .orderBy(asc(sculpture.date));

    const years: number[] = [];
    dbData.forEach((item) => years.push(new Date(item.date).getFullYear()));

    return { categories, years: [...new Set(years)] };
  },
);

export const getSculptureByYearFn = createServerFn({ method: "POST" })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    const rows = await db
      .select({
        sculpture: sculpture,
        sculptureImage: sculptureImage,
      })
      .from(sculpture)
      .where(
        and(
          gte(sculpture.date, new Date(`${data}-01-01`)),
          lte(sculpture.date, new Date(`${data}-12-31`)),
        ),
      )
      .innerJoin(sculptureImage, eq(sculptureImage.sculptureId, sculpture.id))
      .orderBy(asc(sculpture.date));

    if (rows.length === 0) throw notFound();

    const works = createSculptureWorkObject(rows);
    return { works, year: data };
  });

export const getSculptureByCategoryFn = createServerFn({ method: "POST" })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    const { createdAt, ...rest } = getColumns(sculpture);
    let category: SculptureCategory | undefined;
    let rows;

    if (data === "no-category") {
      category = getNoCategory(TYPE.SCULPTURE) as SculptureCategory;
      rows = await db
        .select({
          sculpture: { ...rest },
          sculptureImage: sculptureImage,
        })
        .from(sculpture)
        .where(isNull(sculpture.categoryId))
        .innerJoin(sculptureImage, eq(sculptureImage.sculptureId, sculpture.id))
        .orderBy(asc(sculpture.date));
    } else {
      category = await db.query.sculptureCategory.findFirst({
        where: { key: data },
      });
      if (!category) throw notFound();

      rows = await db
        .select({
          sculpture: { ...rest },
          sculptureImage: sculptureImage,
        })
        .from(sculpture)
        .where(eq(sculpture.categoryId, category.id))
        .innerJoin(sculptureImage, eq(sculptureImage.sculptureId, sculpture.id))
        .orderBy(asc(sculpture.date));
    }
    if (rows.length === 0) throw notFound();

    const works = createSculptureWorkObject(rows);
    return { works, category };
  });

/*
*
ADMIN
*
 */

export const getAdminSculptureCategoriesFn = createServerFn().handler(
  async () => {
    const { createdAt, ...rest } = getColumns(sculpture);

    const rows = await db
      .select({
        sculpture: { ...rest },
        sculptureImage: sculptureImage,
      })
      .from(sculpture)
      .innerJoin(sculptureImage, eq(sculptureImage.sculptureId, sculpture.id))
      .orderBy(desc(sculpture.date));

    const works = createSculptureWorkObject(rows);

    const categories = await db.query.sculptureCategory.findMany({
      orderBy: { value: "asc" },
    });
    return createAdminCategoryObjects(categories, works, TYPE.SCULPTURE);
  },
);

export const createSculptureFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    const title = formData.get("title") as string;

    try {
      if (await db.query.sculpture.findFirst({ where: { title } }))
        return {
          message: `Erreur : le titre "${title}" existe déjà`,
          isError: true,
        };

      const data = createSculptureData(formData);
      const newId = await db.insert(sculpture).values(data).$returningId();

      const fileInfos = await handleAddFiles(TYPE.SCULPTURE, formData);
      if (fileInfos) {
        const images = fileInfos.map((fileInfo) => {
          return { ...fileInfo, sculptureId: newId[0].id };
        });
        await db.insert(sculptureImage).values(images);
      }
      return { message: `Sculpture ajoutée`, isError: false };
    } catch (e) {
      return { message: `Erreur à l'enregistrement : ${e}`, isError: true };
    }
  });

export const updateSculptureFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    const rawFormData = Object.fromEntries(formData);
    const type = TYPE.SCULPTURE;
    const id = Number(rawFormData.id as string);
    const title = rawFormData.title as string;

    try {
      const sculptureToUpdate = await db.query.sculpture.findFirst({
        where: { id },
      });
      if (!sculptureToUpdate)
        return { message: `Sculpture introuvable`, isError: true };

      const images = await db.query.sculptureImage.findMany({
        where: { sculptureId: sculptureToUpdate.id },
      });

      if (sculptureToUpdate.title !== title) {
        const titleAlreadyExists = await db.query.sculpture.findFirst({
          where: { title },
        });
        if (titleAlreadyExists)
          return {
            message: `Erreur : le titre "${title}" existe déjà`,
            isError: true,
          };
      }

      if (!!formData.get("oldCategoryId"))
        for await (const image of images) {
          await db
            .update(sculptureCategory)
            .set({
              imageFilename: "",
            })
            .where(eq(sculptureCategory.imageFilename, image.filename));
        }

      const data = createSculptureData(formData);
      await db.update(sculpture).set(data).where(eq(sculpture.id, id));

      const fileInfos = await handleAddFiles(type, formData);
      if (fileInfos) {
        const images = fileInfos.map((fileInfo) => {
          return { ...fileInfo, sculptureId: id };
        });
        await db.insert(sculptureImage).values(images);
      }

      const filenamesDeleted = await handleRemoveFiles(type, formData);
      if (filenamesDeleted) {
        for (const filename of filenamesDeleted) {
          await db
            .update(sculptureCategory)
            .set({ imageFilename: "" })
            .where(eq(sculptureCategory.imageFilename, filename));
          await db
            .delete(sculptureImage)
            .where(eq(sculptureImage.filename, filename));
        }
      }
      return { message: "Sculpture modifiée", isError: false };
    } catch (e) {
      return { message: `Erreur à l'enregistrement : ${e}`, isError: true };
    }
  });

export const deleteSculptureFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data: { id } }) => {
    try {
      const sculptureToDelete = await db.query.sculpture.findFirst({
        where: { id },
      });

      if (!sculptureToDelete)
        return { message: `Sculpture introuvable`, isError: true };

      const images = await db.query.sculptureImage.findMany({
        where: { sculptureId: sculptureToDelete.id },
      });

      await db.delete(sculpture).where(eq(sculpture.id, id));

      const filenamesToDelete = images.map((image) => image.filename);
      await handleRemoveFiles(TYPE.SCULPTURE, undefined, filenamesToDelete);

      return { message: `Sculpture supprimée`, isError: false };
    } catch (e) {
      return { message: `Erreur à la suppression`, isError: true };
    }
  });

export const createSculptureCategoryFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    const value = formData.get("value") as string;
    const data = createCategoryData(formData);

    try {
      const alreadyExists = await db.query.sculptureCategory.findFirst({
        where: { value },
      });
      if (alreadyExists)
        return {
          message: "Erreur : nom de catégorie déjà existant",
          isError: true,
        };
      await db.insert(sculptureCategory).values(data);

      return { message: "Catégorie ajoutée", isError: false };
    } catch (e) {
      return { message: "Erreur à la création", isError: true };
    }
  });

export const updateSculptureCategoryFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return data;
  })
  .handler(async ({ data: formData }) => {
    const id = Number(formData.get("id"));
    const data = createCategoryData(formData);

    try {
      const catToUpdate = await db.query.sculptureCategory.findFirst({
        where: { id },
      });
      if (catToUpdate) {
        await db
          .update(sculptureCategory)
          .set(data)
          .where(eq(sculptureCategory.id, id));
      }

      return { message: "Catégorie modifiée", isError: false };
    } catch (e) {
      return { message: "Erreur à la modification", isError: true };
    }
  });

export const deleteSculptureCategoryFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data: { id } }) => {
    try {
      const catToDelete = await db.query.sculptureCategory.findFirst({
        where: { id },
      });
      if (catToDelete) {
        await db.delete(sculptureCategory).where(eq(sculptureCategory.id, id));
      }

      return { message: "Catégorie supprimée", isError: false };
    } catch (e) {
      return { message: `Erreur à la suppression : ${e}`, isError: true };
    }
  });
