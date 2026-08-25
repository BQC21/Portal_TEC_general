export const PANELES_POR_PALET = 36;

export type ModuloFVUnidadKind = "palet" | "unidad";

export function normalizeModuloFVUnidad(unidad?: string | null): ModuloFVUnidadKind | null {
    const unidadNormalizada = (unidad ?? "").trim().toLowerCase();
    if (unidadNormalizada === "palet") return "palet";
    if (unidadNormalizada === "unidad" || unidadNormalizada === "uni") return "unidad";
    return null;
}

export function sameModuloFVBrand(a?: string | null, b?: string | null): boolean {
    const brandA = (a ?? "").trim().toLowerCase();
    const brandB = (b ?? "").trim().toLowerCase();
    return brandA.length > 0 && brandA === brandB;
}

export function isOppositeModuloFVUnidad(a?: string | null, b?: string | null): boolean {
    const kindA = normalizeModuloFVUnidad(a);
    const kindB = normalizeModuloFVUnidad(b);
    return kindA !== null && kindB !== null && kindA !== kindB;
}

export function hasOppositeModuloFVUnidad(
    modulos: Array<{ unidad?: string | null }>,
    unidad?: string | null,
): boolean {
    const kind = normalizeModuloFVUnidad(unidad);
    if (!kind) return false;
    return modulos.some((item) => {
        const other = normalizeModuloFVUnidad(item.unidad);
        return other !== null && other !== kind;
    });
}

export function canAddModuloFV(
    existing: Array<{ id: string; marca: string; unidad: string }>,
    candidate: { id: string; marca: string; unidad: string },
): boolean {
    if (existing.some((item) => item.id === candidate.id)) return false;
    if (existing.length === 0) return true;
    if (existing.length >= 2) return false;
    const first = existing[0];
    return (
        sameModuloFVBrand(first.marca, candidate.marca) &&
        isOppositeModuloFVUnidad(first.unidad, candidate.unidad)
    );
}

export function cantidadesPaletYUnidad(numeroPaneles: number): { palets: number; unidades: number } {
    const paneles = Math.max(0, Math.trunc(Number(numeroPaneles) || 0));
    return {
        palets: Math.floor(paneles / PANELES_POR_PALET),
        unidades: paneles % PANELES_POR_PALET,
    };
}

export function cantidadModuloFVTabla(
    numeroPaneles: number,
    unidad?: string | null,
    splitWithOppositeUnit = false,
): number {
    const paneles = Number(numeroPaneles) || 0;
    const { palets, unidades } = cantidadesPaletYUnidad(paneles);
    if (normalizeModuloFVUnidad(unidad) === "palet") {
        return palets;
    }
    if (splitWithOppositeUnit) {
        return unidades;
    }
    return Number(paneles.toFixed(0));
}

export function cantidadModuloFVEnTabla(
    numeroPaneles: number,
    unidad: string | null | undefined,
    modulosSeleccionados: Array<{ unidad?: string | null }>,
): number {
    return cantidadModuloFVTabla(
        numeroPaneles,
        unidad,
        hasOppositeModuloFVUnidad(modulosSeleccionados, unidad),
    );
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