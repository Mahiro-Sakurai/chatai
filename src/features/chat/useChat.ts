// src/features/chat/useChat.ts
import { useState } from "react";
import { Message } from "./types";

export function useChat(initialMessages: Message[] = []) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [value, setValue] = useState("");

    async function sendMessage() {
        if (!value.trim()) return;

        // ユーザーメッセージを追加
        setMessages((prev) => [...prev, { role: "user", content: value }]);

        // 入力欄をリセット
        setValue("");

        // API に送信
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: value }),
        });

        const data: Message = await res.json();
        setMessages((prev) => [...prev, data]);


    }

    return {
        value,
        setValue,
        messages,
        setMessages,
        sendMessage,
    };
}
