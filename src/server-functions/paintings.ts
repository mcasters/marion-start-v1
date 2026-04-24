import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { PaintingCategory, Work } from "~/lib/type";
import { painting, TYPE } from "~/db/schema";
import { db } from "~/db";
import { getNoCategory } from "~/utils/commonUtils";
import { createWorkObject } from "~/utils/workUtils";
import { asc } from "drizzle-orm";

export const getPaintingCategories = createServerFn().handler(
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

export const getPaintingWorksByYear = createServerFn({ method: "POST" })
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

export const getPaintingsByCategory = createServerFn({ method: "POST" })
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
