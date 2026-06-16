import { AddProductFieldLabel } from "./AddFieldLabel";

type AddProductSelectFieldProps = {
    label: string;
    required?: boolean;
    options: string[];
    value: string;
    disabled?: boolean;
    onChange: (value: string) => void;
    customClass?: string; // Optional custom class for styling
};

export function AddProductSelectField({
    label,
    required,
    options,
    value,
    disabled,
    onChange,
    customClass = "", // Default to empty string
}: AddProductSelectFieldProps) {
    return (
        <div>
        <AddProductFieldLabel label={label} required={required} />
        <select
            required={required}
            disabled={disabled}
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            aria-label={label}
            className={`w-full rounded-xl border border-slate-300 px-4 py-3 text-lg 
                outline-none transition focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100 ${customClass}`}
        >
            {options.map((option) => (
            <option key={option} value={option}>
                {option}
            </option>
            ))}
        </select>
        </div>
    );
}