import { createFileRoute } from "@tanstack/react-router";
import { getPaintingCategories } from "~/server-functions/paintings";
import WorkHome from "~/components/work/workHome";
import { TYPE } from "~/db/schema";

export const Route = createFileRoute("/peintures/")({
  loader: async () => await getPaintingCategories(),
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
