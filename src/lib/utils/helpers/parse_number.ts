// ---- Formateo de números
export const parseNumber = (v: unknown): number | undefined => {
    if (v === null || v === undefined) return undefined;
    if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
    const s = String(v).trim();
    if (s === "") return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
};