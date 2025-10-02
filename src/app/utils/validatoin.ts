import { Message } from "@/features/chat/types";

export function validateMessage(message: { content: string; count: number; messageList: Message[] }): void {
    if (!message) {
        throw new Error("message is required");
    }

    if (!message.content) {
        throw new Error("message.content is required");
    }
    if (typeof message.content !== "string" || message.content.trim() === "") {
        throw new Error("message.content must be a non-empty string");
    }

    if (typeof message.count !== "number" || message.count <= 0) {
        throw new Error("message.count must be a positive integer");
    }

    // messageListが配列であることを確認
    if (!Array.isArray(message.messageList)) {
        throw new Error("message.messageList must be an array");
    }

    // 各メッセージがMessage型であることを確認
    message.messageList.forEach((msg, index) => {
        if (typeof msg.role !== "string" || (msg.role !== "ai" && msg.role !== "user")) {
            throw new Error(`message.messageList[${index}].role must be "ai" or "user"`);
        }
        if (typeof msg.content !== "string" || msg.content.trim() === "") {
            throw new Error(`message.messageList[${index}].content must be a non-empty string`);
        }
    });
}
