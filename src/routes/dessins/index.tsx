import { createFileRoute } from "@tanstack/react-router";
import WorkHome from "~/components/work/workHome";
import { TYPE } from "~/db/schema";
import { getDrawingCategories } from "~/server-functions/drawings";

export const Route = createFileRoute("/dessins/")({
  loader: () => getDrawingCategories(),
  component: RouteComponent,
});

function RouteComponent() {
  const { categories, years } = Route.useLoaderData();
  return (
    <>
      <h1 className="hidden">Les dessins</h1>
      <WorkHome type={TYPE.DRAWING} categories={categories} years={years} />
    </>
  );
}
