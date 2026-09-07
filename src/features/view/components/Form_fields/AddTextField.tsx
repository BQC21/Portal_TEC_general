import { AddProductFieldLabel } from "./AddFieldLabel";

type AddProductTextFieldProps = {
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  title?: string;
  type?: "text" | "password";
  autoComplete?: string;
};

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