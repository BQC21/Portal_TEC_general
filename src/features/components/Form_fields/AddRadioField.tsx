type AddProductRadioFieldProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

export function AddProductRadioField({ label, checked, onChange }: AddProductRadioFieldProps) {
  return (
    <label className="flex items-center gap-3 text-lg font-semibold text-slate-800">
      <input type="radio" checked={checked} onChange={onChange} className="h-5 w-5 accent-orange-500" />
      {label}
    </label>
  );
}