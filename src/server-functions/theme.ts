import { createServerFn } from "@tanstack/react-start";
import { OnlyString, PresetColor, Theme } from "~/lib/type";
import { db } from "~/db";
import { eq } from "drizzle-orm";
import { THEME } from "~/constants/admin";
import { getBasePresetColorData, getBaseThemeData } from "~/utils/themeUtils";
import { presetColor, theme } from "~/db/schema";

export const getActiveThemeFn = createServerFn().handler(
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

export const getPresetColorsFn = createServerFn().handler(
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

export const activateThemeFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      await db.update(theme).set({ isActive: false });
      await db
        .update(theme)
        .set({ isActive: true })
        .where(eq(theme.id, data.id));

      return { message: `Thème activé`, isError: false };
    } catch (e) {
      return { message: "Erreur à l'activation'", isError: true };
    }
  });

export const createThemeFn = createServerFn({ method: "POST" })
  .inputValidator((data: Theme) => data)
  .handler(async ({ data }) => {
    try {
      const existant = await db.query.theme.findFirst({
        where: { name: data.name },
      });

      if (existant)
        return {
          message: "Nom du thème déjà existant",
          isError: true,
          theme: undefined,
        };
      const { id, ...rest } = data;
      const newId = await db.insert(theme).values(rest).$returningId();
      const savedTheme = await db.query.theme.findFirst({
        where: { id: newId[0].id },
      });

      return { message: "Thème ajouté", isError: false, theme: savedTheme };
    } catch (e) {
      return {
        message: `Erreur à l'enregistrement : ${e}`,
        isError: true,
        theme: undefined,
      };
    }
  });

export const updateThemeFn = createServerFn({ method: "POST" })
  .inputValidator((data: Theme) => data)
  .handler(async ({ data }) => {
    try {
      await db.update(theme).set(data).where(eq(theme.id, data.id));

      return { message: `Theme "${data.name}" modifié`, isError: false };
    } catch (e) {
      return { message: "Erreur à l'enregistrement", isError: true };
    }
  });

export const deleteThemeFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const themeToDelete = await db.query.theme.findFirst({
        where: { id: data.id },
      });

      if (themeToDelete) {
        if (themeToDelete.name === THEME.BASE_THEME_NAME) {
          return {
            message: "le thème par défaut ne peut pas être supprimé",
            isError: true,
            updatedThemes: null,
          };
        }
        if (themeToDelete.isActive)
          await db
            .update(theme)
            .set({ isActive: true })
            .where(eq(theme.name, THEME.BASE_THEME_NAME));

        await db.delete(theme).where(eq(theme.id, data.id));
      }
      const updatedThemes = await db.query.theme.findMany();

      return { message: "Thème supprimé", isError: false, updatedThemes };
    } catch (e) {
      return {
        message: "Erreur à la suppression",
        isError: true,
        updatedThemes: null,
      };
    }
  });

export const createPresetColorFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { name: string; color: string; displayOrder: number }) => data,
  )
  .handler(async ({ data }) => {
    const { name, color, displayOrder } = data;
    try {
      const alreadyExist = (
        await db.select().from(presetColor).where(eq(presetColor.name, name))
      )[0];
      if (alreadyExist)
        return {
          message: "Nom de la couleur déjà utilisé",
          isError: true,
          newPresetColor: null,
        };

      const newId = await db
        .insert(presetColor)
        .values({
          name,
          color,
          displayOrder,
        })
        .$returningId();

      const newPresetColor = await db.query.presetColor.findFirst({
        where: { id: newId[0].id },
      });

      return {
        message: "Couleur perso ajoutée",
        isError: false,
        newPresetColor: newPresetColor,
      };
    } catch (e) {
      return {
        message: `Erreur à la création de la couleur perso`,
        isError: true,
        newPresetColor: null,
      };
    }
  });

export const updatePresetColorFn = createServerFn({ method: "POST" })
  .inputValidator((data: PresetColor) => data)
  .handler(async ({ data }) => {
    try {
      await db
        .update(presetColor)
        .set({
          color: data.color,
        })
        .where(eq(presetColor.id, data.id));

      return { message: "Couleur perso modifiée", isError: false };
    } catch (e) {
      return {
        message: "Erreur à la modification de la couleur perso",
        isError: true,
      };
    }
  });

export const updatePresetColorsOrderFn = createServerFn({ method: "POST" })
  .inputValidator((data: Map<number, number>) => data)
  .handler(async ({ data }) => {
    try {
      const presetColors = await db.query.presetColor.findMany();
      for await (const p of presetColors) {
        await db
          .update(presetColor)
          .set({
            displayOrder: data.get(p.id),
          })
          .where(eq(presetColor.id, p.id));
      }
      const updatedPresetColors = await db.query.presetColor.findMany();

      return {
        message: "Ré-ordonnancement enregistré",
        isError: false,
        updatedPresetColors,
      };
    } catch (e) {
      return {
        message: `Erreur à l'ordonnancement de la couleur perso : ${e}`,
        isError: true,
        updatedPresetColors: null,
      };
    }
  });

export const deletePresetColorFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const presetColorToDelete = await db.query.presetColor.findFirst({
        where: { id: data.id },
      });

      if (!presetColorToDelete)
        return {
          message: "Erreur à la suppression",
          isError: true,
          updatedPresetColors: null,
          updatedThemes: null,
        };
      else {
        const themes: Theme[] = await db.query.theme.findMany();
        for await (const t of themes) {
          const updatedTheme = t;
          let isModified = false;
          for await (const [key, value] of Object.entries(t)) {
            if (
              value === presetColorToDelete.name &&
              key !== "name" &&
              key !== "isActive"
            ) {
              isModified = true;
              updatedTheme[key as keyof OnlyString<Theme>] =
                presetColorToDelete.color;
            }
          }
          if (isModified) {
            await db
              .update(theme)
              .set(updatedTheme)
              .where(eq(theme.id, updatedTheme.id));
          }
        }

        await db.delete(presetColor).where(eq(presetColor.id, data.id));

        const presetColors = await db.query.presetColor.findMany();
        for await (const p of presetColors) {
          if (p.displayOrder > presetColorToDelete.displayOrder)
            await db
              .update(presetColor)
              .set({ displayOrder: p.displayOrder - 1 })
              .where(eq(presetColor.id, p.id));
        }

        const updatedThemes = await db.query.theme.findMany();
        const updatedPresetColors = await db.query.presetColor.findMany();
        return {
          message: "Couleur perso supprimée",
          isError: false,
          updatedPresetColors,
          updatedThemes,
        };
      }
    } catch (e) {
      return {
        message: "Erreur à la suppression",
        isError: true,
        updatedPresetColors: null,
        updatedThemes: null,
      };
    }
  });
