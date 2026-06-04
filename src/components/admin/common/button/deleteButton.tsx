import DeleteIcon from "~/components/icons/deleteIcon";
import { useAlert } from "~/components/admin/context/alertProvider";
import { useRouter } from "@tanstack/react-router";

export type DeleteButtonProps = {
  onDelete?: () => void;
  deleteFn?: () => Promise<{
    message: string;
    isError: boolean;
  }>;
  disabled?: boolean;
};
export default function DeleteButton({
  onDelete,
  deleteFn,
  disabled = false,
}: DeleteButtonProps) {
  const alert = useAlert();
  const router = useRouter();

  return (
    <button
      onClick={
        deleteFn
          ? async (e) => {
              e.stopPropagation();
              e.preventDefault();
              if (confirm("Sûr de vouloir supprimer ?")) {
                const res = await deleteFn();
                alert(res.message, res.isError);
                router.invalidate();
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
