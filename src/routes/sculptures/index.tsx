import { createFileRoute } from "@tanstack/react-router";
import { getSculptureCategoriesFn } from "~/server-functions/sculptures";
import WorkIndex from "~/components/work/workIndex";
import { TYPE } from "~/db/schema";
import { seo } from "~/utils/seo";
import { KEY_META } from "~/constants/admin";

export const Route = createFileRoute("/sculptures/")({
  loader: async () => await getSculptureCategoriesFn(),
  head: ({ match }) => {
    const { metas } = match.context;
    return {
      meta: [
        ...seo({
          title: metas.get(KEY_META.TITLE_SCULPTURE_HOME),
          description: metas.get(KEY_META.DESCRIPTION_SCULPTURE_HOME),
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
    <WorkIndex type={TYPE.SCULPTURE} categories={categories} years={years} />
  );
}
