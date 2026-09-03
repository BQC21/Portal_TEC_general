/** Subtotal del reporte a partir de precioFinal y el formato de descuento. */

export function computeReportSubtotal(
    precioFinal: number,
    opcionDscto: string | undefined,
    formatoDscto: string | undefined,
    tasaDscto: string | number | undefined,
): { subtotalSinDscto: number; precioDscto: number; subtotal: number } {
    
    const base = Number.isFinite(precioFinal) ? precioFinal : 0;
    const tasa = Number(tasaDscto);

    // NO DSCTO
    if (opcionDscto !== "CON DSCTO" || !Number.isFinite(tasa) || tasa <= 0) {
        return { 
            subtotalSinDscto: base, 
            precioDscto: 0, 
            subtotal: base 
        };
    }

    // DSCTO (USD)
    if (formatoDscto === "USD") {
        const precioDscto = Math.min(tasa, base);
        return {
            subtotalSinDscto: base,
            precioDscto,
            subtotal: base - precioDscto,
        };
    }

    // DSCTO (%)
    const factor = tasa / 100;
    const precioDscto = base * factor;
    return {
        subtotalSinDscto: base,
        precioDscto,
        subtotal: base * (1 - factor),
    };
}
