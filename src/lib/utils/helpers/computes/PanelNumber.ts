export const PANELES_POR_PALET = 36;

export function cantidadModuloFVTabla(numeroPaneles: number, unidad?: string | null): number {
    const paneles = Number(numeroPaneles) || 0;
    const unidadNormalizada = (unidad ?? "").trim().toLowerCase();
    if (unidadNormalizada === "palet") {
        return paneles > 0 ? Math.ceil(paneles / PANELES_POR_PALET) : 0;
    }
    return Number(paneles.toFixed(0));
}

export function toPanelInteger(
    value: unknown,
    rounding: "ceil" | "floor" | "round" = "round",
): number {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return 0;
    if (rounding === "ceil") return Math.ceil(n);
    if (rounding === "floor") return Math.floor(n);
    return Math.round(n);
}

export function toPanelIntegerLabel(
    value: unknown,
    rounding: "ceil" | "floor" | "round" = "round",
): string {
    return String(toPanelInteger(value, rounding));
}

export function optionalInputMin(min: number): number | undefined {
    if (!Number.isFinite(min) || min < 0) return undefined;
    return min;
}

export function optionalInputMax(max: number, min = 0): number | undefined {
    if (!Number.isFinite(max) || max <= 0) return undefined;
    if (Number.isFinite(min) && max < min) return undefined;
    return max;
}