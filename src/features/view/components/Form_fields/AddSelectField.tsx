import { AddProductSelectFieldProps, SelectOption } from "@/lib/types/components/form_fields";
import { AddProductFieldLabel } from "./AddFieldLabel";

function normalizeOptions(options: AddProductSelectFieldProps["options"]): SelectOption[] {
    return options.map((option) =>
        typeof option === "string" ? { value: option, label: option } : option
    );
}

export function AddProductSelectField({
    label,
    required,
    options,
    value,
    disabled,
    onChange,
    customClass = "", // Default to empty string
}: AddProductSelectFieldProps) {
    const normalizedOptions = normalizeOptions(options);

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
            {normalizedOptions.map((option) => (
            <option key={option.value || option.label} value={option.value}>
                {option.label}
            </option>
            ))}
        </select>
        </div>
    );
}