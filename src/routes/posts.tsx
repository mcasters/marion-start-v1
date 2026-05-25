import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { getPostsFn } from "~/server-functions/posts";
import s from "~/styles/page.module.css";

export const Route = createFileRoute("/posts")({
  loader: async () => await getPostsFn(),
  component: RouteComponent,
});

function RouteComponent() {
  const posts = Route.useLoaderData();
  return (
    <div className={s.postWrapper}>
      <div className={s.list}>
        <h1>Posts</h1>
        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <Link
                  to="/posts/$postId"
                  params={{
                    postId: String(post.id),
                  }}
                >
                  {post.title.substring(0, 20)}
                  <span>
                    {" - "}
                    {post.date.getFullYear()}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <hr />
      <Outlet />
    </div>
  );
}
