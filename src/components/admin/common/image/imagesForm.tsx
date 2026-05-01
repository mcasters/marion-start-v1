import React, { useState } from "react";
import s from "~/components/admin/admin.module.css";
import { Image } from "~/lib/type";
import ImageInput from "~/components/admin/common/image/imageInput";
import SubmitButton from "~/components/admin/common/button/submitButton";
import CancelButton from "~/components/admin/common/button/cancelButton";
import { LABEL } from "~/db/schema";
import { updateImageContentFn } from "~/server-functions/content";
import { useRouter } from "@tanstack/react-router";
import { useAlert } from "~/components/admin/context/alertProvider";

type Props = {
  images: Image[];
  isMultiple: boolean;
  label: LABEL;
  acceptSmallImage: boolean;
  title?: string;
  isMain?: boolean;
};

export default function ImagesForm({
  images,
  isMultiple,
  label,
  acceptSmallImage,
  title,
  isMain = false,
}: Props) {
  const router = useRouter();
  const alert = useAlert();
  const [resetInput, setResetInput] = useState<number>(0);
  const [changed, setChanged] = useState<boolean>(false);

  const reset = (): void => {
    setResetInput(resetInput + 1);
    setChanged(false);
  };

  const handleSubmit = async (formData: FormData) => {
    const res = await updateImageContentFn({ data: formData });
    alert(res.message, res.isError);
    router.invalidate();
    reset();
  };

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="key" value={label} />
      <input type="hidden" name="isMain" value={isMain?.toString()} />
      <ImageInput
        key={resetInput}
        filesPath={images.map(
          (i: Image) => `/images/miscellaneous/sm/${i.filename}`,
        )}
        isMultiple={isMultiple}
        smallImageOption={acceptSmallImage}
        onChange={() => setChanged(true)}
        title={title}
      />
      <div className={s.buttonSection}>
        <SubmitButton disabled={!changed} />
        <CancelButton disabled={!changed} onCancel={reset} />
      </div>
    </form>
  );
}
