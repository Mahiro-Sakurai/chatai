import { useState } from "react";
import { Message } from "./types";

export function useChat(initialMessages: Message[] = []) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [value, setValue] = useState("");
    const [count, setCount] = useState(0);
    const [conversationID, setConversationID] = useState<string | undefined>(undefined);

    async function sendMessage() {
        console.log("sendMessage hit");

        if (!value.trim()) {
            console.error("Invalid input");
            return;
        }

        const newCount = count + 1;
        setCount(newCount);
        setMessages((prev) => [...prev, { role: "user", content: value }]);
        setValue("");

        const Pdata = {
            content: value,
            count: newCount,
            conversationID,
        };

        try {
            // ストリーム開始
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: Pdata }),
            });

            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";

            // AIのメッセージを初期追加
            setMessages((prev) => [...prev, { role: "ai", content: "" }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = line.slice(6).trim();

                        if (data === "[DONE]") {
                            console.log("Stream completed");
                            return;
                        }

                        try {
                            const json = JSON.parse(data);
                            const text = json.answer ?? json.output_text ?? "";

                            if (text) {
                                buffer += text;
                                setMessages((prev) => {
                                    const last = prev[prev.length - 1];
                                    const updated = { ...last, content: buffer };
                                    return [...prev.slice(0, -1), updated];
                                });
                            }

                            if (json.conversation_id) {
                                setConversationID(json.conversation_id);
                            }
                        } catch {
                            // JSONが未完成なときもあるのでスキップ
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Streaming error:", err);
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: "⚠️ ストリーミングに失敗しました。" },
            ]);
        }
    }

    return {
        value,
        setValue,
        messages,
        setMessages,
        sendMessage,
    };
}
