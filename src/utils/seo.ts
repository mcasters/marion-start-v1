import { KEY_META } from "~/constants/admin";
import { KeyMeta } from "~/lib/type";

const generalSeo = (metas: Map<KeyMeta, string>) => {
  return [
    { charSet: "utf-8" },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    { name: "keywords", content: metas.get(KEY_META.KEYWORDS) },
    { name: "og:type", content: "website" },
    { name: "og:siteName", content: metas.get(KEY_META.SITE_TITLE) },
    { name: "og:locale", content: "fr" },
    { name: "og:url", content: metas.get(KEY_META.URL) },
    { name: "twitter:image", content: "/logo-512.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "og:image", content: "/logo-512.png" },
  ];
};

const pageSeo = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return [
    { title },
    { name: "description", content: description },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "og:title", content: title },
    { name: "og:description", content: description },
  ];
};

export const seo = ({
  title = "",
  description = "",
  metas,
}: {
  title: string | undefined;
  description: string | undefined;
  metas: Map<KeyMeta, string>;
}) => {
  return [...pageSeo({ title, description }), ...generalSeo(metas)];
};
