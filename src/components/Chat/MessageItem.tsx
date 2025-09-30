// メッセージ1つ分のUI

type Props = {
    role: "user" | "ai";
    content: string;
};

export default function MessageItem({ role, content }: Props) {
    return (
        <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
            <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${role === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                    }`}
            >
                {content}
            </div>
        </div>
    );
}

