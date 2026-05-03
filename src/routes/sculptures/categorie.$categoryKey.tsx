import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound";
import { PostErrorComponent } from "~/components/PostError";
import { TYPE } from "~/db/schema";
import WorkPage from "~/components/work/workPage";
import { getSculptureByCategoryFn } from "~/server-functions/sculptures";

export const Route = createFileRoute("/sculptures/categorie/$categoryKey")({
  loader: async ({ params: { categoryKey } }) =>
    await getSculptureByCategoryFn({ data: categoryKey }),
  errorComponent: PostErrorComponent,
  component: RouteComponent,
  notFoundComponent: () => {
    return <NotFound>Sculptures introuvables</NotFound>;
  },
});

function RouteComponent() {
  const { works, category } = Route.useLoaderData();

  return (
    <WorkPage
      tag={category.value}
      category={category}
      works={works}
      type={TYPE.SCULPTURE}
    />
  );
}
