// src/components/Chat/OptionButtons.tsx
type Props = {
    options: string[];
    onSelect: (option: string) => void;
};

export default function OptionButtons({ options, onSelect }: Props) {
    return (
        <div className="mt-2 flex flex-col space-y-2">
            {options.map((opt, i) => (
                <button
                    key={i}
                    onClick={() => onSelect(opt)}
                    className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-100 text-left text-sm"
                >
                    {opt}
                </button>
            ))}
        </div>
    );
}
