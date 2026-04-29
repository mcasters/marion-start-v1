import { createFileRoute } from "@tanstack/react-router";
import Slideshow from "~/components/image/slideshow/slideshow";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Slideshow
      images={[{ filename: "", height: 4, width: 4, isMain: false }]}
    />
  );
}
