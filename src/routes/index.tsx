import { createFileRoute } from "@tanstack/react-router";
import { getHomeImages } from "~/server-functions/content";
import Slideshow from "~/components/image/slideshow/slideshow";

export const Route = createFileRoute("/")({
  loader: () => getHomeImages(),
  component: Home,
});

function Home() {
  const images = Route.useLoaderData();
  return <Slideshow images={images} />;
}
