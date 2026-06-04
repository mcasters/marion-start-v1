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
  head: ({ match, loaderData }) => {
    const { metas } = match.context;
    const categoryName = loaderData?.category.value;
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

  return <WorkPage works={works} category={category} type={TYPE.DRAWING} />;
}
