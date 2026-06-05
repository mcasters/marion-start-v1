import { createFileRoute } from "@tanstack/react-router";
import { getHomeImagesFn, getHomeTextFn } from "~/server-functions/content";
import s from "~/components/admin/admin.module.css";
import { HomeLayoutForm } from "~/components/admin/home/homeLayoutForm";
import { LABEL } from "~/db/schema";
import { TextForm } from "~/components/admin/text/textForm";
import ImagesForm from "~/components/admin/common/image/imagesForm";

export const Route = createFileRoute("/admin/home")({
  loader: async () => {
    return {
      text: await getHomeTextFn(),
      images: await getHomeImagesFn(),
    };
  },
  ssr: false,
  component: RouteComponent,
});

function RouteComponent() {
  const { text, images } = Route.useLoaderData();
  return (
    <div className={s.container}>
      <h1 className={s.title1}>{`Contenus de la page Home`}</h1>
      <h2 className={s.title2}>Mise en page</h2>
      <HomeLayoutForm />
      <div className="separate" />
      <h2 className={s.title2}>{`Texte d'accueil (facultatif)`}</h2>
      <TextForm
        dbKey={LABEL.INTRO}
        text={text ?? ""}
        isMeta={false}
        isTextArea
      />
      <div className="separate" />
      <h2
        className={s.title2WithInfo}
      >{`Images affichées sur écran mobile`}</h2>
      <p>
        {`(Une ou plusieurs images possible. Format portrait mieux adapté)`}
      </p>
      <ImagesForm
        images={images.filter((i) => i.isMain)}
        isMultiple={true}
        label={LABEL.SLIDER}
        acceptSmallImage={false}
        isMain={true}
      />
      <div className="separate" />
      <h2
        className={s.title2WithInfo}
      >{`Images affichées sur écran ordinateur`}</h2>
      <p>
        {`(Une ou plusieurs images possible. Format paysage ou carré mieux adapté)`}
      </p>
      <ImagesForm
        images={images.filter((i) => !i.isMain)}
        isMultiple={true}
        label={LABEL.SLIDER}
        acceptSmallImage={false}
        isMain={false}
      />
    </div>
  );
}
