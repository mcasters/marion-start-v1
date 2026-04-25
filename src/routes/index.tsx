import { createFileRoute } from "@tanstack/react-router";
import Slideshow from "~/components/image/slideshow/slideshow";
import { getHomeImages } from "~/server-functions/content";

export const Route = createFileRoute("/")({
  loader: () => getHomeImages(),
  component: Home,
});

function Home() {
  const images = Route.useLoaderData();
  return <Slideshow images={images} />;
}
