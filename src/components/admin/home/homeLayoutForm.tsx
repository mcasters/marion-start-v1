import React, { useState } from "react";
import s from "~/components/admin/admin.module.css";
import { getHomeLayout } from "~/utils/commonUtils";
import { KEY_META } from "~/constants/admin";
import { updateMeta } from "~/server-functions/meta";
import { Route } from "~/routes/admin";

export function HomeLayoutForm() {
  const { metas, useAlert } = Route.useRouteContext();
  const [value, setValue] = useState<string>(getHomeLayout(metas).toString());

  const handleChange = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const value = e.currentTarget.value;
    setValue(value);
    const res = await updateMeta({
      data: { key: KEY_META.HOME_LAYOUT, text: value },
    });
    useAlert(res.message, res.isError);
  };

  return (
    <form className={s.layoutForm}>
      <p className={s.layoutLabel}>
        <button
          onClick={handleChange}
          className={
            value === "1"
              ? `${s.buttonLayoutSelected} ${s.buttonLayout}`
              : s.buttonLayout
          }
          value="1"
        >
          <img
            src="/assets/home-nav-layout.png"
            alt=""
            width={200}
            height={130}
          />
        </button>
        <span>
          <strong>{`Texte séparé :`}</strong>
          <br />
          {`Le titre du site, les menus, et l'introduction sont situés au dessus de l'image.`}
        </span>
      </p>
      <p className={s.layoutLabel}>
        <button
          onClick={handleChange}
          className={
            value === "0"
              ? `${s.buttonLayoutSelected} ${s.buttonLayout}`
              : s.buttonLayout
          }
          value="0"
        >
          <img
            src="/assets/home-plain-layout.png"
            alt=""
            width={200}
            height={130}
          />
        </button>
        <span>
          <strong>{`Texte intégré :`}</strong>
          <br />
          {`Le titre du site, les menus, et l'introduction sont situés sur l'image qui prend tout l'écran. Leur couleur doit alors être accordée avec l'image pour qu'ils restent lisibles : Mettre une seule image est sans doute plus simple.`}
        </span>
      </p>
    </form>
  );
}
