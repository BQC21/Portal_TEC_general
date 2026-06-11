import { AddProductFieldLabel } from "./AddFieldLabel";

type AddProductUrlFieldProps = {
    label: string;
    required?: boolean;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
};

export function AddProductUrlField({
        label,
        required,
        placeholder,
        value,
        onChange,
    }: AddProductUrlFieldProps) {
    return (
        <div>
            <AddProductFieldLabel label={label} required={required} />
            <input
                type="url"
                required={required}
                placeholder={placeholder}
                value={value ?? ""}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-xl border border-slate-300 
                px-4 py-3 text-lg text-slate-900 outline-none transition 
                placeholder:text-slate-400 focus:border-indigo-700 
                focus:ring-2 focus:ring-indigo-100"
            />
        </div>
    );
}