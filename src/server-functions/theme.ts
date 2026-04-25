import { createServerFn } from "@tanstack/react-start";
import { PresetColor, Theme } from "~/lib/type";
import { db } from "~/db";
import { eq } from "drizzle-orm";
import { THEME } from "~/constants/admin";
import { getBasePresetColorData, getBaseThemeData } from "~/utils/themeUtils";
import { presetColor, theme } from "~/db/schema";

export const getActiveTheme = createServerFn().handler(
  async (): Promise<Theme> => {
    let activeTheme = await db.query.theme.findFirst({
      where: { isActive: true },
    });

    if (!activeTheme) {
      let baseTheme = await db.query.theme.findFirst({
        where: { name: THEME.BASE_THEME_NAME },
      });

      if (!baseTheme) {
        const newId = await db
          .insert(theme)
          .values({ ...getBaseThemeData() })
          .$returningId();

        baseTheme = await db.query.theme.findFirst({
          where: { id: newId[0].id },
        });
      }

      await db
        .update(theme)
        .set({ isActive: true })
        .where(eq(theme.id, baseTheme!.id));

      activeTheme = await db.query.theme.findFirst({
        where: { isActive: true },
      });
    }
    return activeTheme!;
  },
);

export const getPresetColors = createServerFn().handler(
  async (): Promise<PresetColor[]> => {
    const presetColors = await db.query.presetColor.findMany();

    if (presetColors.length === 0) {
      const newId = await db
        .insert(presetColor)
        .values({ ...getBasePresetColorData() })
        .$returningId();
      const defaultPresetColor = await db.query.presetColor.findFirst({
        where: { id: newId[0].id },
      });
      presetColors.push(defaultPresetColor!);
    }
    return presetColors;
  },
);

export const getThemes = createServerFn().handler(
  async (): Promise<Theme[]> => await db.query.theme.findMany(),
);
