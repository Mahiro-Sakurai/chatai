// メッセージ入力するやつ
type Props = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function InputForm({ value, onChange, onSubmit }: Props) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (value.trim() !== "") {
            onSubmit(e);
        } else {
            console.log("入力は空でない場合に送信できます");
        }
    };

    const buttonClass = value === "" ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600";

    return (
        <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
                type="text"
                name="name"
                value={value}
                onChange={onChange}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="メッセージを入力"
            />
            <button
                type="submit"
                className={`px-4 py-2 text-white rounded-lg ${value === ""
                    ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"}`}
                disabled={value === ""}
            >
                送信
            </button>
        </form>
    );
}
