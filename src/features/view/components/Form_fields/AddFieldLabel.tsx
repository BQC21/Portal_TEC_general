import { AddProductFieldLabelProps } from "@/lib/types/components/form_fields";

export function AddProductFieldLabel({ label, required }: AddProductFieldLabelProps) {
  return (
    <label className="mb-2 block text-sm font-bold text-slate-600">
      {label} {required ? <span className="text-red-500">*</span> : null}
    </label>
  );
}