import { AddProductTextFieldProps } from "@/lib/types/components/form_fields";
import { AddProductFieldLabel } from "./AddFieldLabel";

export function AddProductUrlField({
        label,
        required,
        placeholder,
        value,
        onChange,
    }: AddProductTextFieldProps) {
    return (
        <div>
            <AddProductFieldLabel label={label} required={required} />
            <input
                type="url"
                required={required}
                placeholder={placeholder}
                value={value ?? ""}
                onChange={(event) => onChange(event.target.value)}
                className="input-focus w-full rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-900 transition placeholder:text-slate-400"
            />
        </div>
    );
}