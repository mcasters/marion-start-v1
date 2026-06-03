import s from "~/components/admin/admin.module.css";
import React from "react";
import { AdminCategory, Work } from "~/lib/type";
import AddButton from "~/components/admin/common/button/addButton";
import {
  getEmptyAdminCategory,
  getEmptyWork,
  getThumbnailSrc,
} from "~/utils/commonUtils";
import SelectableList from "~/components/admin/common/selectableList/selectableList";
import SelectableRow from "~/components/admin/common/selectableList/selectableRow";
import CategoryForm from "~/components/admin/item/form/categoryForm";
import FilterComponent from "~/components/admin/common/selectableList/filterComponent";
import WorkForm from "~/components/admin/item/form/workForm";
import { TYPE } from "~/db/schema";
import { getDeleteCategoryFn, getDeleteItemFn } from "~/server-functions";

interface Props {
  works: Work[];
  categories: AdminCategory[];
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING;
}
export default function WorkManagement({ works, categories, type }: Props) {
  const deleteItemFn = getDeleteItemFn(type);
  const deleteCategoryFn = getDeleteCategoryFn(type);

  return (
    <>
      <SelectableList
        key="works"
        items={works}
        renderRow={(work) => (
          <SelectableRow
            part1={work.title}
            part2={
              categories.find((category) => category.id === work.categoryId)
                ?.value || " "
            }
            part3={new Date(work.date).getFullYear().toString()}
            part4={work.isOut ? "sortie" : "Non sortie"}
            imageSrc={getThumbnailSrc(work)}
            deleteFn={() => deleteItemFn({ data: { id: work.id } })}
          />
        )}
        renderFilter={(getFilteredItems) => (
          <FilterComponent
            works={works}
            categories={categories}
            onFilter={getFilteredItems}
            type={type}
          />
        )}
        renderUpdateForm={(work, handleClose) => (
          <WorkForm work={work} categories={categories} onClose={handleClose} />
        )}
      />
      <AddButton
        renderForm={(toggle) => (
          <WorkForm
            work={getEmptyWork(type)}
            categories={categories}
            onClose={toggle}
          />
        )}
        modalWidth={900}
      />
      <div className="separate" />
      <h2 className={s.title2}>Gestion des catégories</h2>
      <SelectableList
        key="categories"
        items={categories}
        renderRow={(category) => (
          <SelectableRow
            part1={category.value}
            part2={`${category.count} ${category.workType}(s)`}
            imageSrc={getThumbnailSrc(category)}
            deleteFn={
              category.id === 0 || category.count > 0
                ? undefined
                : () => deleteCategoryFn({ data: { id: category.id } })
            }
          />
        )}
        renderUpdateForm={(category, handleClose) => (
          <CategoryForm adminCategory={category} onClose={handleClose} />
        )}
      />
      <AddButton
        renderForm={(toggle) => (
          <CategoryForm
            adminCategory={getEmptyAdminCategory(type)}
            onClose={toggle}
          />
        )}
        modalWidth={700}
      />
    </>
  );
}
