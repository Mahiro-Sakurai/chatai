// app/api/chat/route.ts
import { NextResponse } from "next/server";

const BASE_URL = process.env.DIFY_BASE_URL || "https://api.dify.ai/v1";
const API_KEY = process.env.DIFY_API_KEY!;

export async function POST(req: Request) {
    console.log("API route hit!");

    if (!API_KEY) {
        return NextResponse.json(
            { error: "DIFY_API_KEY is not set on server" },
            { status: 500 }
        );
    }

    // クライアントからのjsonをパース
    const { message, userId } = await req.json().catch(() => ({}));
    console.log("Received message:", message);
    const text = String(message ?? "").trim();
    if (!text) {
        return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    // Dify に渡す
    const upstream = await fetch(`${BASE_URL}/chat-messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            inputs: {},
            query: text,
            user: userId || "anon",
            response_mode: "blocking", // ← streaming ではなく blocking
        }),
    });


    console.log("Upstream status:", upstream.status);


    if (!upstream.ok) {
        const data = await upstream.json().catch(() => ({}));
        return NextResponse.json(
            { error: data?.message || `Dify request failed (${upstream.status})` },
            { status: upstream.status || 500 }
        );
    }

    // Dify の返答をパース
    const result = await upstream.json();
    console.log("Dify response:", result);

    // content だけ抽出して返す
    return NextResponse.json({
        role: "ai",
        content: result.answer ?? "(no answer)",
    });


}
