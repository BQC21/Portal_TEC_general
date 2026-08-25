import { AddProductNumberFieldProps } from "@/lib/types/components/General/form_fields";
import { AddProductFieldLabel } from "./AddFieldLabel";

export function AddProductNumberField({
        label,
        required,
        value,
        onChange,
        step,
        min,
        max,
        disabled,
    }: AddProductNumberFieldProps) {
    return (
        <div>
        <AddProductFieldLabel label={label} required={required} />
        <input
            type="number"
            required={required}
            value={value === "" ? "" : Number.isFinite(value) ? value : ""}
            onChange={(event) => onChange(Number(event.target.value))}
            step={step}
            min={typeof min === "number" && Number.isFinite(min) ? min : undefined}
            max={
                typeof max === "number" &&
                Number.isFinite(max) &&
                (typeof min !== "number" || !Number.isFinite(min) || max >= min)
                    ? max
                    : undefined
            }
            disabled={disabled}
            placeholder={typeof min === "number" && Number.isFinite(min) ? String(min) : "0"}
            className="input-focus w-full rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-900 transition placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
        />
        </div>
    );
}