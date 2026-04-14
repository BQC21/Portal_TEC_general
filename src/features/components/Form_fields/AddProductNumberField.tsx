import { AddProductFieldLabel } from "./AddProductFieldLabel";

type AddProductNumberFieldProps = {
    label: string;
    required?: boolean;
    value: number;
    onChange: (value: number) => void;
    step?: string;
    min?: string;
    disabled?: boolean;
};

export function AddProductNumberField({
        label,
        required,
        value,
        onChange,
        step,
        min,
        disabled,
    }: AddProductNumberFieldProps) {
    return (
        <div>
        <AddProductFieldLabel label={label} required={required} />
        <input
            type="number"
            required={required}
            value={Number.isFinite(value) ? value : 0}
            onChange={(event) => onChange(Number(event.target.value))}
            step={step}
            min={min}
            disabled={disabled}
            placeholder={label}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-900 outline-none transition placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-500 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100"
        />
        </div>
    );
}