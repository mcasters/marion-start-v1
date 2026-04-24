"use client";
import Modal from "~/components/admin/common/modal";
import useModal from "~/components/hooks/useModal";
import { ReactNode } from "react";

interface Props {
  renderForm: (arg0: () => void) => ReactNode;
  modalWidth: number;
}
export default function AddButton({ renderForm, modalWidth }: Props) {
  const { isOpen, toggle } = useModal();

  return (
    <>
      <button onClick={toggle} className="adminButton">
        Ajouter
      </button>
      <Modal isOpen={isOpen} title={`Ajout`} width={modalWidth}>
        {renderForm(toggle)}
      </Modal>
    </>
  );
}
