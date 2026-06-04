import { db } from "~/db";
import { content, contentImage, LABEL } from "~/db/schema";
import { eq } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";
import {
  deleteFile,
  getMiscellaneousDir,
  resizeAndSaveImages,
} from "~/server-functions/serverUtils";
import { authMiddleware } from "~/utils/middleware/authMiddleware";

export const getHomeTextFn = createServerFn().handler(async () => {
  const content = await db.query.content.findFirst({
    columns: { text: true },
    where: { label: LABEL.INTRO },
  });
  return content?.text;
});

export const getHomeImagesFn = createServerFn().handler(async () =>
  db
    .select({
      filename: contentImage.filename,
      width: contentImage.width,
      height: contentImage.height,
      isMain: contentImage.isMain,
    })
    .from(content)
    .where(eq(content.label, LABEL.SLIDER))
    .innerJoin(contentImage, eq(contentImage.contentId, content.id)),
);

export const getContactContentFn = createServerFn().handler(async () => {
  const contents = await db.query.content.findMany({
    columns: { label: true, text: true },
    where: {
      label: {
        OR: [LABEL.ADDRESS, LABEL.PHONE, LABEL.EMAIL, LABEL.TEXT_CONTACT],
      },
    },
  });
  const map = new Map();
  contents.forEach((content) => map.set(content.label, { text: content.text }));
  return map;
});

export const getPresentationContentFn = createServerFn().handler(async () => {
  const contents = await db.query.content.findMany({
    columns: { label: true, text: true },
    where: {
      label: {
        OR: [LABEL.DEMARCHE, LABEL.INSPIRATION, LABEL.PRESENTATION],
      },
    },
  });

  const presentation = await db
    .select({
      label: content.label,
      text: content.text,
      filename: contentImage.filename,
      width: contentImage.width,
      height: contentImage.height,
    })
    .from(content)
    .where(eq(content.label, LABEL.PRESENTATION))
    .innerJoin(contentImage, eq(contentImage.contentId, content.id));

  const map = new Map();
  contents.forEach((content) => {
    map.set(content.label, {
      text: content.text,
    });
  });
  map.set(presentation[0].label, {
    text: presentation[0].text,
    image: {
      filename: presentation[0].filename,
      width: presentation[0].width,
      height: presentation[0].height,
    },
  });
  return map;
});

export const updateContentFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: { key: LABEL; text: string }) => data)
  .handler(async ({ data }) => {
    try {
      const res = await db
        .update(content)
        .set({ text: data.text })
        .where(eq(content.label, data.key));

      if (res[0].affectedRows === 0)
        await db.insert(content).values({
          label: data.key,
          text: data.text,
        });

      return { message: "Enregistré", isError: false };
    } catch (e) {
      return { message: "Erreur à l'enregistrement", isError: true };
    }
  });

export const updateImageContentFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((d: FormData) => d)
  .handler(async ({ data }) => {
    const label = data.get("key") as LABEL;

    try {
      if (label === LABEL.SLIDER) await updateImageSlider(data);
      else {
        await updateImagePresentation(data);
      }

      return { message: "Enregistré", isError: false };
    } catch (e) {
      return { message: `Erreur à l'enregistrement`, isError: true };
    }
  });

const updateImageSlider = async (formData: FormData) => {
  const filesToAdd = formData.getAll("filesToAdd") as File[];
  const filenamesToDelete = formData.get("filenamesToDelete") as string;

  if (filesToAdd.length > 0) {
    const isMain = formData.get("isMain") === "true";
    const title = isMain ? "mobileSlider" : "desktopSlider";
    await saveContentImage(LABEL.SLIDER, filesToAdd, title, isMain);
  }

  if (filenamesToDelete !== "")
    for await (const filename of filenamesToDelete.split(",")) {
      await deleteImageContent(filename);
    }
};

const updateImagePresentation = async (formData: FormData) => {
  const filesToAdd = formData.getAll("filesToAdd") as File[];
  const filenamesToDelete = formData.get("filenamesToDelete") as string;

  if (filesToAdd.length > 0)
    await saveContentImage(
      LABEL.PRESENTATION,
      filesToAdd,
      "presentation",
      false,
    );

  if (filenamesToDelete !== "") await deleteImageContent(filenamesToDelete);
};

const saveContentImage = async (
  label: LABEL,
  filesToAdd: File[],
  title: string,
  isMain: boolean,
) => {
  let contentToUpdateId = (
    await db.query.content.findFirst({ where: { label } })
  )?.id;

  if (!contentToUpdateId) {
    const newContent = await db
      .insert(content)
      .values({
        label,
        text: "",
        title: "",
      })
      .$returningId();
    contentToUpdateId = newContent[0].id;
  }

  for await (const file of filesToAdd) {
    if (file.size > 0) {
      const fileInfo = await resizeAndSaveImages(
        file,
        title,
        getMiscellaneousDir(),
      );
      if (fileInfo)
        await db.insert(contentImage).values({
          filename: fileInfo.filename,
          width: fileInfo.width,
          height: fileInfo.height,
          isMain,
          contentId: contentToUpdateId,
        });
    }
  }
};

const deleteImageContent = async (filename: string) => {
  deleteFile(getMiscellaneousDir(), filename);
  await db.delete(contentImage).where(eq(contentImage.filename, filename));
};
