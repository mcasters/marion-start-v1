import React, { useState } from "react";
import Lightbox from "~/components/image/lightbox/lightbox";
import useWindowRect from "~/components/hooks/useWindowRect";
import { DEVICE } from "~/constants/image";

interface Props {
  folder: string;
  filename: string;
  width: number;
  height: number;
  alt: string;
  displayMaxVW: { small: number; large: number };
  displayMaxVH: { small: number; large: number };
  withLightbox?: boolean;
  title?: string;
  year?: number;
}
export default function FormattedPhoto({
  folder,
  filename,
  width,
  height,
  alt,
  displayMaxVW,
  displayMaxVH,
  withLightbox = false,
  title,
  year,
}: Props) {
  const isSmall = useWindowRect().innerWidth < DEVICE.SMALL;
  const isLandscape = Math.round((width / height) * 100) >= 103;
  const [index, setIndex] = useState(-1);

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <img
          src={
            isSmall
              ? `/images/${folder}/sm/${filename}`
              : `/images/${folder}/md/${filename}`
          }
          width={width}
          height={height}
          style={{
            objectFit: "contain",
            width: isLandscape
              ? `${isSmall ? displayMaxVW.small : displayMaxVW.large}vw`
              : "auto",
            height: !isLandscape
              ? `${isSmall ? displayMaxVH.small : displayMaxVH.large}vh`
              : "auto",
            cursor: withLightbox ? "pointer" : undefined,
            margin: "auto",
          }}
          alt={alt}
          onClick={() => setIndex(0)}
          title={withLightbox ? "Agrandir" : ""}
        />
      </div>
      {withLightbox && (
        <Lightbox
          slides={
            folder === "post"
              ? [
                  {
                    src: isSmall
                      ? `/images/${folder}/md/${filename}`
                      : `/images/${folder}/${filename}`,
                    width,
                    height,
                    alt,
                    title,
                    year,
                  },
                ]
              : [
                  {
                    src: isSmall
                      ? `/images/${folder}/md/${filename}`
                      : `/images/${folder}/${filename}`,
                    width,
                    height,
                    alt,
                  },
                ]
          }
          index={index}
          onClose={() => setIndex(-1)}
          isSmall={isSmall}
        />
      )}
    </>
  );
}
