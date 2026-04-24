import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/presentation")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Présentation de Marion Casters</div>;
}
