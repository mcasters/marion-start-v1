import React, { useState } from "react";

import s from "~/components/admin/admin.module.css";
import SubmitButton from "~/components/admin/common/button/submitButton";
import CancelButton from "~/components/admin/common/button/cancelButton";
import { AdminCategory } from "~/lib/type";
import SelectImageList from "~/components/admin/common/image/selectImageList";
import { MESSAGE } from "~/constants/admin";
import { useAlert } from "~/components/admin/context/alertProvider";
import { getCreateCategoryFn, getUpdateCategoryFn } from "~/server-functions";
import { useRouter } from "@tanstack/react-router";

interface Props {
  adminCategory: AdminCategory;
  onClose: () => void;
}
export default function CategoryForm({ adminCategory, onClose }: Props) {
  const isUpdate = adminCategory.id !== 0;
  const alert = useAlert();
  const router = useRouter();
  const [workCategory, setWorkCategory] =
    useState<AdminCategory>(adminCategory);
  const [filename, setFilename] = useState<string>(adminCategory.imageFilename);
  const type = adminCategory.workType;
  const fn = isUpdate ? getUpdateCategoryFn(type) : getCreateCategoryFn(type);

  const action = async (formData: FormData) => {
    const { message, isError } = await fn({ data: formData });
    if (!isError) onClose();
    alert(message, isError);
    router.invalidate();
  };

  return (
    <form action={action}>
      <input type="hidden" name="id" value={adminCategory.id} />
      <input type="hidden" name="type" value={adminCategory.workType} />
      <input type="hidden" name="filename" value={filename} />
      <label>
        Nom de la catégorie
        <input
          name="value"
          type="text"
          value={workCategory.value}
          onChange={(e) =>
            setWorkCategory({ ...workCategory, value: e.target.value })
          }
          required
        />
      </label>
      {!isUpdate && (
        <p>
          <small>{MESSAGE.categoryImage}</small>
        </p>
      )}
      <label>
        Titre (facultatif)
        <input
          name="title"
          type="text"
          value={workCategory.title}
          onChange={(e) =>
            setWorkCategory({ ...workCategory, title: e.target.value })
          }
        />
      </label>
      <label>
        Texte descriptif (facultatif)
        <textarea
          name="text"
          rows={5}
          value={workCategory.text}
          onChange={(e) =>
            setWorkCategory({ ...workCategory, text: e.target.value })
          }
        />
      </label>
      <SelectImageList
        filenames={adminCategory.filenames}
        categoryFilename={workCategory.imageFilename}
        onChange={(filename) => setFilename(filename)}
        type={adminCategory.workType}
      />
      <div className={s.buttonSection}>
        <SubmitButton />
        <CancelButton onCancel={onClose} />
      </div>
    </form>
  );
}
