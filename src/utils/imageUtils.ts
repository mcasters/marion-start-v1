import { EnhancedImage, Post, Work } from "~/lib/type";
import { FILE_TYPES } from "~/constants/image";
import { MESSAGE } from "~/constants/admin";
import { TYPE } from "~/db/schema";
import Resizer from "~/utils/resizer";

export const getEnhancedImages = (
  items: Work[] | Post[],
  isSmall: boolean,
  longInfo: boolean = false,
  owner: string = "",
): EnhancedImage[] => {
  const tab: EnhancedImage[] = [];
  items.forEach((item) => {
    item.images.forEach((image) => {
      let obj = {
        littleScr: `/images/${item.type}/${isSmall ? "sm/" : "md/"}${image.filename}`,
        src: `/images/${item.type}/${isSmall ? "md/" : ""}${image.filename}`,
        width: image.width,
        height: image.height,
        alt:
          item.type === TYPE.POST
            ? `Photo du post "${item.title}" de ${owner}`
            : `${item.title} - ${item.type} de ${owner}`,
      };

      tab.push(
        longInfo
          ? ({ ...obj, work: item } as EnhancedImage)
          : {
              ...obj,
              title: item.title,
              year: new Date(item.date).getFullYear(),
            },
      );
    });
  });
  return tab;
};

export const validateFile = async (
  file: File,
  increaseWeight: (arg0: number) => number,
  acceptSmallImage: boolean,
): Promise<{ message: string; isError: boolean }> => {
  if (!FILE_TYPES.includes(file.type))
    return { message: MESSAGE.error_imageType, isError: true };

  const weight = increaseWeight(file.size);
  if (weight > 30000000) {
    return { message: MESSAGE.error_sizeUpload, isError: true };
  }

  if (!acceptSmallImage) {
    const bmp = await createImageBitmap(file);
    if (bmp.width < 2000) {
      bmp.close();
      return { message: MESSAGE.error_imageSize, isError: true };
    }
    bmp.close();
  }
  return { message: "OK", isError: false };
};

export const resizeFile = (file: File, quality: number): Promise<File> =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      2000,
      2000,
      "jpeg",
      quality,
      (file: File) => {
        resolve(file);
      },
      "file",
    );
  });

export const constraintImage = async (
  file: File,
  quality = 90,
  drop = 10,
): Promise<File> => {
  const done = await resizeFile(file, quality);

  if (done.size > 200000 && quality - drop > 10) {
    return constraintImage(file, quality - drop);
  }
  return done;
};
