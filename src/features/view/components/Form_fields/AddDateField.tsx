import { AddProductDateFieldProps } from "@/lib/types/components/form_fields";
import { AddProductFieldLabel } from "./AddFieldLabel";

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
                value={value ?? ""}
                onChange={(event) => onChange(event.target.value)}
                min={min}
                max={max}
                disabled={disabled}
                aria-label={label}
                className="input-focus w-full rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-900 transition disabled:bg-slate-100 disabled:text-slate-500"
            />
        </div>
    );
}
