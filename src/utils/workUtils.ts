import { post, postImage, sculptureImage, TYPE } from "~/db/schema";
import {
  AdminCategory,
  Category,
  DrawingDb,
  FileInfo,
  PaintingDb,
  Post,
  SculptureDb,
  Work,
} from "~/lib/type";
import { getNoCategory, transformValueToKey } from "~/utils/commonUtils";

export const createPaintingData = (
  formData: FormData,
  fileInfos: FileInfo[] | null,
) => getCommonData(formData, fileInfos);
export const createDrawingData = (
  formData: FormData,
  fileInfos: FileInfo[] | null,
) => getCommonData(formData, fileInfos);
export const createSculptureData = (formData: FormData) => {
  const rawFormData = Object.fromEntries(formData);
  const common = getCommonData(formData, null);
  return {
    ...common,
    length: Number(rawFormData.length as string),
  };
};
const getCommonData = (formData: FormData, fileInfos: FileInfo[] | null) => {
  const rawFormData = Object.fromEntries(formData);
  const categoryId = Number(rawFormData.categoryId as string);
  const price = rawFormData.price as string;

  const file = fileInfos
    ? {
        imageFilename: fileInfos[0].filename,
        imageHeight: fileInfos[0].height,
        imageWidth: fileInfos[0].width,
      }
    : {};
  return {
    title: rawFormData.title as string,
    date: new Date(rawFormData.date as string),
    technique: rawFormData.technique as string,
    description: rawFormData.description as string,
    height: Number(rawFormData.height as string),
    width: Number(rawFormData.width as string),
    categoryId: categoryId === 0 ? null : categoryId,
    isToSell: rawFormData.isToSell === "on",
    price: price ? Number(price) : null,
    sold: rawFormData.sold === "on",
    isOut: rawFormData.isOut === "on",
    outInformation: rawFormData.outInformation as string,
    ...file,
  };
};
export const createPostData = (formData: FormData) => {
  const rawFormData = Object.fromEntries(formData);
  return {
    title: rawFormData.title as string,
    date: new Date(rawFormData.date as string),
    text: rawFormData.text as string,
  };
};
export const createCategoryData = (formData: FormData) => {
  const rawFormData = Object.fromEntries(formData);
  const value = rawFormData.value as string;

  return {
    key: transformValueToKey(value),
    value,
    title: rawFormData.title as string,
    text: rawFormData.text as string,
    imageFilename: rawFormData.filename as string,
  };
};
export const createWorkObject = (data: PaintingDb | DrawingDb): Work => {
  const { imageFilename, imageHeight, imageWidth, ...rest } = data;
  return {
    ...rest,
    length: 0,
    images: [
      {
        filename: imageFilename,
        width: imageWidth,
        height: imageHeight,
        isMain: false,
      },
    ],
  };
};

export const createSculptureWorkObject = (
  rows: {
    sculpture: SculptureDb;
    sculptureImage: typeof sculptureImage.$inferSelect;
  }[],
): Work[] => {
  let map: Map<number, Work> = new Map();

  rows.reduce<Map<number, Work>>((acc, row) => {
    const { id, ...rest } = row.sculpture;
    const image = row.sculptureImage;

    if (!acc.get(id)) {
      acc.set(id, { ...rest, id, images: [] });
    }
    if (image) {
      acc.get(id)?.images.push(image);
    }
    return acc;
  }, map);

  return [...map.values()];
};

export const createPostObject = (
  rows: {
    post: typeof post.$inferSelect;
    postImage: typeof postImage.$inferSelect;
  }[],
): Post[] => {
  let map: Map<number, Post> = new Map();

  rows.reduce<Map<number, Post>>((acc, row) => {
    const { createdAt, published, viewCount, id, ...rest } = row.post;
    const image = row.postImage;

    if (!acc.get(id)) {
      acc.set(id, { ...rest, id, images: [] });
    }
    if (image) {
      acc.get(id)?.images.push(image);
    }
    return acc;
  }, map);

  return [...map.values()];
};

export const createAdminCategoryObjects = (
  categories: Category[],
  items: Work[],
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING,
): { works: Work[]; categories: AdminCategory[] } => {
  const categoryMap = new Map();
  categories.forEach((category) => {
    categoryMap.set(category.id, {
      ...category,
      filenames: [],
      count: 0,
    });
  });
  categoryMap.set(0, {
    ...getNoCategory(type),
    filenames: [],
    count: 0,
  });
  items.forEach((item) => {
    const itemCategoryId = item.categoryId === null ? 0 : item.categoryId;
    const category = categoryMap.get(itemCategoryId);
    category.count += 1;
    item.images.forEach((image) => {
      category.filenames = category.filenames.concat(image.filename);
    });
    categoryMap.set(itemCategoryId, category);
  });
  if (categoryMap.get(0).count === 0) categoryMap.delete(0);
  return { works: items, categories: [...categoryMap.values()] };
};
