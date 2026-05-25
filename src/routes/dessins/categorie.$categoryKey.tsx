import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound";
import { WorkErrorComponent } from "~/components/WorkError";
import { TYPE } from "~/db/schema";
import WorkPage from "~/components/work/workPage";
import { getDrawingsByCategoryFn } from "~/server-functions/drawings";
import { seo } from "~/utils/seo";
import { KEY_META } from "~/constants/admin";

export const Route = createFileRoute("/dessins/categorie/$categoryKey")({
  loader: async ({ params: { categoryKey } }) =>
    await getDrawingsByCategoryFn({ data: categoryKey }),
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
          title: `${metas.get(KEY_META.TITLE_DRAWING)} - ${text}`,
          description: `${metas.get(KEY_META.DESCRIPTION_DRAWING)} - ${text}`,
          metas,
        }),
      ],
    };
  },
  component: RouteComponent,
  errorComponent: WorkErrorComponent,
  notFoundComponent: () => {
    return <NotFound>Dessins introuvables</NotFound>;
  },
});

function RouteComponent() {
  const { works, category } = Route.useLoaderData();
  const text =
    category.value === "Sans catégorie"
      ? category.value
      : `Série ${category.value}`;

  return (
    <WorkPage
      title={`Dessins - ${text}`}
      tag={category.value}
      category={category}
      works={works}
      type={TYPE.DRAWING}
    />
  );
}
