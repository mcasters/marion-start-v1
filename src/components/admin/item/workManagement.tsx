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
import SelectableListRow from "~/components/admin/common/selectableList/selectableListRow";
import CategoryForm from "~/components/admin/item/form/categoryForm";
import FilterWorkListComponent from "~/components/admin/common/selectableList/filterWorkListComponent";
import WorkForm from "~/components/admin/item/form/workForm";
import { TYPE } from "~/db/schema";
import { getDeleteCategoryFn, getDeleteFn } from "~/server-functions";

interface Props {
  works: Work[];
  categories: AdminCategory[];
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING;
}
export default function WorkManagement({ works, categories, type }: Props) {
  const deleteFn = getDeleteFn(type);
  const deleteCategoryFn = getDeleteCategoryFn(type);
  return (
    <>
      <SelectableList
        key={"works"}
        items={works}
        renderItem={(work) => (
          <SelectableListRow
            part1={work.title}
            part2={
              categories.find((category) => category.id === work.categoryId)
                ?.value || " "
            }
            part3={new Date(work.date).getFullYear().toString()}
            part4={work.isOut ? "sortie" : "Non sortie"}
            imageSrc={getThumbnailSrc(work)}
            deleteFn={() => deleteFn({ data: { id: work.id } })}
          />
        )}
        renderFilter={(getFilteredItems) => (
          <FilterWorkListComponent
            works={works}
            categories={categories}
            onFilter={getFilteredItems}
            type={type}
          />
        )}
        formToRender={(work, handleClose) => (
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
        key={"categories"}
        items={categories}
        renderItem={(category) => (
          <SelectableListRow
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
        formToRender={(category, handleClose) => (
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
