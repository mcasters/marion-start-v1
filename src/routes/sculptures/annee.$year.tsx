import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound";
import { PostErrorComponent } from "~/components/PostError";
import WorkPage from "~/components/work/workPage";
import { TYPE } from "~/db/schema";
import { getSculptureWorksByYearFn } from "~/server-functions/sculptures";

export const Route = createFileRoute("/sculptures/annee/$year")({
  loader: async ({ params: { year } }) =>
    await getSculptureWorksByYearFn({ data: year }),
  errorComponent: PostErrorComponent,
  component: RouteComponent,
  notFoundComponent: () => {
    return <NotFound>Sculptures introuvables</NotFound>;
  },
});

function RouteComponent() {
  const { works, year } = Route.useLoaderData();
  return <WorkPage tag={year} works={works} type={TYPE.SCULPTURE} />;
}
