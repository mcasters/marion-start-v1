import { createFileRoute } from "@tanstack/react-router";
import { TYPE } from "~/db/schema";
import s from "~/components/admin/admin.module.css";
import WorkLayoutForm from "~/components/admin/item/form/workLayoutForm";
import WorkManagement from "~/components/admin/item/workManagement";
import { getAdminSculptureCategoriesFn } from "~/server-functions/sculptures";

export const Route = createFileRoute("/admin/sculptures")({
  loader: async () => await getAdminSculptureCategoriesFn(),
  ssr: false,
  component: RouteComponent,
});

function RouteComponent() {
  const type = TYPE.SCULPTURE;
  const { works, categories } = Route.useLoaderData();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Les sculptures</h1>
      <h2 className={s.title2}>Mise en page</h2>
      <WorkLayoutForm type={type} />
      <div className="separate" />
      <h2
        className={s.title2}
      >{`Gestion des Sculptures ( total : ${works.length} )`}</h2>
      <WorkManagement works={works} categories={categories} type={type} />
    </div>
  );
}
