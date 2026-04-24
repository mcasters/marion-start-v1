import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound";
import { PostErrorComponent } from "~/components/PostError";
import { TYPE } from "~/db/schema";
import WorkPage from "~/components/work/workPage";
import { getDrawingsByCategory } from "~/server-functions/drawings";

export const Route = createFileRoute("/dessins/categorie/$categoryKey")({
  loader: ({ params: { categoryKey } }) =>
    getDrawingsByCategory({ data: categoryKey }),
  errorComponent: PostErrorComponent,
  component: RouteComponent,
  notFoundComponent: () => {
    return <NotFound>Dessins introuvables</NotFound>;
  },
});

function RouteComponent() {
  const { works, category } = Route.useLoaderData();

  return (
    <WorkPage
      tag={category.value}
      category={category}
      works={works}
      type={TYPE.DRAWING}
    />
  );
}
