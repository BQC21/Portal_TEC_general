import { EquipoReportDisplayRow, EquipoReportSource, ModuloFVSelection, ModuloFVUnidadKind } from "@/lib/types/components/Sizing/computes";
import { DEFAULT_PANELES_POR_PALET } from "@/lib/utils/consts/panelNumber";

export function normalizeModuloFVUnidad(unidad?: string | null): ModuloFVUnidadKind | null {
    const unidadNormalizada = String(unidad ?? "").trim().toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    if (
        unidadNormalizada === "palet"
        || unidadNormalizada === "palets"
        || unidadNormalizada === "pallet"
        || unidadNormalizada === "pallets"
    ) {
        return "palet";
    }
    if (
        unidadNormalizada === "container"
        || unidadNormalizada === "containers"
        || unidadNormalizada === "contenedor"
        || unidadNormalizada === "contenedores"
    ) {
        return "container";
    }
    if (unidadNormalizada === "unidad" || unidadNormalizada === "uni") return "unidad";
    return null;
}

export function isContainerModuloFV(unidad?: string | null, descripcion?: string | null): boolean {
    if (normalizeModuloFVUnidad(unidad) === "container") return true;
    return /\bcontainers?\b/i.test(descripcion ?? "")
        || /\bcontenedores?\b/i.test(descripcion ?? "");
}

export function isConjuntoModuloFV(unidad?: string | null, descripcion?: string | null): boolean {
    return isPaletModuloFV(unidad, descripcion) || isContainerModuloFV(unidad, descripcion);
}

export function panelesPorPaletDeModulo(
    unidad?: string | null,
    paneles_palet?: number | null,
): number {
    const kind = normalizeModuloFVUnidad(unidad);
    if (kind !== "palet" && kind !== "container") return 0;
    const n = Number(paneles_palet);
    return Number.isFinite(n) && n > 0 ? Math.trunc(n) : 0;
}

export function isPaletModuloFV(unidad?: string | null, descripcion?: string | null): boolean {
    if (normalizeModuloFVUnidad(unidad) === "palet") return true;
    return /\bpal+ets?\b/i.test(descripcion ?? "");
}

export function hasSelectedPaletModuloFV(modulos: ModuloFVSelection[]): boolean {
    return modulos.some((item) => isConjuntoModuloFV(item.unidad));
}

export function panelesPorPaletDesdeSeleccion(modulos: ModuloFVSelection[]): number {
    const conjunto = modulos.find((item) => isConjuntoModuloFV(item.unidad));
    return panelesPorPaletDeModulo(conjunto?.unidad, conjunto?.paneles_palet);
}

export function etiquetaConjuntoModuloFV(
    modulos: Array<{ unidad?: string | null }>,
): "containers" | "palets" {
    if (modulos.some((item) => isContainerModuloFV(item.unidad))) return "containers";
    return "palets";
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
    const kind = normalizeModuloFVUnidad(unidad);
    if (kind === "palet" || kind === "container") {
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
    const esConjunto = isConjuntoModuloFV(unidad);
    const porConjunto = esConjunto
        ? panelesPorPaletDeModulo(unidad, paneles_por_palet)
        : panelesPorPaletDesdeSeleccion(modulosSeleccionados);
    return cantidadModuloFVTabla(
        numeroPaneles,
        porConjunto,
        unidad,
        !esConjunto && hasSelectedPaletModuloFV(modulosSeleccionados),
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

export function resolvePanelesPorPalet(
    items: Array<{
        unidad?: string | null;
        paneles_palet?: number | null;
        descripcion?: string | null;
    }>,
): number {
    const conjuntoItem = items.find((item) => isConjuntoModuloFV(item.unidad, item.descripcion));
    const fromConjunto = Number(conjuntoItem?.paneles_palet);
    if (Number.isFinite(fromConjunto) && fromConjunto > 0) return Math.trunc(fromConjunto);
    if (
        conjuntoItem
        && isContainerModuloFV(conjuntoItem.unidad, conjuntoItem.descripcion)
        && !isPaletModuloFV(conjuntoItem.unidad, conjuntoItem.descripcion)
    ) {
        return 1;
    }

    const fromAny = items
        .map((item) => Number(item.paneles_palet))
        .find((value) => Number.isFinite(value) && value > 0);
    if (fromAny) return Math.trunc(fromAny);

    return DEFAULT_PANELES_POR_PALET;
}

export function cantidadModuloFVComoUnidades(
    cantidad: unknown,
    unidad?: string | null,
    paneles_palet?: number,
    descripcion?: string | null,
): number {
    const n = Math.max(0, Math.ceil(Number(cantidad) || 0));
    if (!isConjuntoModuloFV(unidad, descripcion)) return n;
    const stored = Number(paneles_palet);
    if (Number.isFinite(stored) && stored > 0) return n * Math.trunc(stored);
    if (isContainerModuloFV(unidad, descripcion) && !isPaletModuloFV(unidad, descripcion)) return n;
    return n * DEFAULT_PANELES_POR_PALET;
}

export function cantidadBateriaComoUnidades(
    cantidad: unknown,
): number {
    const n = Math.max(0, Math.ceil(Number(cantidad) || 0));
    return n;
}

export function toEquipoReportRows(equipos: EquipoReportSource[]): EquipoReportDisplayRow[] {
    const moduloItems = equipos.filter((item) => isModuloFV(item.equipo_info?.tipo_de_producto));
    let emittedModulos = false;
    const rows: EquipoReportDisplayRow[] = [];

    for (const item of equipos) {
        if (isModuloFV(item.equipo_info?.tipo_de_producto)) {
            if (emittedModulos) continue;
            emittedModulos = true;

            const preferred =
                moduloItems.find((candidate) =>
                    !isConjuntoModuloFV(
                        candidate.equipo_info?.unidad,
                        candidate.equipo_info?.descripcion,
                    ),
                ) ?? moduloItems[0];
            const panelesPorPalet = resolvePanelesPorPalet(
                moduloItems.map((candidate) => ({
                    unidad: candidate.equipo_info?.unidad,
                    paneles_palet: candidate.equipo_info?.paneles_palet,
                    descripcion: candidate.equipo_info?.descripcion,
                })),
            );

            rows.push({
                ids: moduloItems.map((candidate) => String(candidate.id)),
                cod_producto: preferred?.equipo_info?.cod_producto ?? "",
                descripcion: "Módulo fotovoltaico",
                unidad: "Unidad",
                cantidad: moduloItems.reduce(
                    (sum, candidate) =>
                        sum + cantidadModuloFVComoUnidades(
                            candidate.cantidad,
                            candidate.equipo_info?.unidad,
                            panelesPorPalet,
                            candidate.equipo_info?.descripcion,
                        ),
                    0,
                ),
            });
            continue;
        }

        rows.push({
            ids: [String(item.id)],
            cod_producto: item.equipo_info?.cod_producto ?? "",
            descripcion: item.equipo_info?.descripcion ?? "",
            unidad: item.equipo_info?.unidad ?? "",
            cantidad: Math.max(0, Math.ceil(Number(item.cantidad) || 0)),
        });
    }

    return rows;
}
