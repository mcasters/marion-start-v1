import { createFileRoute } from "@tanstack/react-router";
import Slideshow from "~/components/image/slideshow/slideshow";
import { getHomeImagesFn } from "~/server-functions/content";
import { seo } from "~/utils/seo";
import { KEY_META } from "~/constants/admin";

export const Route = createFileRoute("/")({
  loader: async () => await getHomeImagesFn(),
  head: ({ match }) => {
    const { metas } = match.context;
    return {
      meta: [
        ...seo({
          title: metas.get(KEY_META.TITLE_HOME),
          description: metas.get(KEY_META.DESCRIPTION_HOME),
          metas,
        }),
      ],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const images = Route.useLoaderData();
  return <Slideshow images={images} />;
}
