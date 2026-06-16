import { AddProductFieldLabel } from "./AddFieldLabel";

type AddEquipoReadonlyFieldProps = {
    label: string;
    value: string;
    colorClass?: string; // Optional color class for conditional styling
};

export function AddEquipoReadonlyField({ label, value, colorClass = "text-slate-700" }: AddEquipoReadonlyFieldProps) {
    return (
        <div>
        <AddProductFieldLabel label={label} />
        <div className={`
            rounded-xl border border-slate-200 ${colorClass} px-4 py-3 text-lg`}>{value}</div>
        </div>
    );
}