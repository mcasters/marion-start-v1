import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "~/server-functions/auth";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async ({ location }) => {
    const session = await getSession();
    console.log("session before load admin ", session);
    if (!session) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
    return { session };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  return (
    <div>
      Hello admin : <p>{String(session)}</p>
    </div>
  );
}
