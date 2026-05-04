import s from "~/components/admin/admin.module.css";
import React from "react";
import { Post } from "~/lib/type";
import AddButton from "~/components/admin/common/button/addButton";
import { getEmptyPost, getThumbnailSrc } from "~/utils/commonUtils";
import SelectableList from "~/components/admin/common/selectableList/selectableList";
import SelectableListRow from "~/components/admin/common/selectableList/selectableListRow";
import PostForm from "~/components/admin/item/form/postForm";
import { TYPE } from "~/db/schema";
import { getDeleteFn } from "~/server-functions";

interface Props {
  posts: Post[];
}
export default function PostManagement({ posts }: Props) {
  const deleteFn = getDeleteFn(TYPE.POST);
  return (
    <>
      <h2 className={s.title2}>Liste des posts</h2>
      <SelectableList
        key={"posts"}
        items={posts}
        renderItem={(post) => {
          return (
            <SelectableListRow
              part1={post.title}
              part2={new Date(post.date).getFullYear().toString()}
              imageSrc={getThumbnailSrc(post)}
              deleteFn={() => deleteFn({ data: { id: post.id } })}
            />
          );
        }}
        formToRender={(post, handleClose) => (
          <PostForm post={post} onClose={handleClose} />
        )}
      />
      <AddButton
        renderForm={(toggle) => (
          <PostForm post={getEmptyPost()} onClose={toggle} />
        )}
        modalWidth={900}
      />
    </>
  );
}
