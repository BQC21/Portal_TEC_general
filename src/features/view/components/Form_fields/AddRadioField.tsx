import { AddProductRadioFieldProps } from "@/lib/types/components/General/form_fields";

export function AddProductRadioField({ label, checked, onChange, disabled = false }: AddProductRadioFieldProps) {
  return (
    <label className={`flex mb-10 items-center gap-3 text-lg font-semibold text-slate-500 ${disabled ? "cursor-not-allowed opacity-60" : ""}`}>
      <input
        type="radio"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="h-5 w-5 accent-orange-500 disabled:cursor-not-allowed"
      />
      {label}
    </label>
  );
}