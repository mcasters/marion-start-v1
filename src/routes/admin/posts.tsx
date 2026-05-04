import { createFileRoute } from "@tanstack/react-router";
import s from "~/components/admin/admin.module.css";
import { getPostsFn } from "~/server-functions/posts";
import PostManagement from "~/components/admin/item/postManagement";

export const Route = createFileRoute("/admin/posts")({
  loader: async () => await getPostsFn(),
  component: RouteComponent,
});

function RouteComponent() {
  const posts = Route.useLoaderData();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Les posts</h1>
      <PostManagement posts={posts} />
    </div>
  );
}
