import { SearchIcon } from "@/features/components/Icons/SearchIcon"; // ícono de búsqueda

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export function SearchBar({ value, onChange, placeholder = "Buscar..." }: SearchBarProps) {
    return (
        <div className="relative w-full">
            <SearchIcon />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-12 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
        </div>
    );
}