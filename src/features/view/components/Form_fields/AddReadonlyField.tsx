import { AddReadonlyFieldProps } from "@/lib/types/components/form_fields";
import { AddProductFieldLabel } from "./AddFieldLabel";

export function AddProductReadonlyField({ label, value, colorClass = "text-slate-700" }: AddReadonlyFieldProps) {
    return (
        <div>
        <AddProductFieldLabel label={label} />
        <div className={`rounded-xl border border-slate-200 ${colorClass} px-4 py-3 text-lg`}>{value}</div>
        </div>
    );
}