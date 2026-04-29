import { useState } from "react";
import SubmitButton from "~/components/admin/common/button/submitButton";
import CancelButton from "~/components/admin/common/button/cancelButton";
import { KeyMeta } from "~/lib/type";
import s from "../admin.module.css";
import { LABEL } from "~/db/schema";
import { updateMetaFn } from "~/server-functions/meta";
import { updateContentFn } from "~/server-functions/content";
import { useAlert } from "~/components/admin/context/alertProvider";

interface Props {
  dbKey: LABEL | KeyMeta;
  isMeta: boolean;
  text: string;
  title?: string;
  isPhone?: boolean;
  isEmail?: boolean;
  metaLayout?: boolean;
}
export function InputForm({
  dbKey,
  text,
  isMeta,
  title,
  isPhone = false,
  isEmail = false,
  metaLayout = false,
}: Props) {
  const alert = useAlert();
  const [_text, set_text] = useState<string>(text);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const res = isMeta
      ? await updateMetaFn({ data: { key: dbKey, text: _text } })
      : await updateContentFn({ data: { key: dbKey, text: _text } });
    alert(res.message, res.isError);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={metaLayout ? s.metaForm : undefined}
    >
      <input type="hidden" name="key" value={dbKey} />
      <label className="inputContainer">
        {title}
        <input
          name="text"
          value={_text}
          onChange={(e) => set_text(e.target.value)}
          type={isPhone ? "tel" : isEmail ? "email" : "text"}
        />
      </label>
      <SubmitButton disabled={text === _text} />
      <CancelButton disabled={text === _text} onCancel={() => set_text(text)} />
    </form>
  );
}
