import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound";
import { PostErrorComponent } from "~/components/PostError";
import { getPost } from "~/server-functions/posts";
import Gallery from "~/components/image/gallery/gallery";
import s from "~/styles/page.module.css";
import FormattedPhoto from "~/components/image/formattedPhoto";
import { TYPE } from "~/db/schema";

export const Route = createFileRoute("/posts/$postId")({
  loader: ({ params: { postId } }) => getPost({ data: postId }),
  errorComponent: PostErrorComponent,
  component: RouteComponent,
  notFoundComponent: () => {
    return <NotFound>Post not found</NotFound>;
  },
});

function RouteComponent() {
  const post = Route.useLoaderData();
  const mainImage = post.images.filter((image) => image.isMain);
  const hasImageForGallery = post.images.length > mainImage.length;

  return (
    <article className={s.postContainer}>
      {mainImage.length > 0 && (
        <FormattedPhoto
          folder={TYPE.POST}
          filename={mainImage[0].filename}
          width={mainImage[0].width}
          height={mainImage[0].height}
          alt={`Photo du post "${post.title}" de ${process.env.TITLE}`}
          displayWidth={{ small: 65, large: 30 }}
          displayHeight={{ small: 35, large: 50 }}
          withLightbox={true}
        />
      )}
      <div className={s.postInfo}>
        <h2>{post.title}</h2>
        <time>{new Date(post.date).getFullYear()}</time>
        <p>
          <br />
          {post.text}
        </p>
      </div>
      {hasImageForGallery && <Gallery items={[post]} />}
    </article>
  );
}
