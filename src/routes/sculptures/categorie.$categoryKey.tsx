import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound";
import { PostErrorComponent } from "~/components/PostError";
import { TYPE } from "~/db/schema";
import WorkPage from "~/components/work/workPage";
import { getSculptureByCategoryFn } from "~/server-functions/sculptures";
import { seo } from "~/utils/seo";
import { KEY_META } from "~/constants/admin";

export const Route = createFileRoute("/sculptures/categorie/$categoryKey")({
  loader: async ({ params: { categoryKey } }) =>
    await getSculptureByCategoryFn({ data: categoryKey }),
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
          title: `${metas.get(KEY_META.TITLE_SCULPTURE)} - ${text}`,
          description: `${metas.get(KEY_META.DESCRIPTION_SCULPTURE)} - ${text}`,
          metas,
        }),
      ],
    };
  },
  errorComponent: PostErrorComponent,
  component: RouteComponent,
  notFoundComponent: () => {
    return <NotFound>Sculptures introuvables</NotFound>;
  },
});

function RouteComponent() {
  const { works, category } = Route.useLoaderData();

  return (
    <WorkPage
      tag={category.value}
      category={category}
      works={works}
      type={TYPE.SCULPTURE}
    />
  );
}
