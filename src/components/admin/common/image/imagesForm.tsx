import React, { useState } from "react";
import { Image } from "~/lib/type";
import ImageInput from "~/components/admin/common/image/imageInput";
import { LABEL } from "~/db/schema";
import { updateImageContentFn } from "~/server-functions/content";
import { useRouter } from "@tanstack/react-router";
import { useAlert } from "~/components/admin/context/alertProvider";
import FormButtons from "~/components/admin/common/button/FormButtons";

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

  const action = async (formData: FormData) => {
    const res = await updateImageContentFn({ data: formData });
    alert(res.message, res.isError);
    router.invalidate();
    reset();
  };

  return (
    <form action={action}>
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
      <FormButtons onCancel={reset} disabled={!changed} />
    </form>
  );
}
