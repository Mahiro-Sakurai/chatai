"use client";

import InputForm from "@/components/Chat/InputForm";
import MessageList from "@/components/Chat/MessageList";
import { useChat } from "@/features/chat/useChat";
import { Message } from "@/features/chat/types";


export default function Page() {
  // 初期メッセージを渡す
  const { value, setValue, messages, sendMessage } = useChat([
    { role: "ai", content: "こんにちは！ご用件をどうぞ。" },
  ]);



  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <MessageList messages={messages} />
      <InputForm
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      />
    </div>
  );
}
