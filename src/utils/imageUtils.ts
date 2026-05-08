import { Item, Slide, Work } from "~/lib/type";
import { FILE_TYPES } from "~/constants/image";
import { MESSAGE } from "~/constants/admin";
import { TYPE } from "~/db/schema";
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
        if (longInfo && item.type !== TYPE.POST) {
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
