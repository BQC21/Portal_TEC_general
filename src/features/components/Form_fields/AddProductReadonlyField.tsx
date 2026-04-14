import { AddProductFieldLabel } from "./AddProductFieldLabel";

type AddProductReadonlyFieldProps = {
    label: string;
    value: string;
};

export function AddProductReadonlyField({ label, value }: AddProductReadonlyFieldProps) {
    return (
        <div>
        <AddProductFieldLabel label={label} />
        <div className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-lg text-slate-700">{value}</div>
        </div>
    );
}