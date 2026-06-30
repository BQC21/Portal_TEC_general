import { AddProductTextFieldProps } from "@/lib/types/components/form_fields";
import { AddProductFieldLabel } from "./AddFieldLabel";

export function AddProductTextAreaField({
        label,
        required,
        placeholder,
        value,
        onChange,
    }: AddProductTextFieldProps) {
    return (
        <div>
            <AddProductFieldLabel label={label} required={required} />
            <textarea
            required={required}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            rows={4}
            className="input-focus w-full rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-900 transition placeholder:text-slate-400"
            />
        </div>
    );
}