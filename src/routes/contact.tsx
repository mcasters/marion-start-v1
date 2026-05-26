import { createFileRoute } from "@tanstack/react-router";
import { getContactContentFn } from "~/server-functions/content";
import { KEY_META } from "~/constants/admin";
import { LABEL } from "~/db/schema";
import s from "~/styles/page.module.css";
import InstagramIcon from "~/components/icons/instagramIcon";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/contact")({
  loader: async () => await getContactContentFn(),
  head: ({ match }) => {
    const { metas } = match.context;
    return {
      meta: [
        ...seo({
          title: metas.get(KEY_META.TITLE_CONTACT),
          description: metas.get(KEY_META.DESCRIPTION_CONTACT),
          metas,
        }),
      ],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const content = Route.useLoaderData();
  const { metas } = Route.useRouteContext();
  const owner = metas.get(KEY_META.OWNER);
  const instagram = metas.get(KEY_META.INSTAGRAM);
  const phone = content.get(LABEL.PHONE)?.text;
  const email = content.get(LABEL.EMAIL)?.text;
  const text = content.get(LABEL.TEXT_CONTACT)?.text;

  return (
    <>
      <h1 className="hidden">{`Contacter ${owner}`}</h1>
      <address className={s.section}>
        <p>{owner}</p>
        <p>{content.get(LABEL.ADDRESS)?.text}</p>
        <br />
        <p>
          <a href={`tel:+33${phone}`}>{phone}</a>
        </p>
        <br />
        <p>
          <a href={`mailto:${email}`}>{email}</a>
        </p>
        {owner?.startsWith("T") && instagram && (
          <>
            <br />
            <br />
            <br />
            <a href={instagram} target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
            </a>
          </>
        )}
      </address>
      {text !== "" && (
        <section className={s.section}>
          <br />
          <br />
          <br />
          <p>{text}</p>
        </section>
      )}
    </>
  );
}
