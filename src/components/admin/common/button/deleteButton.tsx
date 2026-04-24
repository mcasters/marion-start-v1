"use client";

import React from "react";
import DeleteIcon from "~/components/icons/deleteIcon";
import {Route} from "~/routes/admin";

export type DeleteButtonProps = {
  onDelete?: () => void;
  deleteAction?: () => Promise<{
    message: string;
    isError: boolean;
  }>;
  disabled?: boolean;
};
export default function DeleteButton({
  onDelete,
  deleteAction,
  disabled = false,
}: DeleteButtonProps) {
  const { alert } = Route.useRouteContext();

  return (
    <button
      onClick={
        deleteAction
          ? async (e) => {
              e.stopPropagation();
              e.preventDefault();
              if (confirm("Sûr de vouloir supprimer ?")) {
                const res = await deleteAction();
                alert(res.message, res.isError);
              }
            }
          : onDelete
            ? (e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete();
              }
            : undefined
      }
      className="iconButton"
      title={`${disabled ? "Ne peut pas être supprimé" : "supprimer"}`}
      disabled={disabled}
      style={{
        cursor: disabled ? "unset" : "pointer",
      }}
    >
      <DeleteIcon />
    </button>
  );
}
