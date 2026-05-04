import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound";
import { PostErrorComponent } from "~/components/PostError";
import WorkPage from "~/components/work/workPage";
import { TYPE } from "~/db/schema";
import { getDrawingByYearFn } from "~/server-functions/drawings";
import { seo } from "~/utils/seo";
import { KEY_META } from "~/constants/admin";

export const Route = createFileRoute("/dessins/annee/$year")({
  loader: async ({ params: { year } }) =>
    await getDrawingByYearFn({ data: year }),
  head: ({ match }) => {
    const { metas } = match.context;
    const year = match.loaderData?.year;
    return {
      meta: [
        ...seo({
          title: `${metas.get(KEY_META.TITLE_DRAWING)} - Année ${year}`,
          description: `${metas.get(KEY_META.DESCRIPTION_DRAWING)} de l'année ${year}`,
          metas,
        }),
      ],
    };
  },
  errorComponent: PostErrorComponent,
  component: RouteComponent,
  notFoundComponent: () => {
    return <NotFound>Dessins introuvables</NotFound>;
  },
});

function RouteComponent() {
  const { works, year } = Route.useLoaderData();
  return <WorkPage tag={year} works={works} type={TYPE.DRAWING} />;
}
