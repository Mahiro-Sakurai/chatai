"use client";

import InputForm from "@/components/Chat/InputForm";
import MessageList from "@/components/Chat/MessageList";
import { useChat } from "@/features/chat/useChat";

export default function Page() {
  const { value, setValue, messages, sendMessage } = useChat();

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
