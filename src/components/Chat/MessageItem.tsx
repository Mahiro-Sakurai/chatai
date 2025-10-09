// メッセージ1つ分のUI
import { Message } from "@/features/chat/types";
import ReactMarkdown from "react-markdown" // とりあえず

type Props = {
    message: Message;
};

export default function MessageItem({ message }: Props) {
    const { role, content } = message;

    return (
        <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
            <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                    }`}
            >
                {role === "user" ? (content) : (<ReactMarkdown>{content}</ReactMarkdown>)}


            </div>
        </div>
    );
}


