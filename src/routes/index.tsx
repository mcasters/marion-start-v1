import { createFileRoute } from "@tanstack/react-router";
import Slideshow from "~/components/image/slideshow/slideshow";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <Slideshow
      images={[{ filename: "", height: 4, width: 4, isMain: false }]}
    />
  );
}
