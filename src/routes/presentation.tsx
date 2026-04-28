import { createFileRoute } from "@tanstack/react-router";
import { getPresentationContent } from "~/server-functions/content";
import { LABEL } from "~/db/schema";
import s from "~/styles/page.module.css";
import FormattedPhoto from "~/components/image/formattedPhoto";

export const Route = createFileRoute("/presentation")({
  loader: () => getPresentationContent(),
  component: RouteComponent,
});

function RouteComponent() {
  const content = Route.useLoaderData();
  const image = content.get(LABEL.PRESENTATION)?.image;
  const demarche = content.get(LABEL.DEMARCHE)?.text;
  const inspiration = content.get(LABEL.INSPIRATION)?.text;

  return (
    <div className={`${s.limitedWidth} preLine`}>
      <h1 className="hidden">Présentation</h1>
      {image && (
        <FormattedPhoto
          folder="miscellaneous"
          filename={image.filename}
          width={image.width}
          height={image.height}
          alt={`Photo de ${process.env.TITLE}`}
          displayWidth={{ small: 80, large: 35 }}
          displayHeight={{ small: 40, large: 40 }}
        />
      )}
      <section className={s.section}>
        <p>{content.get(LABEL.PRESENTATION)?.text}</p>
      </section>
      {demarche && (
        <section className={s.section}>
          <h2>Démarche artistique</h2>
          <p>{demarche}</p>
        </section>
      )}
      {inspiration && (
        <section className={s.section}>
          <h2>Inspirations</h2>
          <p>{inspiration}</p>
        </section>
      )}
    </div>
  );
}
