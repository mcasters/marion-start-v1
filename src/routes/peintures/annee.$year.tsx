import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound";
import { WorkErrorComponent } from "~/components/WorkError";
import { getPaintingByYearFn } from "~/server-functions/paintings";
import WorkPage from "~/components/work/workPage";
import { TYPE } from "~/db/schema";
import { seo } from "~/utils/seo";
import { KEY_META } from "~/constants/admin";

export const Route = createFileRoute("/peintures/annee/$year")({
  loader: async ({ params: { year } }) =>
    await getPaintingByYearFn({ data: year }),
  head: ({ match }) => {
    const { metas } = match.context;
    const year = match.loaderData?.year;
    return {
      meta: [
        ...seo({
          title: `${metas.get(KEY_META.TITLE_PAINTING)} - Année ${year}`,
          description: `${metas.get(KEY_META.DESCRIPTION_PAINTING)} de l'année ${year}`,
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
  const { works, year } = Route.useLoaderData();
  return (
    <WorkPage
      title={`Peintures - ${year}`}
      tag={year}
      works={works}
      type={TYPE.PAINTING}
    />
  );
}
