import { AddProductTextFieldProps } from "@/lib/types/components/General/form_fields";
import { AddProductFieldLabel } from "./AddFieldLabel";

export function AddProductTextField({
  label,
  required,
  placeholder,
  value,
  onChange,
  minLength,
  maxLength,
  pattern,
  title,
  type = "text",
  autoComplete,
}: AddProductTextFieldProps) {
  return (
    <div>
      <AddProductFieldLabel label={label} required={required} />
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value ?? ""}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        title={title}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="input-focus w-full rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-900 transition placeholder:text-slate-400"
      />
    </div>
  );
}