import s from "./workLayout.module.css";
import { EnhancedImage, Layout, Work } from "~/lib/type";
import React, { useMemo, useState } from "react";
import ImageInfos from "~/components/image/common/imageInfos";
import Lightbox from "~/components/image/lightbox/lightbox";
import { KEY_META } from "~/constants/admin";
import { DEVICE, IMAGE_INFO } from "~/constants/image";
import useWindowRect from "~/components/hooks/useWindowRect";
import { rootRouteId, useRouteContext } from "@tanstack/react-router";

interface Props {
  work: Work;
  layout: Layout.MONO | Layout.DOUBLE | Layout.SCULPTURE;
  priority: boolean;
}
export default function WorkLayout({ work, layout, priority }: Props) {
  const { metas } = useRouteContext({ from: rootRouteId });
  const isSmall = useWindowRect().innerWidth < DEVICE.SMALL;
  const [index, setIndex] = useState(-1);
  const _width = isSmall
    ? IMAGE_INFO[layout].WIDTH.small
    : IMAGE_INFO[layout].WIDTH.large;
  const _height = isSmall
    ? IMAGE_INFO[layout].HEIGHT.small
    : IMAGE_INFO[layout].HEIGHT.large;

  const enhancedImages: EnhancedImage[] = useMemo(() => {
    const tab: EnhancedImage[] = [];
    work.images.forEach((image) => {
      tab.push({
        littleScr: `/images/${work.type}/${isSmall ? "sm/" : "md/"}${image.filename}`,
        src: `/images/${work.type}/${isSmall ? "md/" : ""}${image.filename}`,
        width: image.width,
        height: image.height,
        alt: `${work.title} - ${work.type} de ${metas.get(KEY_META.OWNER)}`,
        title: work.title,
        year: new Date(work.date).getFullYear(),
      });
    });
    return tab;
  }, [work]);

  return (
    <article
      className={`${s.article} ${
        layout === Layout.MONO ? s.monoContainer : undefined
      }`}
    >
      <figure
        className={
          layout === Layout.SCULPTURE ? s.sculptureContainer : undefined
        }
      >
        {work.images.map((image, index) => {
          const isLandscape = image.width / image.height >= 1.03;
          const onLeft = Layout.SCULPTURE && index % 2 === 0;
          return (
            <img
              key={index}
              src={`/images/${work.type}/${isSmall ? "sm/" : "md/"}${image.filename}`}
              width={image.width}
              height={image.height}
              style={{
                width: isLandscape ? `${_width}vw` : "auto",
                height: !isLandscape ? `${_height}vh` : "auto",
              }}
              alt={`${work.title} - ${work.type} de ${metas.get(KEY_META.OWNER)}`}
              onClick={() => setIndex(index)}
              className={
                layout === Layout.SCULPTURE
                  ? onLeft
                    ? s.left
                    : s.right
                  : s.image
              }
              title="Agrandir"
            />
          );
        })}
        <Lightbox
          enhancedImages={enhancedImages}
          index={index}
          onClose={() => setIndex(-1)}
          isSmall={isSmall}
        />
      </figure>
      <figcaption>
        <ImageInfos work={work} isMono={layout === Layout.MONO} />
      </figcaption>
    </article>
  );
}
