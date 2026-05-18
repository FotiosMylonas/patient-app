import type { Message } from "../services/types";
import { getShortRelativeTime } from "../services/utils";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const fromPatient = message.from === "patient";

  return (
    <div
      className={`flex ${fromPatient ? "justify-end" : "justify-start"}`}
    >
      <div className="max-w-[75%]">
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            fromPatient
              ? "bg-accent text-white rounded-br-md"
              : "bg-bg-secondary border border-border rounded-bl-md"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap ">
            {message.text}
          </p>
        </div>
        <p
          className={`text-[10px] text-text-secondary mt-1 ${
            fromPatient ? "text-right" : "text-left"
          }`}
        >
          {getShortRelativeTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}