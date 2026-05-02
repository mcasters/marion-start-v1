import React, { useState } from "react";
import s from "~/components/admin/admin.module.css";
import { getWorkLayout } from "~/utils/commonUtils";
import { TYPE } from "~/db/schema";
import { rootRouteId, useRouteContext } from "@tanstack/react-router";
import { updateMetaFn } from "~/server-functions/meta";
import { useAlert } from "~/components/admin/context/alertProvider";

type Props = {
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING;
};

export default function WorkLayoutForm({ type }: Props) {
  const { metas } = useRouteContext({ from: rootRouteId });
  const alert = useAlert();
  const [itemLayout, itemDarkBackground] = getWorkLayout(metas, type);
  const [layout, setLayout] = useState<string>(itemLayout.toString());
  const [darkBackground, setDarkBackground] = useState<boolean>(
    itemDarkBackground === 1,
  );

  const action = async () => {
    const res = await updateMetaFn({
      data: {
        key:
          type === TYPE.PAINTING
            ? "paintingLayout"
            : type === TYPE.SCULPTURE
              ? "sculptureLayout"
              : "drawingLayout",
        text: "",
        layout: layout,
        darkBackground: darkBackground ? "1" : "0",
      },
    });
    alert(res.message, res.isError);
  };

  return (
    <form action={action} className={s.layoutForm}>
      {(type === TYPE.PAINTING || type === TYPE.DRAWING) && (
        <>
          <p className={s.layoutLabel}>
            <button
              onClick={() => setLayout("0")}
              className={
                layout === "0"
                  ? `${s.buttonLayoutSelected} ${s.buttonLayout}`
                  : s.buttonLayout
              }
            >
              <img
                src="/assets/mono-layout.png"
                alt=""
                width={200}
                height={130}
              />
            </button>
            <span>
              <strong>{`Une seule image dans la largeur :`}</strong>
              <br />
              {`Les œuvres se suivent, l'image est plus grande, et la description est à côté.`}
            </span>
          </p>
          <p className={s.layoutLabel}>
            <button
              onClick={() => setLayout("1")}
              className={
                layout === "1"
                  ? `${s.buttonLayoutSelected} ${s.buttonLayout}`
                  : s.buttonLayout
              }
            >
              <img
                src="/assets/double-layout.png"
                alt=""
                width={200}
                height={130}
              />
            </button>
            <span>
              <strong>{`Deux images dans la largeur :`}</strong>
              <br />
              {`Les œuvres sont individualisées, leur description est en
                dessous.`}
            </span>
          </p>
        </>
      )}
      {type === TYPE.SCULPTURE && (
        <p className={s.layoutLabel}>
          <button
            onClick={() => setLayout("3")}
            className={
              layout === "3"
                ? `${s.buttonLayoutSelected} ${s.buttonLayout}`
                : s.buttonLayout
            }
          >
            <img
              src="/assets/sculpture-layout.png"
              alt=""
              width={200}
              height={130}
            />
          </button>
          <span>
            <strong>{`Images de la sculpture groupées :`}</strong>
            <br />
            {`Les sculptures sont individualisées, leur description est en
              dessous. Les images d'une même œuvre étant groupées ensemble, il est plus joli qu'elles aient toutes le même ratio (rapport largeur/hauteur)`}
          </span>
        </p>
      )}
      <p className={s.layoutLabel}>
        <button
          onClick={() => setLayout("2")}
          className={
            layout === "2"
              ? `${s.buttonLayoutSelected} ${s.buttonLayout}`
              : s.buttonLayout
          }
        >
          <img
            src="/assets/gallery-layout.png"
            alt=""
            width={200}
            height={130}
          />
        </button>
        <span>
          <strong>{`Galerie : toutes les images s'imbriquent :`}</strong>
          <br />
          {`Vision d'ensemble, toutes les œuvres sont ensembles, et leur description n'apparait que lorsqu'on ouvre la "lightbox" (lorsqu'on clic sur l'image et qu'elle s'affiche en grand sur fond noir).`}
        </span>
      </p>
      <br />
      <br />
      <p className={s.layoutLabel}>
        <button
          onClick={() => setDarkBackground(!darkBackground)}
          className={
            darkBackground
              ? `${s.buttonLayoutSelected} ${s.buttonDarkBackground}`
              : `${s.buttonDarkBackground}`
          }
        />
        <strong>Zone plus foncée derrière les œuvres</strong>
      </p>
    </form>
  );
}
