import React, { useMemo, useState } from "react";
import { Item } from "~/lib/type";
import s from "./gallery.module.css";
import Lightbox from "~/components/image/lightbox/lightbox";
import useWindowRect from "~/components/hooks/useWindowRect";
import { DEVICE } from "~/constants/image";
import { KEY_META } from "~/constants/admin";
import { rootRouteId, useRouteContext } from "@tanstack/react-router";
import { TYPE } from "~/db/schema";
import { getSlides } from "~/utils/imageUtils";

interface Props {
  items: Item[];
}

export default function Gallery({ items }: Props) {
  const { metas } = useRouteContext({ from: rootRouteId });
  const [index, setIndex] = useState(-1);
  const isSmall = useWindowRect().innerWidth < DEVICE.SMALL;
  const owner = metas.get(KEY_META.OWNER);
  const alt =
    items[0].type === TYPE.POST
      ? `Photo du post "${items[0].title}" de ${owner}`
      : `${items[0].title} - ${items[0].type} de ${owner}`;
  const slides = useMemo(
    () => getSlides(items, alt, isSmall, items[0].type !== TYPE.POST),
    [items, isSmall],
  );

  return (
    <>
      <div className={s.container}>
        {items.map((item, i) =>
          item.images.map((image, ii) => (
            <img
              key={`${i}-${ii}`}
              src={
                isSmall
                  ? `/images/${item.type}/sm/${image.filename}`
                  : `/images/${item.type}/md/${image.filename}`
              }
              alt={alt}
              width={image.width}
              height={image.height}
              className={`${s.image}`}
              onClick={() => setIndex(i)}
              title="Agrandir"
              loading={i < 10 ? "eager" : undefined}
            />
          )),
        )}
      </div>
      <Lightbox
        slides={slides}
        index={index}
        onClose={() => setIndex(-1)}
        isSmall={isSmall}
      />
    </>
  );
}
