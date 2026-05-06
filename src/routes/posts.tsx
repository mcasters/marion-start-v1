import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { getPosts } from "~/server-functions/posts";
import s from "~/styles/page.module.css";

export const Route = createFileRoute("/posts")({
  loader: async () => await getPosts(),
  component: RouteComponent,
});

function RouteComponent() {
  const posts = Route.useLoaderData();

  return (
    <div className={s.postWrapper}>
      <div className={s.list}>
        <h1>Posts :</h1>
        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <Link
                  to="/posts/$postId"
                  params={{
                    postId: String(post.id),
                  }}
                  className="block py-1 text-blue-800 hover:text-blue-600"
                  activeProps={{ className: "text-black font-bold" }}
                >
                  <div>{post.title.substring(0, 20)}</div>
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
