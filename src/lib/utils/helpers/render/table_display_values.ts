import { formatPaybackLabel } from "../computes/finantial_computes";

// Mostrar la labelización del tiempo de retorno
export function displayPayback(value?: string): string {
    if (!value) return "—";
    if (value.includes("año") || value.includes("mes")) return value;
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return formatPaybackLabel(numeric);
    return value;
}