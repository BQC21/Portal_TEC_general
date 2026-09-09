export type ModuloFVUnidadKind = "palet" | "unidad";

export function normalizeModuloFVUnidad(unidad?: string | null): ModuloFVUnidadKind | null {
    const unidadNormalizada = String(unidad ?? "").trim().toLowerCase();
    if (unidadNormalizada === "palet") return "palet";
    if (unidadNormalizada === "unidad" || unidadNormalizada === "uni") return "unidad";
    return null;
}

export function panelesPorPaletDeModulo(
    unidad?: string | null,
    paneles_palet?: number | null,
): number {
    if (normalizeModuloFVUnidad(unidad) !== "palet") return 0;
    const n = Number(paneles_palet);
    return Number.isFinite(n) && n > 0 ? Math.trunc(n) : 0;
}

export function canAddModuloFV(
    existing: Array<{ id: string }>,
    candidate: { id: string },
): boolean {
    return !existing.some((item) => item.id === candidate.id);
}

export function cantidadesPaletYUnidad(
    numeroPaneles: number,
    paneles_por_palet: number,
): { palets: number; unidades: number } {
    const paneles = Math.max(0, Math.trunc(Number(numeroPaneles) || 0));
    const porPalet = Math.max(0, Math.trunc(Number(paneles_por_palet) || 0));
    if (porPalet <= 0) {
        return { palets: 0, unidades: paneles };
    }
    return {
        palets: Math.floor(paneles / porPalet),
        unidades: paneles % porPalet,
    };
}

export function cantidadModuloFVTabla(
    numeroPaneles: number,
    paneles_por_palet: number,
    unidad?: string | null,
): number {
    const paneles = Number(numeroPaneles) || 0;
    if (normalizeModuloFVUnidad(unidad) === "palet") {
        return cantidadesPaletYUnidad(paneles, paneles_por_palet).palets;
    }
    return Number(paneles.toFixed(0));
}

export function cantidadModuloFVEnTabla(
    numeroPaneles: number,
    paneles_por_palet: number,
    unidad?: string | null,
): number {
    return cantidadModuloFVTabla(numeroPaneles, paneles_por_palet, unidad);
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
    paneles_palet?: number,
): number {
    const n = Math.max(0, Math.ceil(Number(cantidad) || 0));
    const panelesPorPalet = Number(paneles_palet);
    if (normalizeModuloFVUnidad(unidad) === "palet") {
        return Number.isFinite(panelesPorPalet) && panelesPorPalet > 0
            ? n * Math.trunc(panelesPorPalet)
            : n;
    }
    return n;
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
        paneles_palet?: number | null;
    } | null;
};

export function toEquipoReportRows(equipos: EquipoReportSource[]): EquipoReportDisplayRow[] {
    return equipos.map((item) => {
        const isModulo = isModuloFV(item.equipo_info?.tipo_de_producto);
        return {
            ids: [String(item.id)],
            cod_producto: item.equipo_info?.cod_producto ?? "",
            descripcion: isModulo
                ? stripPaletFromDescripcion(item.equipo_info?.descripcion)
                : (item.equipo_info?.descripcion ?? ""),
            unidad: isModulo ? "Unidad" : (item.equipo_info?.unidad ?? ""),
            cantidad: isModulo
                ? cantidadModuloFVComoUnidades(
                    item.cantidad,
                    item.equipo_info?.unidad,
                    item.equipo_info?.paneles_palet ?? undefined,
                )
                : Math.max(0, Math.ceil(Number(item.cantidad) || 0)),
        };
    });
}
