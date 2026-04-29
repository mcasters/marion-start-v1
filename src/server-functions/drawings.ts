import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { DrawingCategory, Work } from "~/lib/type";
import { drawing, TYPE } from "~/db/schema";
import { db } from "~/db";
import { getNoCategory } from "~/utils/commonUtils";
import { createWorkObject } from "~/utils/workUtils";
import { asc } from "drizzle-orm";

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

export const getDrawingWorksByYearFn = createServerFn({ method: "POST" })
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
