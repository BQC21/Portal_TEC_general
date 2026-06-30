import { AddProductSelectFieldProps } from "@/lib/types/components/form_fields";
import { AddProductFieldLabel } from "./AddFieldLabel";

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
            className={`input-focus w-full rounded-xl border border-slate-300 px-4 py-3 text-lg transition ${customClass}`}
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