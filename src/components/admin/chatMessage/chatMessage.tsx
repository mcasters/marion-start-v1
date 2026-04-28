import s from "./chatMessage.module.css";
import { Message } from "~/lib/type";
import MoreIcon from "~/components/icons/moreIcon";
import useOnClickOutside from "~/components/hooks/useOnClickOutside";
import { deleteMessage } from "~/server-functions/message";
import { rootRouteId, useRouteContext } from "@tanstack/react-router";

type Props = {
  message: Message;
  editableMessage?: {
    onUpdate: () => void;
    openMenu: (arg0: boolean) => void;
    isOpen: boolean;
  };
};

export default function ChatMessage({ message, editableMessage }: Props) {
  const { structTheme } = useRouteContext({ from: rootRouteId });
  const { ref } = useOnClickOutside(
    editableMessage ? () => editableMessage.openMenu(false) : undefined,
  );

  return (
    <div className={editableMessage ? s.textLeft : s.textRight}>
      <p
        className={s.authorName}
        style={{
          color: editableMessage
            ? structTheme.other.main.text
            : structTheme.other.main.link,
        }}
      >
        {`${message.author?.email} - ${new Date(message.date).toLocaleDateString("fr-FR")}${
          message.dateUpdated
            ? " -" +
              ` Mis à jour le ${new Date(message.dateUpdated).toLocaleDateString("fr-FR")}`
            : ""
        }`}
      </p>
      <div
        className={s.message}
        style={{
          backgroundColor: editableMessage
            ? structTheme.other.main.text
            : structTheme.other.main.link,
        }}
      >
        {editableMessage && (
          <>
            <button
              className={s.moreButton}
              onClick={() => editableMessage.openMenu(true)}
            >
              <MoreIcon />
            </button>
            {editableMessage.isOpen && (
              <div ref={ref} className={s.menu}>
                <button
                  onClick={editableMessage.onUpdate}
                  className={s.menuItemButton}
                >
                  Modifier
                </button>
                <button
                  onClick={async () => {
                    await deleteMessage({ data: { id: message.id } });
                    editableMessage.openMenu(false);
                  }}
                  className={s.menuItemButton}
                >
                  Supprimer
                </button>
              </div>
            )}
          </>
        )}
        {message.text}
      </div>
    </div>
  );
}
