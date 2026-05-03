import { TYPE } from "~/db/schema";
import {
  createPaintingCategoryFn,
  createPaintingFn,
  deletePaintingCategoryFn,
  deletePaintingFn,
  updatePaintingCategoryFn,
  updatePaintingFn,
} from "~/server-functions/paintings";
import {
  createSculptureCategoryFn,
  createSculptureFn,
  deleteSculptureCategoryFn,
  deleteSculptureFn,
  updateSculptureCategoryFn,
  updateSculptureFn,
} from "~/server-functions/sculptures";
import {
  createDrawingCategoryFn,
  createDrawingFn,
  deleteDrawingCategoryFn,
  deleteDrawingFn,
  updateDrawingCategoryFn,
  updateDrawingFn,
} from "~/server-functions/drawings";
import {
  createPostFn,
  deletePostFn,
  updatePostFn,
} from "~/server-functions/posts";

export const getCreateFn = (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING | TYPE.POST,
) => {
  switch (type) {
    case TYPE.PAINTING:
      return createPaintingFn;
    case TYPE.SCULPTURE:
      return createSculptureFn;
    case TYPE.DRAWING:
      return createDrawingFn;
    case TYPE.POST:
      return createPostFn;
  }
};

export const getUpdateFn = (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING | TYPE.POST,
) => {
  switch (type) {
    case TYPE.PAINTING:
      return updatePaintingFn;
    case TYPE.SCULPTURE:
      return updateSculptureFn;
    case TYPE.DRAWING:
      return updateDrawingFn;
    case TYPE.POST:
      return updatePostFn;
  }
};

export const getDeleteFn = (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING | TYPE.POST,
) => {
  switch (type) {
    case TYPE.PAINTING:
      return deletePaintingFn;
    case TYPE.SCULPTURE:
      return deleteSculptureFn;
    case TYPE.DRAWING:
      return deleteDrawingFn;
    case TYPE.POST:
      return deletePostFn;
  }
};

export const getCreateCategoryFn = (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING,
) => {
  switch (type) {
    case TYPE.PAINTING:
      return createPaintingCategoryFn;
    case TYPE.SCULPTURE:
      return createSculptureCategoryFn;
    case TYPE.DRAWING:
      return createDrawingCategoryFn;
  }
};

export const getUpdateCategoryFn = (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING,
) => {
  switch (type) {
    case TYPE.PAINTING:
      return updatePaintingCategoryFn;
    case TYPE.SCULPTURE:
      return updateSculptureCategoryFn;
    case TYPE.DRAWING:
      return updateDrawingCategoryFn;
  }
};

export const getDeleteCategoryFn = (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING,
) => {
  switch (type) {
    case TYPE.PAINTING:
      return deletePaintingCategoryFn;
    case TYPE.SCULPTURE:
      return deleteSculptureCategoryFn;
    case TYPE.DRAWING:
      return deleteDrawingCategoryFn;
  }
};
