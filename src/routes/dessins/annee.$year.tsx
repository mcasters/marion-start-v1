import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound";
import { PostErrorComponent } from "~/components/PostError";
import WorkPage from "~/components/work/workPage";
import { TYPE } from "~/db/schema";
import { getDrawingByYearFn } from "~/server-functions/drawings";

export const Route = createFileRoute("/dessins/annee/$year")({
  loader: async ({ params: { year } }) =>
    await getDrawingByYearFn({ data: year }),
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
