import { createFileRoute } from "@tanstack/react-router";
import { getSculptureCategories } from "~/server-functions/sculptures";
import WorkHome from "~/components/work/workHome";
import { TYPE } from "~/db/schema";

export const Route = createFileRoute("/sculptures/")({
  loader: async () => await getSculptureCategories(),
  component: RouteComponent,
});

function RouteComponent() {
  const { categories, years } = Route.useLoaderData();
  return (
    <>
      <h1 className="hidden">Les sculptures</h1>
      <WorkHome type={TYPE.SCULPTURE} categories={categories} years={years} />
    </>
  );
}
