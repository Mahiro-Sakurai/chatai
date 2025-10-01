// src/features/chat/useChat.ts
import { useState } from "react";
import { Message } from "./types";

export function useChat(initialMessages: Message[] = []) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [value, setValue] = useState("");
    const [count, setCount] = useState(0); // 👈 裏で管理

    async function sendMessage() {
        if (!value.trim()) return;

        // 会話回数++
        const newCount = count + 1;
        setCount(newCount);

        // ユーザーメッセージを追加
        setMessages((prev) => [...prev, { role: "user", content: value }]);

        // 入力欄をリセット
        setValue("");

        // データ成型
        const Pdata = `{
        "content": "${value}",
        "count": ${newCount}
        }`;

        // API に送信（会話回数, メッセージ）
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: Pdata }),
        });

        const Gdata: Message = await res.json();
        setMessages((prev) => [...prev, Gdata]);
    }

    return {
        value,
        setValue,
        messages,
        setMessages,
        sendMessage
    };
}
