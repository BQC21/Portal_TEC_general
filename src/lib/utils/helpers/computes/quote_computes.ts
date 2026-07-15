import { recursosItems, viaticosItems } from "@/lib/types/components/Quotes/finantial_computes";

// -----------------
// RECURSOS
// -----------------

// Calcular precios de los subtotales 
export function computeSubtotalRecursos(costs: recursosItems) {
    let soles = 0;
    let igv = 0;

    for (const [key, value] of Object.entries(costs)) {
        if (key === "resumen") continue;
        soles += value.total;
        igv += value.igv;
    }

    return { soles, igv };
}

// Calcular márgenes de riesgos 
export function computeMargenRiesgoRecursos(
    costs: recursosItems,
    gm_general: number
) {
    return {
        soles:  computeSubtotalRecursos(costs).soles * gm_general/100, 
        igv: computeSubtotalRecursos(costs).igv * gm_general/100,
    }
}

// Cálculo del subtotal con margen 
export function computeSubtotalConMargenRecursos(costs: recursosItems, gm_general: number) {
    return {
        soles: computeSubtotalRecursos(costs).soles + computeMargenRiesgoRecursos(costs, gm_general).soles,
        igv: computeSubtotalRecursos(costs).igv + computeMargenRiesgoRecursos(costs, gm_general).igv,
    };
}

// Cálculo del Markup
export function computeMarkUpRecursos(costs: recursosItems, markup: number,  gm_general: number) {
    
    return {
        soles:  computeSubtotalConMargenRecursos(costs, gm_general).soles * markup/100, 
        igv: computeSubtotalConMargenRecursos(costs, gm_general).igv * markup/100,
    };
}

// Cálculo del precio de cotización final
export function computeVentaRecursos(
    costs: recursosItems,
    markup: number, gm_general: number,
    tasa_cambio: number,
) {
    const subtotal = computeSubtotalConMargenRecursos(costs, gm_general);
    const markUp = computeMarkUpRecursos(costs, markup, gm_general);
    const tasa = Number(tasa_cambio) || 1;
    const ventaSoles = markUp.soles + subtotal.soles;
    const ventaSolesIgv = markUp.igv + subtotal.igv;

    return {
        ventaSoles,
        ventaSolesIgv,
        ventaDolares: ventaSoles / tasa,
        ventaDolaresIgv: ventaSolesIgv / tasa,
    };
}

// -----------------
// VIÁTICOS
// -----------------


export function computeSubtotalViaticos(costs: viaticosItems) {
    return {
        soles: costs.eating.total + costs.traveling.total + costs.courier.total,
        igv: costs.eating.igv + costs.traveling.igv + costs.courier.igv,
    };
}

export function computeMargenRiesgoViaticos(costs: viaticosItems, gm_viaticos: number) {
    const subtotal = computeSubtotalViaticos(costs);
    return {
        soles: subtotal.soles * gm_viaticos/100,
        igv: subtotal.igv * gm_viaticos/100,
    };
}

export function computeVentaViaticos(
    costs: viaticosItems,
    gm_viaticos: number,
    tasa_cambio: number,
) {
    const subtotal = computeSubtotalViaticos(costs);
    const margenRiesgo_viaticos = computeMargenRiesgoViaticos(costs, gm_viaticos);
    const tasa = Number(tasa_cambio) || 1;
    const ventaSoles = subtotal.soles + margenRiesgo_viaticos.soles;
    const ventaSolesIgv = subtotal.igv + margenRiesgo_viaticos.igv;

    return {
        ventaSoles,
        ventaSolesIgv,
        ventaDolares: ventaSoles / tasa,
        ventaDolaresIgv: ventaSolesIgv / tasa,
    };
}

// -----------------
// TOTAL
// -----------------

export function computePrecioFinal(
    ventaRecursos: { ventaSoles: number; ventaSolesIgv: number },
    ventaViaticos: { ventaSoles: number; ventaSolesIgv: number },
    tasa_cambio: number,
) {
    const precioFinal = ventaRecursos.ventaSoles + ventaViaticos.ventaSoles;
    const precioFinalIgv = ventaRecursos.ventaSolesIgv + ventaViaticos.ventaSolesIgv;
    const tasa = Number(tasa_cambio) || 0;

    return {
        precioFinal,
        precioFinalIgv,
        precioFinalDolares: precioFinal / tasa,
        precioFinalDolaresIgv: precioFinalIgv / tasa,
    };
}

// -----------------
// Gross Margin
// -----------------

export function computeGrossMargin(
    costs: recursosItems,
    markup: number, gm_general: number,
    tasa_cambio: number,
) {
    const ventaRecursos = computeVentaRecursos(costs, markup, gm_general, tasa_cambio).ventaSoles 
    const subtotalMargeRecursos = computeSubtotalConMargenRecursos(costs, gm_general).soles

    return{
        gm : (ventaRecursos - subtotalMargeRecursos)/ventaRecursos
    }
}