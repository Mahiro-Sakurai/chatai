"use client"

import { useState } from "react";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function Page() {
  const [value, setValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); //リロード防止
    if (!value.trim()) return; // 空なら送信しない
    console.log("submit event fired");

    // ユーザーメッセージを追加
    setMessages((prev) => [...prev, { role: "user", content: value }]);

    // API に送信
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: value }),
    });

    const data: Message = await res.json();
    console.log("API response:", data); // ←ここで中身を確認

    // AIメッセージを追加
    setMessages((prev) => [...prev, data]);

    setValue("");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("change event fired value=", e.currentTarget.value)
    setValue(e.currentTarget.value)
  }

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs ${msg.role === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          name="name"
          value={value}
          onChange={handleChange}
          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          placeholder="メッセージを入力"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          送信
        </button>
      </form>
    </div>
  );
}
