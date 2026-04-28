"use client";

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
  displayWidth: { small: number; large: number };
  displayHeight: { small: number; large: number };
  withLightbox?: boolean;
}
export default function FormattedPhoto({
  folder,
  filename,
  width,
  height,
  alt,
  displayWidth,
  displayHeight,
  withLightbox = false,
}: Props) {
  const isSmall = useWindowRect().innerWidth < DEVICE.SMALL;
  const [index, setIndex] = useState(-1);
  const ratio = Math.round((width / height) * 10000);
  const isLandscape = ratio >= 10300;

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
              ? `${isSmall ? displayWidth.small : displayWidth.large}vw`
              : "auto",
            height: !isLandscape
              ? `${isSmall ? displayHeight.small : displayHeight.large}vh`
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
          enhancedImages={[
            {
              src: isSmall
                ? `/images/${folder}/md/${filename}`
                : `/images/${folder}/${filename}`,
              width,
              height,
              alt,
            },
          ]}
          index={index}
          onClose={() => setIndex(-1)}
          isSmall={isSmall}
        />
      )}
    </>
  );
}
