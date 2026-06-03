import React, { useState } from "react";
import { Image, Post } from "~/lib/type";
import ImageInput from "~/components/admin/common/image/imageInput";
import { TYPE } from "~/db/schema";
import { useRouter } from "@tanstack/react-router";
import { getCreateItemFn, getUpdateItemFn } from "~/server-functions";
import { useAlert } from "~/components/admin/context/alertProvider";
import FormButtons from "~/components/admin/common/button/FormButtons";

interface Props {
  post: Post;
  onClose: () => void;
}

export default function PostForm({ post, onClose }: Props) {
  const alert = useAlert();
  const router = useRouter();
  const [workPost, setWorkPost] = useState<Post>(post);
  const fn =
    post.id === 0 ? getCreateItemFn(TYPE.POST) : getUpdateItemFn(TYPE.POST);

  const action = async (formData: FormData) => {
    const { message, isError } = await fn({ data: formData });
    alert(message, isError);
    router.invalidate();
    if (!isError) onClose();
  };

  return (
    <form action={action}>
      <input name="type" type="hidden" value={TYPE.POST} />
      <input name="id" type="hidden" value={post.id} />
      <input
        onChange={(e) => setWorkPost({ ...workPost, title: e.target.value })}
        name="title"
        type="text"
        value={workPost.title}
        placeholder="Titre"
        required
      />
      <br />
      <input
        name="date"
        type="number"
        min={1980}
        max={2100}
        value={new Date(workPost.date).getFullYear().toString()}
        onChange={(e) =>
          setWorkPost({ ...workPost, date: new Date(e.target.value) })
        }
        required
      />
      <br />
      <textarea
        onChange={(e) => setWorkPost({ ...workPost, text: e.target.value })}
        name="text"
        rows={7}
        value={workPost.text}
        placeholder="Texte (facultatif)"
      />
      <ImageInput
        key="main"
        filesPath={workPost.images
          .filter((i) => i.isMain)
          .map((i: Image) => `/images/${TYPE.POST}/sm/${i.filename}`)}
        smallImageOption={true}
        title="Image principale - une seule image (facultative)"
        isMain={true}
      />
      <ImageInput
        key="album"
        filesPath={workPost.images
          .filter((i) => !i.isMain)
          .map((i: Image) => `/images/${TYPE.POST}/sm/${i.filename}`)}
        isMultiple={true}
        smallImageOption={true}
        isMain={false}
        title="Album d'images (facultatif)"
      />
      <FormButtons onCancel={onClose} />
    </form>
  );
}
