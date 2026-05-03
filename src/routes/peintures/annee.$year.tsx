import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound";
import { PostErrorComponent } from "~/components/PostError";
import { getPaintingByYearFn } from "~/server-functions/paintings";
import WorkPage from "~/components/work/workPage";
import { TYPE } from "~/db/schema";

export const Route = createFileRoute("/peintures/annee/$year")({
  loader: async ({ params: { year } }) =>
    await getPaintingByYearFn({ data: year }),
  errorComponent: PostErrorComponent,
  component: RouteComponent,
  notFoundComponent: () => {
    return <NotFound>Peintures introuvables</NotFound>;
  },
});

function RouteComponent() {
  const { works, year } = Route.useLoaderData();
  return <WorkPage tag={year} works={works} type={TYPE.PAINTING} />;
}
