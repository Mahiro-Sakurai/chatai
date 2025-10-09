import { NextResponse } from "next/server";

const BASE_URL = process.env.DIFY_BASE_URL || "https://api.dify.ai/v1";
const API_KEY = process.env.DIFY_API_KEY!;

export const runtime = "edge";

export async function POST(req: Request) {
    console.log("API route hit!");

    if (!API_KEY) {
        return NextResponse.json({ error: "DIFY_API_KEY not set" }, { status: 500 });
    }

    const { message, userId } = await req.json();
    console.log("Received message:", message);

    const upstream = await fetch(`${BASE_URL}/chat-messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            inputs: { count: message.count },
            query: message.content,
            user: userId || "anon",
            response_mode: "streaming",
            conversation_id: message.conversationID ?? undefined,
        }),
    });

    if (!upstream.ok || !upstream.body) {
        const errorText = await upstream.text().catch(() => "Unknown error");
        console.error("Dify stream failed:", errorText);
        return NextResponse.json({ error: "Dify stream error" }, { status: 500 });
    }

    const decoder = new TextDecoder("utf-8");
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const reader = upstream.body!.getReader();

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    controller.enqueue(encoder.encode(chunk));
                }
            } catch (err) {
                console.error("Streaming error:", err);
                controller.error(err);
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}
