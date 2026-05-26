import { createFileRoute } from "@tanstack/react-router";
import WorkIndex from "~/components/work/workIndex";
import { TYPE } from "~/db/schema";
import { getDrawingCategoriesFn } from "~/server-functions/drawings";
import { seo } from "~/utils/seo";
import { KEY_META } from "~/constants/admin";

export const Route = createFileRoute("/dessins/")({
  loader: async () => await getDrawingCategoriesFn(),
  head: ({ match }) => {
    const { metas } = match.context;
    return {
      meta: [
        ...seo({
          title: metas.get(KEY_META.TITLE_DRAWING_HOME),
          description: metas.get(KEY_META.DESCRIPTION_DRAWING_HOME),
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
    <WorkIndex type={TYPE.DRAWING} categories={categories} years={years} />
  );
}
