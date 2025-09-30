// 入力フォーム
type Props = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function InputForm({ value, onChange, onSubmit }: Props) {
    return (
        <form onSubmit={onSubmit} className="flex space-x-2">
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
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                送信
            </button>
        </form>
    );
}
