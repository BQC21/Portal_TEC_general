import { AddProductFieldLabel } from "./AddProductFieldLabel";

type AddProductDateFieldProps = {
    label: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    min?: string;
    max?: string;
    disabled?: boolean;
};

export function AddProductDateField({
    label,
    required,
    value,
    onChange,
    min,
    max,
    disabled,
}: AddProductDateFieldProps) {
    return (
        <div>
            <AddProductFieldLabel label={label} required={required} />
            <input
                type="date"
                required={required}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                min={min}
                max={max}
                disabled={disabled}
                aria-label={label}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-900 outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100"
            />
        </div>
    );
}
