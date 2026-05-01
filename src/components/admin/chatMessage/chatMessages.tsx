import { useRef, useState } from "react";
import style from "~/components/admin/admin.module.css";
import s from "./chatMessage.module.css";
import { Message } from "~/lib/type";
import ChatMessage from "~/components/admin/chatMessage/chatMessage";
import { getEmptyMessage } from "~/utils/commonUtils";
import useMenuManagement from "~/components/hooks/useMenuManagement";
import { addMessageFn, updateMessageFn } from "~/server-functions/message";
import {
  rootRouteId,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";

type Props = {
  dbMessages: Message[];
};

export default function ChatMessages({ dbMessages }: Props) {
  const { session, structTheme } = useRouteContext({ from: rootRouteId });
  const router = useRouter();
  const textAreaRef = useRef<HTMLTextAreaElement>(null!);
  const [message, setMessage] = useState<Message>(getEmptyMessage());
  const { indexOpen, toggle } = useMenuManagement();

  const onUpdate = (msg: Message) => {
    setMessage(msg);
    toggle(-1);
    textAreaRef.current.focus();
  };

  const handleSubmit = async (formData: FormData) => {
    const res =
      message?.id !== 0
        ? await updateMessageFn({ data: formData })
        : await addMessageFn({ data: formData });
    if (!res.isError) {
      setMessage(getEmptyMessage());
      router.invalidate();
    }
  };

  return (
    <section className={style.container}>
      <div className={s.messagesHeader}>
        <div className={s.shadow} />
      </div>
      <div className={`${s.messages} list`}>
        {dbMessages &&
          dbMessages.map((msg, index) => {
            const isOwner = msg.author?.email === session?.email;

            return (
              <ChatMessage
                key={index}
                message={msg}
                editableMessage={
                  isOwner
                    ? {
                        onUpdate: () => onUpdate(msg),
                        openMenu: (arg0: boolean) =>
                          arg0 ? toggle(index) : toggle(-1),
                        isOpen: index === indexOpen,
                      }
                    : undefined
                }
              />
            );
          })}
      </div>
      <br />
      <form action={handleSubmit}>
        <input type="hidden" name="userId" value={session?.userId} />
        <input type="hidden" name="id" value={message.id} />
        <textarea
          ref={textAreaRef}
          name="text"
          placeholder="Ton message"
          value={message.text}
          onChange={(e) => setMessage({ ...message, text: e.target.value })}
          className={s.editArea}
          rows={5}
        />
        <br />
        <button
          type="submit"
          className={s.chatButton}
          style={{ backgroundColor: structTheme.other.main.text }}
        >
          {message.id !== 0 ? "Mettre à jour" : "Envoyer"}
        </button>
        <button
          onClick={() => setMessage(getEmptyMessage())}
          className={s.chatButton}
          style={{ backgroundColor: structTheme.other.main.text }}
        >
          Annuler
        </button>
      </form>
    </section>
  );
}
