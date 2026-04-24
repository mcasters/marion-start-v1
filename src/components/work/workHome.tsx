"use client";
import React from "react";
import s from "~/components/work/workHome.module.css";
import { TYPE } from "~/db/schema";
import { Link } from "@tanstack/react-router";
import { Category } from "~/lib/type";

interface Props {
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING;
  categories: Category[];
  years: number[];
}
export default function WorkHome({ categories, type, years }: Props) {
  return (
    <>
      <p className={`${s.tagTitle}`}>Par séries :</p>
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
      <p className={`${s.tagTitle}`}>Par années :</p>
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
