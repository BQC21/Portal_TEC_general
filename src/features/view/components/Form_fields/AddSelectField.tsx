import { AddProductSelectFieldProps } from "@/lib/types/components/General/form_fields";
import { normalizeSelectOptions } from "@/lib/utils/helpers/buildForm/buildForm_functions";
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
    const normalizedOptions = normalizeSelectOptions(options);

    return (
        <div>
        <AddProductFieldLabel label={label} required={required} />
        <select
            required={required}
            disabled={disabled}
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            aria-label={label}
            className={`input-focus w-full rounded-xl border border-slate-300 px-4 py-3 text-lg transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${customClass}`}
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