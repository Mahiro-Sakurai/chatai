// メッセージ一覧を描画
// src/components/Chat/MessageList.tsx
import { Message } from "@/features/chat/types";
import MessageItem from "./MessageItem";

type Props = {
    messages: Message[];
    onSelectOption: (option: string) => void;
};

export default function MessageList({ messages, onSelectOption }: Props) {
    return (
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {messages.map((msg, i) => (
                <MessageItem key={i} message={msg} onSelectOption={onSelectOption} />
            ))}
        </div>
    );
}
