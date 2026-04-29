import { createFileRoute } from "@tanstack/react-router";
import s from "~/components/admin/admin.module.css";
import { getMessagesFn } from "~/server-functions/message";
import { KEY_META } from "~/constants/admin";
import { TextForm } from "~/components/admin/text/textForm";
import ChatMessages from "~/components/admin/chatMessage/chatMessages";
import AdminTheme from "~/components/admin/theme/adminTheme";

export const Route = createFileRoute("/admin/")({
  loader: async () => await getMessagesFn(),
  component: RouteComponent,
});

function RouteComponent() {
  const messages = Route.useLoaderData();
  const { metas } = Route.useRouteContext();
  return (
    <div className={s.adminWrapper}>
      <h1 className={s.title1}>Administration générale</h1>
      <h2 className={s.title2}>Gestion du thème</h2>
      <AdminTheme />
      <div className="separate" />
      <h2 className={s.title2}>Pied de page du site</h2>
      <TextForm
        dbKey={KEY_META.FOOTER}
        text={metas.get(KEY_META.FOOTER) || ""}
        isMeta
      />
      <div className="separate" />
      <h2 className={s.title2}>
        Tchat (si t'as des questions ou des remarques)
      </h2>
      <ChatMessages dbMessages={messages} />
    </div>
  );
}
