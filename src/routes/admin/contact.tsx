import { createFileRoute } from "@tanstack/react-router";
import { LABEL } from "~/db/schema";
import s from "~/components/admin/admin.module.css";
import { TextForm } from "~/components/admin/text/textForm";
import { getContactContentFn } from "~/server-functions/content";

export const Route = createFileRoute("/admin/contact")({
  loader: async () => await getContactContentFn(),
  ssr: false,
  component: RouteComponent,
});

function RouteComponent() {
  const contents = Route.useLoaderData();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Contenus de la page contact</h1>
      <TextForm
        dbKey={LABEL.ADDRESS}
        isMeta={false}
        text={contents.get(LABEL.ADDRESS)?.text ?? ""}
        title="Adresse"
      />
      <div className="separate" />
      <TextForm
        dbKey={LABEL.PHONE}
        isMeta={false}
        text={contents.get(LABEL.PHONE)?.text ?? ""}
        title="Téléphone"
        isPhone
      />
      <div className="separate" />
      <TextForm
        dbKey={LABEL.EMAIL}
        isMeta={false}
        text={contents.get(LABEL.EMAIL)?.text ?? ""}
        title="E-mail"
        isEmail
      />
      <div className="separate" />
      <TextForm
        dbKey={LABEL.TEXT_CONTACT}
        isMeta={false}
        text={contents.get(LABEL.TEXT_CONTACT)?.text ?? ""}
        title="Texte d'accompagnement (facultatif)"
      />
    </div>
  );
}
