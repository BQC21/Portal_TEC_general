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

type ModuloFVSelection = {
    id?: string;
    unidad?: string | null;
    paneles_palet?: number | null;
    cantidad?: number;
};

export function isPaletModuloFV(unidad?: string | null): boolean {
    return normalizeModuloFVUnidad(unidad) === "palet";
}

export function hasSelectedPaletModuloFV(modulos: ModuloFVSelection[]): boolean {
    return modulos.some((item) => isPaletModuloFV(item.unidad));
}

export function panelesPorPaletDesdeSeleccion(modulos: ModuloFVSelection[]): number {
    const palet = modulos.find((item) => isPaletModuloFV(item.unidad));
    return panelesPorPaletDeModulo(palet?.unidad, palet?.paneles_palet);
}

export function canAddModuloFV(
    existing: ModuloFVSelection[],
    candidate: { id: string; unidad?: string | null },
): boolean {
    if (existing.some((item) => String(item.id) === candidate.id)) return false;
    if (hasSelectedPaletModuloFV(existing)) {
        return normalizeModuloFVUnidad(candidate.unidad) === "unidad";
    }
    return true;
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
    usarRestoUnidades = false,
): number {
    const paneles = Number(numeroPaneles) || 0;
    const { palets, unidades } = cantidadesPaletYUnidad(paneles, paneles_por_palet);
    if (normalizeModuloFVUnidad(unidad) === "palet") {
        return palets;
    }
    if (usarRestoUnidades) {
        return unidades;
    }
    return Number(paneles.toFixed(0));
}

export function cantidadModuloFVEnTabla(
    numeroPaneles: number,
    paneles_por_palet: number,
    unidad?: string | null,
    modulosSeleccionados: ModuloFVSelection[] = [],
): number {
    const esPalet = isPaletModuloFV(unidad);
    const porPalet = esPalet
        ? panelesPorPaletDeModulo(unidad, paneles_por_palet)
        : panelesPorPaletDesdeSeleccion(modulosSeleccionados);
    return cantidadModuloFVTabla(
        numeroPaneles,
        porPalet,
        unidad,
        !esPalet && hasSelectedPaletModuloFV(modulosSeleccionados),
    );
}

export function unidadesPendientesModuloFV(
    numeroPaneles: number,
    modulosSeleccionados: ModuloFVSelection[],
): number {
    if (!hasSelectedPaletModuloFV(modulosSeleccionados)) return 0;
    const { unidades } = cantidadesPaletYUnidad(
        numeroPaneles,
        panelesPorPaletDesdeSeleccion(modulosSeleccionados),
    );
    if (unidades <= 0) return 0;
    const tieneUnidad = modulosSeleccionados.some(
        (item) => normalizeModuloFVUnidad(item.unidad) === "unidad",
    );
    return tieneUnidad ? 0 : unidades;
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

export function cantidadBateriaComoUnidades(
    cantidad: unknown,
): number {
    const n = Math.max(0, Math.ceil(Number(cantidad) || 0));
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
