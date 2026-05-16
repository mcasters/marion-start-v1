import { useFormStatus } from "react-dom";

interface Props {
  onCancel: () => void;
  disabled?: boolean;
}

export default function FormButtons({ onCancel, disabled }: Props) {
  const { pending } = useFormStatus();

  return (
    <div>
      {pending && (
        <img
          src="/assets/loading.gif"
          alt=""
          width={50}
          height={50}
          style={{ display: "block", margin: "0 auto 20px" }}
        />
      )}
      <button
        className="adminButton"
        type="submit"
        disabled={disabled !== undefined ? disabled : false}
        style={{
          outline:
            disabled !== undefined && !disabled
              ? "2px solid var(--color-main)"
              : undefined,
        }}
      >
        Enregistrer
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          onCancel();
        }}
        className="adminButton"
        disabled={disabled}
      >
        Annuler
      </button>
    </div>
  );
}
