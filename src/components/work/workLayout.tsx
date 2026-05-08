import s from "./workLayout.module.css";
import { Layout, Work } from "~/lib/type";
import React, { useMemo, useState } from "react";
import Lightbox from "~/components/image/lightbox/lightbox";
import { KEY_META } from "~/constants/admin";
import { DEVICE, IMAGE_INFO } from "~/constants/image";
import useWindowRect from "~/components/hooks/useWindowRect";
import { rootRouteId, useRouteContext } from "@tanstack/react-router";
import { getSizeText } from "~/utils/commonUtils";
import { TYPE } from "~/db/schema";
import { getSlides } from "~/utils/imageUtils";

interface Props {
  work: Work;
  layout: Layout.MONO | Layout.DOUBLE | Layout.SCULPTURE;
}
export default function WorkLayout({ work, layout }: Props) {
  const { metas } = useRouteContext({ from: rootRouteId });
  const owner = metas.get(KEY_META.OWNER);
  const isSmall = useWindowRect().innerWidth < DEVICE.SMALL;
  const [index, setIndex] = useState(-1);
  const _width = isSmall
    ? IMAGE_INFO[layout].WIDTH.small
    : IMAGE_INFO[layout].WIDTH.large;
  const _height = isSmall
    ? IMAGE_INFO[layout].HEIGHT.small
    : IMAGE_INFO[layout].HEIGHT.large;
  const alt =
    work.type === TYPE.POST
      ? `Photo du post "${work.title}" de ${owner}`
      : `${work.title} - ${work.type} de ${owner}`;
  const slides = useMemo(
    () => getSlides([work], alt, isSmall),
    [work, isSmall],
  );

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
        {work.images.map((image, i) => {
          const isLandscape = image.width / image.height >= 1.03;
          const onLeft = Layout.SCULPTURE && i % 2 === 0;
          return (
            <img
              key={i}
              src={
                isSmall
                  ? `/images/${work.type}/sm/${image.filename}`
                  : `/images/${work.type}/md/${image.filename}`
              }
              width={image.width}
              height={image.height}
              style={{
                width: isLandscape ? `${_width}vw` : "auto",
                height: !isLandscape ? `${_height}vh` : "auto",
              }}
              alt={alt}
              onClick={() => setIndex(i)}
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
          slides={slides}
          index={index}
          onClose={() => setIndex(-1)}
          isSmall={isSmall}
        />
      </figure>
      <figcaption>
        <WorkInfos work={work} isMono={layout === Layout.MONO} />
      </figcaption>
    </article>
  );
}

interface ImageInfosProps {
  work: Work;
  isMono: boolean;
}

const WorkInfos = ({ work, isMono }: ImageInfosProps) => {
  return (
    <figcaption>
      {!isMono && (
        <>
          <h2>{work.title}</h2>
          <p>
            {`${work.technique} - ${getSizeText(work)} - `}
            <time>{new Date(work.date).getFullYear()}</time>
          </p>
          {work.description !== "" && (
            <p>
              <br />
              {work.description}
            </p>
          )}
          {work.isToSell && (
            <p>
              <br />
              {work.price ? `Prix : ${work.price} euros` : "À vendre"}
            </p>
          )}
          {work.sold && (
            <p>
              <br />
              {work.price ? `Prix : ${work.price} euros - Vendu` : "Vendu"}
            </p>
          )}
        </>
      )}
      {isMono && (
        <>
          <h2>{work.title}</h2>
          <p>{work.technique}</p>
          <p>{getSizeText(work)}</p>
          <p>
            <time>{new Date(work.date).getFullYear()}</time>
          </p>
          {work.description !== "" && (
            <p>
              <br />
              {work.description}
            </p>
          )}
          {work.isToSell && (
            <p>
              <br />
              {work.price ? `Prix : ${work.price} euros` : "À vendre"}
            </p>
          )}
          {work.sold && (
            <p>
              <br />
              {work.price ? `Prix : ${work.price} euros - Vendu` : "Vendu"}
            </p>
          )}
        </>
      )}
    </figcaption>
  );
};
