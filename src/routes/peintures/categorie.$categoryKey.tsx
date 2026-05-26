import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound";
import { WorkErrorComponent } from "~/components/WorkError";
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
  component: RouteComponent,
  errorComponent: WorkErrorComponent,
  notFoundComponent: () => {
    return <NotFound>Peintures introuvables</NotFound>;
  },
});

function RouteComponent() {
  const { works, category } = Route.useLoaderData();
  const text =
    category.value === "Sans catégorie"
      ? category.value
      : `Série ${category.value}`;

  return <WorkPage works={works} category={category} type={TYPE.PAINTING} />;
}
