import { Category, ItemDarkBackground, Layout, Work } from "~/lib/type";
import React from "react";
import s from "~/components/work/workPage.module.css";
import { getWorkLayout } from "~/utils/commonUtils";
import WorkLayout from "~/components/work/workLayout";
import Gallery from "~/components/image/gallery/gallery";
import { TYPE } from "~/db/schema";
import { rootRouteId, useRouteContext } from "@tanstack/react-router";

interface Props {
  tag: string;
  works: Work[];
  category?: Category;
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING;
}
export default function WorkPage({ tag, works, category, type }: Props) {
  const { metas } = useRouteContext({ from: rootRouteId });
  const [itemLayout, itemDarkBackground] = getWorkLayout(metas, type);

  return (
    <>
      <div className={s.infoCategory}>
        <h2 className={s.tagTitle}>{tag}</h2>
        {category && (category.title !== "" || category.text !== "") && (
          <div className={s.categoryContent}>
            <h3>{category.title}</h3>
            <br />
            <p>{category.text}</p>
          </div>
        )}
      </div>
      <div
        className={`${s.content} ${itemLayout === Layout.DOUBLE ? s.doubleContent : undefined} ${itemDarkBackground === ItemDarkBackground.TRUE ? s.darkBackground : ""}`}
      >
        {itemLayout === Layout.MULTIPLE && <Gallery items={works} />}
        {itemLayout !== Layout.MULTIPLE &&
          works.map((item, i) => (
            <WorkLayout key={i} layout={itemLayout} work={item} />
          ))}
      </div>
    </>
  );
}
