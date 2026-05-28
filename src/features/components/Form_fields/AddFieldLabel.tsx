type AddProductFieldLabelProps = {
  label: string;
  required?: boolean;
};

export function AddProductFieldLabel({ label, required }: AddProductFieldLabelProps) {
  return (
    <label className="mb-2 block text-sm font-bold text-slate-900">
      {label} {required ? <span className="text-red-500">*</span> : null}
    </label>
  );
}