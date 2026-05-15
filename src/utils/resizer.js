class Resizer {
  static changeHeightWidth(height, maxHeight, width, maxWidth) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
    return { height, width };
  }

  static resizeImage(
    image,
    maxWidth,
    maxHeight,
    compressFormat = "jpeg",
    quality,
  ) {
    const qualityDecimal = quality / 100;
    const canvas = document.createElement("canvas");

    let width = image.width;
    let height = image.height;

    const newHeightWidth = this.changeHeightWidth(
      height,
      maxHeight,
      width,
      maxWidth,
    );
    canvas.width = newHeightWidth.width;
    canvas.height = newHeightWidth.height;

    width = newHeightWidth.width;
    height = newHeightWidth.height;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(0, 0, width, height);

    if (ctx.imageSmoothingEnabled && ctx.imageSmoothingQuality) {
      ctx.imageSmoothingQuality = "high";
    }

    ctx.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL(`image/${compressFormat}`, qualityDecimal);
  }

  static b64toByteArrays(b64Data, contentType) {
    contentType = contentType || "image/jpeg";
    const sliceSize = 512;

    const byteCharacters = atob(
      b64Data
        .toString()
        .replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, ""),
    );
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    return byteArrays;
  }

  static b64toBlob(b64Data, contentType) {
    const byteArrays = this.b64toByteArrays(b64Data, contentType);
    return new Blob(byteArrays, {
      type: contentType,
      lastModified: new Date(),
    });
  }

  static b64toFile(b64Data, fileName, contentType) {
    const byteArrays = this.b64toByteArrays(b64Data, contentType);
    return new File(byteArrays, fileName, {
      type: contentType,
      lastModified: new Date(),
    });
  }

  static createResizedImage(
    file,
    maxWidth,
    maxHeight,
    compressFormat,
    quality,
    responseUriFunc,
    outputType = "base64",
  ) {
    const reader = new FileReader();
    if (file) {
      if (file.type && !file.type.includes("image")) {
        throw Error("File Is NOT Image!");
      } else {
        reader.readAsDataURL(file);
        reader.onload = () => {
          const image = new Image();
          image.src = reader.result;
          image.onload = function () {
            const resizedDataUrl = Resizer.resizeImage(
              image,
              maxWidth,
              maxHeight,
              compressFormat,
              quality,
            );
            const contentType = `image/${compressFormat}`;
            switch (outputType) {
              case "blob":
                const blob = Resizer.b64toBlob(resizedDataUrl, contentType);
                responseUriFunc(blob);
                break;
              case "base64":
                responseUriFunc(resizedDataUrl);
                break;
              case "file":
                let fileName = file.name;
                let fileNameWithoutFormat = fileName
                  .toString()
                  .replace(/(png|jpeg|jpg|webp)$/i, "");
                let newFileName = fileNameWithoutFormat.concat(
                  compressFormat.toString(),
                );
                const newFile = Resizer.b64toFile(
                  resizedDataUrl,
                  newFileName,
                  contentType,
                );
                responseUriFunc(newFile);
                break;
              default:
                responseUriFunc(resizedDataUrl);
            }
          };
        };
        reader.onerror = (error) => {
          throw Error(error);
        };
      }
    } else {
      throw Error("File Not Found!");
    }
  }
}
export default {
  imageFileResizer: (
    file,
    maxWidth,
    maxHeight,
    compressFormat,
    quality,
    responseUriFunc,
    outputType,
  ) => {
    return Resizer.createResizedImage(
      file,
      maxWidth,
      maxHeight,
      compressFormat,
      quality,
      responseUriFunc,
      outputType,
    );
  },
};
