import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound";
import { PostErrorComponent } from "~/components/PostError";
import { getPaintingsByCategoryFn } from "~/server-functions/paintings";
import { TYPE } from "~/db/schema";
import WorkPage from "~/components/work/workPage";
import { seo } from "~/utils/seo";
import { KEY_META } from "~/constants/admin";

export const Route = createFileRoute("/peintures/categorie/$categoryKey")({
  loader: async ({ params: { categoryKey } }) =>
    await getPaintingsByCategoryFn({ data: categoryKey }),
  head: ({ match }) => {
    const { metas } = match.context;
    const categoryName = match.loaderData?.category.value;
    const text =
      categoryName === "Sans catégorie"
        ? categoryName
        : `Série ${categoryName}`;
    return {
      meta: [
        ...seo({
          title: `${metas.get(KEY_META.TITLE_PAINTING)} - ${text}`,
          description: `${metas.get(KEY_META.DESCRIPTION_PAINTING)} - ${text}`,
          metas,
        }),
      ],
    };
  },
  errorComponent: PostErrorComponent,
  component: RouteComponent,
  notFoundComponent: () => {
    return <NotFound>Peintures introuvables</NotFound>;
  },
});

function RouteComponent() {
  const { works, category } = Route.useLoaderData();

  return (
    <WorkPage
      tag={category.value}
      category={category}
      works={works}
      type={TYPE.PAINTING}
    />
  );
}
