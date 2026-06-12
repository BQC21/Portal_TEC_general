import { AddProductFieldLabel } from "./AddFieldLabel";

type AddEquipoReadonlyFieldProps = {
    label: string;
    value: string;
};

export function AddEquipoReadonlyField({ label, value }: AddEquipoReadonlyFieldProps) {
    return (
        <div>
        <AddProductFieldLabel label={label} />
        <div className="rounded-xl border border-slate-200 bg-slate-300 px-4 py-3 text-lg text-slate-700">{value}</div>
        </div>
    );
}