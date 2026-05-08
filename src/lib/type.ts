/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-empty-object-type */

import { JSX } from "react";
import { KEY_META } from "~/constants/admin";
import {
  drawing,
  drawingCategory,
  LABEL,
  meta,
  painting,
  paintingCategory,
  presetColor,
  sculpture,
  sculptureCategory,
  theme,
  TYPE,
} from "~/db/schema";

type StringKeys<T> = {
  [k in keyof T]: T[k] extends string ? k : never;
}[keyof T];
export type OnlyString<T> = { [k in StringKeys<T>]: boolean };

export type PaintingDb = Omit<typeof painting.$inferSelect, "createdAt">;
export type DrawingDb = Omit<typeof drawing.$inferSelect, "createdAt">;
export type SculptureDb = Omit<typeof sculpture.$inferSelect, "createdAt">;

export type Image = {
  filename: string;
  width: number;
  height: number;
  isMain: boolean;
};

export interface Item {
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING | TYPE.POST;
  title: string;
  date: Date;
  images: Image[];
}

export type Work = Item & {
  id: number;
  technique: string;
  description: string;
  height: number;
  width: number;
  isToSell: boolean;
  price: number | null;
  sold: boolean;
  categoryId: number | null;
  isOut: boolean;
  outInformation: string;
  length: number;
};

export type Post = Item & {
  id: number;
  text: string;
};

export type Slide = {
  src: string;
  width: number;
  height: number;
  alt: string;
  work?: Work;
  title?: string;
  year?: number;
};

export type PaintingCategory = typeof paintingCategory.$inferSelect;
export type SculptureCategory = typeof sculptureCategory.$inferSelect;
export type DrawingCategory = typeof drawingCategory.$inferSelect;
export type Category = PaintingCategory | SculptureCategory | DrawingCategory;

export type Theme = typeof theme.$inferSelect;
export type PresetColor = typeof presetColor.$inferSelect;

export type Meta = typeof meta.$inferSelect;

export interface Admin {
  id: number;
  type: TYPE;
}

export type AdminCategory = Category & {
  filenames: string[];
  count: number;
};

export type FileInfo = {
  filename: string;
  width: number;
  height: number;
  isMain: boolean;
};

export type Content = Map<LABEL, { text: string; image?: Image }>;

export interface User {
  id: number;
  email: string;
  isAdmin: boolean;
}

export type Session = {
  userId?: number;
  email?: string;
  isAdmin?: boolean;
};

export type Message = {
  id: number;
  date: Date;
  dateUpdated: Date | null;
  text: string;
  author: { email: string };
};

export enum Layout {
  MONO,
  DOUBLE,
  MULTIPLE,
  SCULPTURE,
}

export enum ItemDarkBackground {
  FALSE,
  TRUE,
}

export enum HomeLayout {
  PLAIN,
  NAV,
}

export type KeyMeta = (typeof KEY_META)[keyof typeof KEY_META];

export type ThemeTarget = {
  background: string;
  text: string;
  link: string;
  linkHover: string;
};

export type ThemeGenTarget = {
  lineColor: string;
  titleColor: string;
  lightbox: string;
  lightboxText: string;
};

export type ThemePage = {
  menu1: ThemeTarget;
  menu2: ThemeTarget;
  main: ThemeTarget;
  footer: ThemeTarget;
};

export type StructTheme = {
  general: ThemeGenTarget;
  home: ThemePage;
  work: ThemePage;
  other: ThemePage;
};

export type DragListElement = {
  id: number;
  element: JSX.Element;
  order: number;
};

export type Filter = {
  categoryFilter: number;
  yearFilter: number;
  isOutFilter: number;
};
