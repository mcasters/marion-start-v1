import { createFileRoute } from "@tanstack/react-router";
import { TextForm } from "~/components/admin/text/textForm";
import { KEY_META, SEO } from "~/constants/admin";
import { KeyMeta } from "~/lib/type";
import { Fragment } from "react";

export const Route = createFileRoute("/admin/meta")({
  component: RouteComponent,
});

function RouteComponent() {
  const { metas } = Route.useRouteContext();
  const isM = metas.get(KEY_META.OWNER)?.startsWith("M");

  return (
    <>
      <h1>Gestion des métadonnées</h1>
      <h3>
        (Données accessibles par les moteurs de recherche, pour le
        référencement)
      </h3>
      {Object.entries(SEO).map(([k, value]) => {
        const key = k as KeyMeta;
        if (!isM && (key.endsWith("Drawing") || key.endsWith("DrawingHome")))
          return;
        const isTextArea = key.startsWith("description") || key === "keywords";
        return (
          <Fragment key={key}>
            {!isTextArea && (
              <TextForm
                dbKey={key}
                isMeta
                text={metas.get(key) || ""}
                title={value}
                metaLayout={true}
              />
            )}
            {isTextArea && (
              <>
                <TextForm
                  dbKey={key}
                  isMeta
                  text={metas.get(key) || ""}
                  title={value}
                  metaLayout={true}
                />
                <span>
                  <br />
                  <br />
                  ***
                </span>
              </>
            )}
          </Fragment>
        );
      })}
    </>
  );
}
