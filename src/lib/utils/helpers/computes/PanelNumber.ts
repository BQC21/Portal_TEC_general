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

export function isModuloFV(tipo?: string | null): boolean {
    const normalized = (tipo ?? "").trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalized === "MODULO FV" || normalized === "MODULO";
}

export function stripPaletFromDescripcion(descripcion?: string | null): string {
    return (descripcion ?? "")
        .replace(/\bpalets?\b/gi, "")
        .replace(/\s{2,}/g, " ")
        .replace(/\s+([,;.:])/g, "$1")
        .trim();
}

export function cantidadModuloFVComoUnidades(
    cantidad: unknown,
    unidad?: string | null,
): number {
    const n = Math.max(0, Math.ceil(Number(cantidad) || 0));
    return normalizeModuloFVUnidad(unidad) === "palet" ? n * PANELES_POR_PALET : n;
}

export type EquipoReportDisplayRow = {
    ids: string[];
    cod_producto: string;
    descripcion: string;
    unidad: string;
    cantidad: number;
};

type EquipoReportSource = {
    id: string | number;
    cantidad?: unknown;
    equipo_info?: {
        tipo_de_producto?: string | null;
        descripcion?: string | null;
        unidad?: string | null;
        marca?: string | null;
        cod_producto?: string | null;
    } | null;
};

function moduloFvGroupKey(item: EquipoReportSource): string {
    const marca = (item.equipo_info?.marca ?? "").trim().toLowerCase();
    if (marca) return `marca:${marca}`;
    const descripcion = stripPaletFromDescripcion(item.equipo_info?.descripcion).toLowerCase();
    return descripcion ? `desc:${descripcion}` : `id:${item.id}`;
}

export function toEquipoReportRows(equipos: EquipoReportSource[]): EquipoReportDisplayRow[] {
    const emittedGroups = new Set<string>();
    const rows: EquipoReportDisplayRow[] = [];

    for (const item of equipos) {
        if (!isModuloFV(item.equipo_info?.tipo_de_producto)) {
            rows.push({
                ids: [String(item.id)],
                cod_producto: item.equipo_info?.cod_producto ?? "",
                descripcion: item.equipo_info?.descripcion ?? "",
                unidad: item.equipo_info?.unidad ?? "",
                cantidad: Math.max(0, Math.ceil(Number(item.cantidad) || 0)),
            });
            continue;
        }

        const key = moduloFvGroupKey(item);
        if (emittedGroups.has(key)) continue;
        emittedGroups.add(key);

        const group = equipos.filter(
            (candidate) =>
                isModuloFV(candidate.equipo_info?.tipo_de_producto) &&
                moduloFvGroupKey(candidate) === key,
        );
        const preferred = group.find(
            (candidate) => normalizeModuloFVUnidad(candidate.equipo_info?.unidad) !== "palet",
        ) ?? group[0];

        rows.push({
            ids: group.map((candidate) => String(candidate.id)),
            cod_producto: preferred.equipo_info?.cod_producto ?? "",
            descripcion: stripPaletFromDescripcion(preferred.equipo_info?.descripcion),
            unidad: "Unidad",
            cantidad: group.reduce(
                (sum, candidate) =>
                    sum + cantidadModuloFVComoUnidades(
                        candidate.cantidad,
                        candidate.equipo_info?.unidad,
                    ),
                0,
            ),
        });
    }

    return rows;
}