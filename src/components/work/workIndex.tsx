import React from "react";
import s from "~/components/work/workIndex.module.css";
import { TYPE } from "~/db/schema";
import { Link } from "@tanstack/react-router";
import { Category } from "~/lib/type";

interface Props {
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING;
  categories: Category[];
  years: number[];
}
export default function WorkIndex({ categories, type, years }: Props) {
  const title =
    type === TYPE.PAINTING
      ? "Les peintures"
      : type === TYPE.SCULPTURE
        ? "Les sculptures"
        : "Les dessins";
  return (
    <>
      <h1 className="hidden">{title}</h1>
      <h2 className={`${s.tagTitle}`}>Par séries :</h2>
      <ul className={s.ul}>
        {categories.map((category) => {
          const noImage =
            category.key === "no-category" || category.imageFilename === "";
          return (
            <li key={category.key}>
              <Link
                to={`/${type}s/categorie/$categoryKey`}
                params={{ categoryKey: String(category.key) }}
                className={`${s.link} ${s.categoryLink}`}
                title={`Catégorie ${category.value}`}
              >
                {!noImage && (
                  <>
                    <img
                      src={`/images/${type}/sm/${category.imageFilename}`}
                      alt=""
                      width={250}
                      height={250}
                      style={{ objectFit: "cover" }}
                      className={s.image}
                    />
                    <p>{category.value}</p>
                  </>
                )}
                {noImage && <>{category.value}</>}
              </Link>
            </li>
          );
        })}
      </ul>
      <h2 className={`${s.tagTitle}`}>Par années :</h2>
      <ul className={s.ul}>
        {years.map((year) => {
          return (
            <li key={year}>
              <Link
                to={`/${type}s/annee/$year`}
                params={{ year: String(year) }}
                className={`${s.link} ${s.yearLink}`}
                title={`Année ${year}`}
              >
                {year}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
