// メッセージ1つ分のUI
import { Message } from "@/features/chat/types";
import OptionButtons from "./OptionButtons";

type Props = {
    message: Message;
    onSelectOption: (option: string) => void;
};

export default function MessageItem({ message, onSelectOption }: Props) {
    const { role, content, options } = message;

    return (
        <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
            <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                    }`}
            >
                {content}
                {options && role === "ai" && (
                    <OptionButtons options={options} onSelect={onSelectOption} />
                )}
            </div>
        </div>
    );
}


