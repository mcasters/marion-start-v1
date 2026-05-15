import {
  ChangeEvent,
  HTMLProps,
  JSX,
  useEffect,
  useRef,
  useState,
} from "react";
import s from "./image.module.css";
import ArrowDown from "~/components/icons/arrowDown";
import DeleteButton from "~/components/admin/common/button/deleteButton";
import { validateFile } from "~/utils/imageUtils";
import { useAlert } from "~/components/admin/context/alertProvider";
import { FILE_TYPES } from "~/constants/image";

interface Props extends HTMLProps<HTMLInputElement> {
  filesPath: string[];
  smallImageOption: boolean;
  isMultiple?: boolean;
  onChange?: () => void;
  isMain?: boolean;
  required?: boolean;
  title?: string;
}

export default function ImageInput({
  filesPath,
  smallImageOption,
  onChange,
  isMultiple = false,
  isMain = false,
  required = false,
  title = "",
}: Props): JSX.Element {
  const alert = useAlert();
  const [acceptSmallImage, setAcceptSmallImage] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [filenamesToDelete, setFilenamesToDelete] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  useEffect(() => {
    const dataTransfer = new DataTransfer();
    newFiles.forEach((file) => dataTransfer.items.add(file));
    if (inputRef.current) inputRef.current.files = dataTransfer.files;
  }, [newFiles]);

  const handleDelete = (filepath: string) => {
    const filename = filepath.substring(filepath.lastIndexOf("/") + 1);
    setFilenamesToDelete((prev) =>
      isMultiple ? [...prev, filename] : [filename],
    );
    if (onChange) onChange();
  };

  const handleAdd = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || [];
    if (files.length === 0) return;

    let resizedFiles: File[] = [];
    let weight = 0;
    const increaseWeight = (size: number) => (weight += size);
    for await (const file of files) {
      const result = await validateFile(file, increaseWeight, acceptSmallImage);
      if (result.isError) {
        if (inputRef.current) inputRef.current.value = "";
        alert(result.message, result.isError, 5000);
        return;
      }
      resizedFiles.push(file);
    }

    if (!isMultiple) {
      setNewFiles(resizedFiles);
      if (filesPath.length)
        setFilenamesToDelete([
          filesPath[0].substring(filesPath[0].lastIndexOf("/") + 1),
        ]);
    } else {
      setNewFiles((prev) => [...prev, ...resizedFiles]);
    }
    if (onChange) onChange();
  };

  return (
    <div className="inputContainer">
      <input
        name={isMain ? "mainFilenameToDelete" : "filenamesToDelete"}
        type="hidden"
        value={filenamesToDelete}
      />
      {title && <p className="label">{title}</p>}
      <div className={s.dropZone}>
        <div
          className={s.previewNewImages}
          style={{
            border: newFiles.length ? "2px solid var(--color-main)" : undefined,
          }}
        >
          {newFiles.map((file, i) => (
            <div key={i} className={s.imageWrapper}>
              <SizedImage
                src={URL.createObjectURL(file)}
                width={100}
                height={100}
              />
            </div>
          ))}
        </div>
        <div className={s.dropIcon}>
          <ArrowDown width={50} height={50} />
        </div>
        <div>
          {`Glisser ${isMultiple ? "les" : "la"} photo${isMultiple ? "s" : ""} ou cliquer`}
          <br />
          <small>(jpeg, jpg ou png)</small>
        </div>
        <input
          ref={inputRef}
          type="file"
          name={isMain ? "mainFileToAdd" : "filesToAdd"}
          onChange={handleAdd}
          multiple={isMultiple}
          accept={FILE_TYPES.toString()}
          className={s.input}
          required={required && !newFiles.length && !filesPath.length}
        />
      </div>
      {smallImageOption && (
        <label className={s.smallImageLabel}>
          <input
            type="checkbox"
            checked={acceptSmallImage}
            onChange={() => setAcceptSmallImage(!acceptSmallImage)}
          />
          Accepter les images en dessous de 2000 px de large
        </label>
      )}
      <div className={s.previewExistantImages}>
        {filesPath.length === 0 && <p className={s.emptyInfo}>Aucune image</p>}
        {filesPath.map((filepath, i) => {
          const filename = filepath.substring(filepath.lastIndexOf("/") + 1);
          if (
            !filenamesToDelete.find(
              (filenameToDelete) => filenameToDelete === filename,
            )
          )
            return (
              <div key={i} className={s.imageWrapper}>
                <SizedImage src={filepath} />
                <DeleteButton onDelete={() => handleDelete(filepath)} />
              </div>
            );
        })}
      </div>
    </div>
  );
}

const SizedImage = ({
  src,
  width = 150,
  height = 150,
}: {
  src: string;
  width?: number;
  height?: number;
}): JSX.Element => {
  const [size, setSize] = useState({ naturalWidth: 0, naturalHeight: 0 });
  return (
    <img
      src={src}
      onLoad={(e) => {
        const { naturalWidth, naturalHeight } = e.target as HTMLImageElement;
        setSize({ naturalWidth, naturalHeight });
      }}
      width={size.naturalWidth}
      height={size.naturalHeight}
      alt="Preview"
      style={
        size.naturalWidth / size.naturalHeight >= 1.03
          ? {
              width,
              height: "auto",
            }
          : {
              width: "auto",
              height,
            }
      }
      className={s.image}
    />
  );
};
