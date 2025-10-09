import { useState } from "react";
import { Message } from "./types";
import { stringifyMassageList } from "./types";

export function useChat(initialMessages: Message[] = []) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [value, setValue] = useState("");
    const [count, setCount] = useState(0);

    async function sendMessage() {
        console.log("sendMessage hit")
        if (!value.trim() || messages.length === 0) {
            console.error("Invalid data to send")
            return
        };

        const newCount = count + 1;
        setCount(newCount);
        setMessages((prev) => [...prev, { role: "user", content: value }]);
        setValue("");

        const strMessages: string = stringifyMassageList(messages)
        const Pdata = {
            content: value,
            count: newCount,
            messageList: strMessages
        };
        console.log("Sending to API:", Pdata);

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: Pdata }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.log(errorData)
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: `${errorData.error}` }]);
        } else {
            const Gdata = await res.json();
            console.log("Response from API:", Gdata);
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: Gdata.content ?? "(no answer)" }
            ]);
        }
    }

    return {
        value,
        setValue,
        messages,
        setMessages,
        sendMessage
    };
}
