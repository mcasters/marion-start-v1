import { createFileRoute } from "@tanstack/react-router";
import { LABEL } from "~/db/schema";
import s from "~/components/admin/admin.module.css";
import { getPresentationContentFn } from "~/server-functions/content";
import ImagesForm from "~/components/admin/common/image/imagesForm";
import { TextForm } from "~/components/admin/text/textForm";

export const Route = createFileRoute("/admin/presentation")({
  loader: async () => await getPresentationContentFn(),
  ssr: false,
  component: RouteComponent,
});

function RouteComponent() {
  const contents = Route.useLoaderData();
  const image = contents.get(LABEL.PRESENTATION)?.image;

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Contenus de la page Présentation</h1>
      <ImagesForm
        label={LABEL.PRESENTATION}
        images={image ? [image] : []}
        isMultiple={false}
        acceptSmallImage={true}
        title="Image de présentation (facultatif)"
      />
      <div className="separate" />
      <TextForm
        dbKey={LABEL.PRESENTATION}
        isMeta={false}
        text={contents.get(LABEL.PRESENTATION)?.text ?? ""}
        title="Présentation (facultatif)"
        isTextArea
      />
      <div className="separate" />
      <TextForm
        dbKey={LABEL.DEMARCHE}
        isMeta={false}
        text={contents.get(LABEL.DEMARCHE)?.text ?? ""}
        title="Démarche artistique (facultatif)"
        isTextArea
      />
      <div className="separate" />
      <TextForm
        dbKey={LABEL.INSPIRATION}
        isMeta={false}
        text={contents.get(LABEL.INSPIRATION)?.text ?? ""}
        title="Inspiration (facultatif)"
        isTextArea
      />
    </div>
  );
}
