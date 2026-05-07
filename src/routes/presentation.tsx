import { createFileRoute } from "@tanstack/react-router";
import { getPresentationContentFn } from "~/server-functions/content";
import { LABEL } from "~/db/schema";
import s from "~/styles/page.module.css";
import FormattedPhoto from "~/components/image/formattedPhoto";
import { KEY_META } from "~/constants/admin";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/presentation")({
  loader: async ({ context }) => {
    const content = await getPresentationContentFn();
    const owner = context.metas.get(KEY_META.OWNER);
    return { content, owner };
  },
  head: ({ match }) => {
    const { metas } = match.context;
    return {
      meta: [
        ...seo({
          title: metas.get(KEY_META.TITLE_PRESENTATION),
          description: metas.get(KEY_META.DESCRIPTION_PRESENTATION),
          metas,
        }),
      ],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { content, owner } = Route.useLoaderData();
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
          alt={`Photo de ${owner}`}
          displayMaxVW={{ small: 80, large: 35 }}
          displayMaxVH={{ small: 40, large: 40 }}
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
