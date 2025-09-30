export type Message = {
    role: "user" | "ai";
    content: string;
    options?: string;
};