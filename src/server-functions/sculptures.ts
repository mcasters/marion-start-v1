import { db } from "~/db";
import { sculpture, sculptureImage, TYPE } from "~/db/schema";
import { SculptureCategory, Work } from "~/lib/type";
import { getNoCategory } from "~/utils/commonUtils";
import { and, asc, eq, gte, isNull, lte } from "drizzle-orm";
import {
  aggregateSculptureRows,
  createSculptureWorkObject,
} from "~/utils/workUtils";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const getSculptureCategories = createServerFn().handler(
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

export const getSculptureWorksByYear = createServerFn({ method: "POST" })
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

    const result = aggregateSculptureRows(rows);
    const works = createSculptureWorkObject(result);
    return { works, year: data };
  });

export const getSculptureWorksByCategory = createServerFn({ method: "POST" })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    let category: SculptureCategory | undefined;
    let rows;

    if (data === "no-category") {
      category = getNoCategory(TYPE.SCULPTURE) as SculptureCategory;
      rows = await db
        .select({
          sculpture: sculpture,
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
      if (category) {
        rows = await db
          .select({
            sculpture: sculpture,
            sculptureImage: sculptureImage,
          })
          .from(sculpture)
          .where(eq(sculpture.categoryId, category.id))
          .innerJoin(
            sculptureImage,
            eq(sculptureImage.sculptureId, sculpture.id),
          )
          .orderBy(asc(sculpture.date));
      }
    }

    if (rows && category) {
      const result = aggregateSculptureRows(rows);
      const works = createSculptureWorkObject(result);
      return { works: works as Array<Work>, category };
    }
    throw notFound();
  });
