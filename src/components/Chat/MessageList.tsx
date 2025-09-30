// メッセージ一覧を描画
import MessageItem from "./MessageItem";
import { Message } from "@/features/chat/types";

type Props = {
    messages: Message[];
};

export default function MessageList({ messages }: Props) {
    return (
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {messages.map((msg, i) => (
                <MessageItem key={i} role={msg.role} content={msg.content} />
            ))}
        </div>
    );
}
