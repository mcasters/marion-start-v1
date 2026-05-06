import React, { useMemo, useState } from "react";
import { EnhancedImage, Post, Work } from "~/lib/type";
import s from "./gallery.module.css";
import Lightbox from "~/components/image/lightbox/lightbox";
import useWindowRect from "~/components/hooks/useWindowRect";
import { DEVICE } from "~/constants/image";
import { KEY_META } from "~/constants/admin";
import { getEnhancedImages } from "~/utils/imageUtils";
import { rootRouteId, useRouteContext } from "@tanstack/react-router";

interface Props {
  items: Work[] | Post[];
}

export default function Gallery({ items }: Props) {
  const { metas } = useRouteContext({ from: rootRouteId });
  const [index, setIndex] = useState(-1);
  const isSmall = useWindowRect().innerWidth < DEVICE.SMALL;
  const isWork = "technique" in items[0];
  const enhancedImages: EnhancedImage[] = useMemo(() => {
    return getEnhancedImages(items, isSmall, isWork, metas.get(KEY_META.OWNER));
  }, [items, isSmall]);

  return (
    <>
      <div className={s.container}>
        {enhancedImages.map((image, i) => {
          return (
            <img
              key={i}
              src={image.littleScr!}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className={`${s.image}`}
              onClick={() => setIndex(i)}
              title="Agrandir"
              loading={i < 10 ? "eager" : undefined}
            />
          );
        })}
      </div>
      <Lightbox
        enhancedImages={enhancedImages}
        index={index}
        onClose={() => setIndex(-1)}
        isSmall={isSmall}
      />
    </>
  );
}
