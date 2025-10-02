import { NextResponse } from "next/server";
import { validateMessage } from "@/app/utils/validatoin";

const BASE_URL = process.env.DIFY_BASE_URL || "https://api.dify.ai/v1";
const API_KEY = process.env.DIFY_API_KEY!;

export async function POST(req: Request) {
    console.log("API route hit!");

    try {
        // API_KEYのチェック
        if (!API_KEY) {
            throw new Error("DIFY_API_KEY is not on server");
        }

        // クライアントからのjsonをパース
        const { message, userId } = await req.json().catch(() => ({}));
        console.log("Received message:", message)

        // バリデーション
        validateMessage(message);

        // Dify に渡す
        const upstream = await fetch(`${BASE_URL}/chat-messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                inputs: {
                    count: message.count, // 会話往復数
                    messageList: message.messageList, // 会話履歴
                },
                query: message.content, // ユーザーの入力
                user: userId || "anon", // ユーザーID（なければ"anon"）
                response_mode: "blocking", // not streaming
            }),
        });

        // Dify APIのレスポンスが成功かどうかをチェック
        if (!upstream.ok) {
            const errorResult = await upstream.json().catch(() => ({}));
            console.error("Dify request failed\n", errorResult)
            return NextResponse.json({ error: `Dify request failed: ${errorResult.code}` }, { status: errorResult.status });
        } else {
            // Dify の返答をパース
            const result = await upstream.json();
            console.log("Dify response:", result);

            // content だけ抽出して返す
            return NextResponse.json({
                role: "ai",
                content: result.answer ?? "(no answer)",
            });
        }
    } catch (error: any) {
        const errorMessage = error?.message || "Unknown Error";
        console.error("Error message:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }


}
