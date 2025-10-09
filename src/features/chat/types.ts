export type Message = {
    role: "user" | "ai";
    content: string;
};

/*
型ガード
    引数をMessageだと強制的に認識させてプロパティにアクセス 
    ⇒ if(アクセスできない) = undefined 
    ⇒ false
obj is Message 
    TypeScript に対して「もし obj が Message 型だったら、
    その後の処理では obj を Message 型として扱える」という情報を伝えるために使われる。
*/
export function isMessage(obj: Message): obj is Message {
    return (obj as Message).role !== undefined;
}