import { NextResponse } from "next/server";
import { validateMessage } from "@/app/utils/validatoin";

const BASE_URL = process.env.DIFY_BASE_URL || "https://api.dify.ai/v1";
const API_KEY = process.env.DIFY_API_KEY!;

export async function POST(req: Request) {
    console.log("API route hit!");

    try {
        if (!API_KEY) {
            throw new Error("DIFY_API_KEY is not on server");
        }

        const { message, userId } = await req.json().catch(() => ({}));
        console.log("Received message:", message);

        // validateMessage(message);

        const upstream = await fetch(`${BASE_URL}/chat-messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                inputs: {
                    count: message.count,
                    messageList: message.messageList,
                },
                query: message.content,
                user: userId || "anon",
                response_mode: "blocking",
            }),
        });

        if (!upstream.ok) {
            const errorResult = await upstream.json().catch(() => ({}));
            console.error("Dify request failed\n", errorResult);
            return NextResponse.json({ error: `Dify request failed: ${errorResult.code}` }, { status: errorResult.status });
        } else {
            const result = await upstream.json();
            console.log("Dify response:", result);
            console.log(result.metadata.retriver_resources)

            return NextResponse.json({
                role: "ai",
                content: result.answer ?? "(no answer)",
            });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            const errorMessage = error.message || "Unknown Error";
            console.error("Error message:", errorMessage);
            return NextResponse.json({ error: errorMessage }, { status: 400 });
        } else {
            console.error("Unknown error occurred");
            return NextResponse.json({ error: "Unknown error occurred" }, { status: 400 });
        }
    }
}
