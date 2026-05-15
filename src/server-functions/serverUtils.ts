import { rmSync } from "fs";
import sharp from "sharp";
import { join } from "path";
import { transformValueToKey } from "~/utils/commonUtils";
import { IMAGE } from "~/constants/image";
import { TYPE } from "~/db/schema";
import { FileInfo } from "~/lib/type";

const serverLibraryPath = process.env.PHOTOS_PATH;
const copyright = process.env.TITLE || "";

export const getDir = (type: TYPE) => {
  return join(`${serverLibraryPath}`, type);
};

export const getMiscellaneousDir = () => {
  return join(`${serverLibraryPath}`, "miscellaneous");
};

export const resizeAndSaveImages = async (
  file: File,
  title: string = "",
  dir: string,
  isMain: boolean = false,
) => {
  const titleString = transformValueToKey(title);
  const newFilename = `${titleString}-${Date.now()}.jpeg`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const outputInfo = await constraintImage(buffer, dir, newFilename);

  const sharpStream = sharp({ failOn: "none" });
  const promises = [];
  promises.push(
    sharpStream
      .clone()
      .resize({
        width: IMAGE.MD_PX,
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .withExif({
        IFD0: {
          Copyright: copyright,
        },
      })
      .jpeg({ quality: 80, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toFile(join(dir, "md", newFilename)),
  );
  promises.push(
    sharpStream
      .clone()
      .resize({
        width: IMAGE.SM_PX,
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .withExif({
        IFD0: {
          Copyright: copyright,
        },
      })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(join(dir, "sm", newFilename)),
  );

  sharp(buffer).pipe(sharpStream);

  return Promise.all(promises)
    .then(() => {
      return {
        filename: newFilename,
        width: outputInfo.width,
        height: outputInfo.height,
        isMain,
      };
    })
    .catch((err) => {
      console.error(
        "Erreur à l'écriture des fichiers images, nettoyage...",
        err,
      );
      deleteFile(dir, newFilename);
      return null;
    });
};

const constraintImage = async (
  buffer: Buffer<ArrayBuffer> | Buffer<ArrayBufferLike>,
  dir: string,
  filename: string,
  quality = 100,
  drop = 8,
) => {
  const done = await sharp(buffer)
    .resize({
      width: 2000,
      height: 2000,
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .jpeg({
      quality,
      mozjpeg: true,
      chromaSubsampling: "4:4:4",
    })
    .withExif({
      IFD0: {
        Copyright: copyright,
      },
    })
    .toFile(join(dir, filename));

  if (done.size > 250000 && quality - drop > 10)
    return constraintImage(buffer, dir, filename, quality - drop);
  return done;
};

export const deleteFile = (dir: string, filename: string) => {
  rmSync(`${dir}/sm/${filename}`, { force: true });
  rmSync(`${dir}/md/${filename}`, { force: true });
  rmSync(`${dir}/${filename}`, { force: true });
};

export const handleAddFiles = async (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING | TYPE.POST,
  formData: FormData,
): Promise<FileInfo[] | null> => {
  const fileInfos: FileInfo[] = [];
  const dir = getDir(type);
  const title = formData.get("title") as string;
  const mainFileToAdd = formData.get("mainFileToAdd") as File;
  const filesToAdd = formData.getAll("filesToAdd") as File[];
  if (type === TYPE.POST && mainFileToAdd.size > 0)
    fileInfos.push(
      <FileInfo>await resizeAndSaveImages(mainFileToAdd, title, dir, true),
    );

  if (filesToAdd.length) {
    for await (const file of filesToAdd) {
      if (file.size > 0)
        fileInfos.push(
          <FileInfo>await resizeAndSaveImages(file, title, dir, false),
        );
    }
  }
  return fileInfos.length > 0 ? fileInfos : null;
};

export const handleRemoveFiles = async (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING | TYPE.POST,
  formData?: FormData,
  filenamesToDelete?: string[],
): Promise<string[] | null> => {
  let _filenamesToDelete: string[] = filenamesToDelete ?? [];

  if (formData) {
    const mainToDelete = formData.get("mainFilenameToDelete") as string;
    const toDelete = formData.get("filenamesToDelete") as string;

    if (mainToDelete) _filenamesToDelete.push(...mainToDelete.split(","));
    if (toDelete) _filenamesToDelete.push(...toDelete.split(","));
  }

  let filenamesDeleted: string[] = [];
  for (const filename of _filenamesToDelete) {
    if (filename !== "") {
      deleteFile(getDir(type), filename);
      filenamesDeleted.push(filename);
    }
  }
  return filenamesDeleted.length > 0 ? filenamesDeleted : null;
};
