import { createFileRoute } from "@tanstack/react-router";
import { TYPE } from "~/db/schema";
import s from "~/components/admin/admin.module.css";
import { getAdminPaintingCategoriesFn } from "~/server-functions/paintings";
import WorkLayoutForm from "~/components/admin/item/form/workLayoutForm";
import WorkManagement from "~/components/admin/item/workManagement";

export const Route = createFileRoute("/admin/peintures")({
  loader: async () => await getAdminPaintingCategoriesFn(),
  component: RouteComponent,
});

function RouteComponent() {
  const type = TYPE.PAINTING;
  const { works, categories } = Route.useLoaderData();

  console.log(categories.length);

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Les peintures</h1>
      <h2 className={s.title2}>Mise en page</h2>
      <WorkLayoutForm type={type} />
      <div className="separate" />
      <h2
        className={s.title2}
      >{`Gestion des peintures ( total : ${works.length} )`}</h2>
      <WorkManagement works={works} categories={categories} type={type} />
    </div>
  );
}
