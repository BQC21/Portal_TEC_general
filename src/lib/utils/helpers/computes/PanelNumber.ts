export const PANELES_POR_PALET = 36;

export function cantidadModuloFVTabla(numeroPaneles: number, unidad?: string | null): number {
    const paneles = Number(numeroPaneles) || 0;
    const unidadNormalizada = (unidad ?? "").trim().toLowerCase();
    if (unidadNormalizada === "palet") {
        return paneles > 0 ? Math.ceil(paneles / PANELES_POR_PALET) : 0;
    }
    return Number(paneles.toFixed(0));
}