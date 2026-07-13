import { Item, Slide, Work } from "~/lib/type";
import { FILE_TYPES } from "~/constants/image";
import { MESSAGE } from "~/constants/admin";
import Resizer from "~/utils/resizer";

export const getSlides = (
  items: Item[],
  alt: string,
  isSmall: boolean,
  longInfo: boolean = false,
): Slide[] => {
  const slides: Slide[] = [];
  items.forEach((item) => {
    item.images.forEach((image) => {
      if (!image.isMain) {
        const slide: Slide = {
          src: `/images/${item.type}/${isSmall ? "md/" : ""}${image.filename}`,
          width: image.width,
          height: image.height,
          alt,
        };
        if (longInfo) {
          slide.work = item as Work;
        } else {
          slide.title = item.title;
          slide.year = item.date.getFullYear();
        }
        slides.push(slide);
      }
    });
  });
  return slides;
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

export const resizer = (
  file: File,
  quality: number,
  maxDim: number,
): Promise<File> =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxDim,
      maxDim,
      "jpeg",
      quality,
      (file: File) => {
        resolve(file);
      },
      "file",
    );
  });

export async function resizeFile({
  file,
  maxDim,
  maxSize = 150000,
  quality = 100,
}: {
  file: File;
  maxDim: number;
  maxSize?: number;
  quality?: number;
}): Promise<File> {
  const resizedFile = await resizer(file, quality, maxDim);
  return resizedFile.size > maxSize && quality >= 10
    ? resizeFile({ file, maxDim, maxSize, quality: quality - 8 })
    : resizedFile;
}
