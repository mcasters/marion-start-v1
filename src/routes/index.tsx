import { createFileRoute } from "@tanstack/react-router";
import Slideshow from "~/components/image/slideshow/slideshow";
import { getHomeImagesFn } from "~/server-functions/content";

export const Route = createFileRoute("/")({
  loader: async () => await getHomeImagesFn(),
  component: RouteComponent,
});

function RouteComponent() {
  const images = Route.useLoaderData();
  return <Slideshow images={images} />;
}
