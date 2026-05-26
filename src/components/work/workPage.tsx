import { Category, ItemDarkBackground, Layout, Work } from "~/lib/type";
import s from "~/components/work/workPage.module.css";
import { getWorkLayout } from "~/utils/commonUtils";
import WorkLayout from "~/components/work/workLayout";
import Gallery from "~/components/image/gallery/gallery";
import { TYPE } from "~/db/schema";
import { rootRouteId, useRouteContext } from "@tanstack/react-router";

interface Props {
  works: Work[];
  year?: string;
  category?: Category;
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING;
}
export default function WorkPage({ works, year, category, type }: Props) {
  const { metas } = useRouteContext({ from: rootRouteId });
  const [itemLayout, itemDarkBackground] = getWorkLayout(metas, type);
  const title =
    type === TYPE.PAINTING
      ? "Peintures"
      : type === TYPE.SCULPTURE
        ? "Sculptures"
        : "Dessins";
  const subTitle = year
    ? year
    : category
      ? category.value === "Sans catégorie"
        ? category.value
        : `Série ${category?.value}`
      : "";

  return (
    <>
      <h1 className="hidden">{`${title} - ${subTitle}`}</h1>
      <div className={s.infoCategory}>
        <h2 className={s.tagTitle}>{year || category?.value}</h2>
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
          works.map((work, i) => (
            <WorkLayout key={i} layout={itemLayout} work={work} />
          ))}
      </div>
    </>
  );
}
