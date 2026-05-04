import { createFileRoute } from "@tanstack/react-router";
import { getPaintingCategoriesFn } from "~/server-functions/paintings";
import WorkHome from "~/components/work/workHome";
import { TYPE } from "~/db/schema";
import { seo } from "~/utils/seo";
import { KEY_META } from "~/constants/admin";

export const Route = createFileRoute("/peintures/")({
  loader: async () => await getPaintingCategoriesFn(),
  head: ({ match }) => {
    const { metas } = match.context;
    return {
      meta: [
        ...seo({
          title: metas.get(KEY_META.TITLE_PAINTING_HOME),
          description: metas.get(KEY_META.DESCRIPTION_PAINTING_HOME),
          metas,
        }),
      ],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { categories, years } = Route.useLoaderData();
  return (
    <>
      <h1 className="hidden">Les peintures</h1>
      <WorkHome type={TYPE.PAINTING} categories={categories} years={years} />
    </>
  );
}
