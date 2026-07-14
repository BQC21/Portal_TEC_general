import { RecursosCostsInput, ViaticosCostsInput } from "@/lib/types/components/Quotes/finantial_computes";

// -----------------
// RECURSOS
// -----------------

// Calcular precios de los subtotales 
export function computeSubtotalRecursos(costs: RecursosCostsInput) {
    let soles = 0; let igv = 0;

    for (const [key, value] of Object.entries(costs) as [
        keyof RecursosCostsInput, number
    ][]){
        if (key.endsWith("Igv")){
            igv += value
        } else {
            soles += value
        }
    }

    return {soles, igv}
}

// Calcular márgenes de riesgos 
export function computeMargenRiesgoRecursos(
    costs: RecursosCostsInput,
    gm_general: number
) {
    return {
        soles:  computeSubtotalRecursos(costs).soles * gm_general, 
        igv: computeSubtotalRecursos(costs).igv * gm_general
    }
}

// Cálculo del subtotal con margen 
export function computeSubtotalConMargenRecursos(costs: RecursosCostsInput, gm_general: number) {
    return {
        soles: computeSubtotalRecursos(costs).soles + computeMargenRiesgoRecursos(costs, gm_general).soles,
        igv: computeSubtotalRecursos(costs).igv + computeMargenRiesgoRecursos(costs, gm_general).igv,
    };
}

// Cálculo del Markup
export function computeMarkUpRecursos(costs: RecursosCostsInput, markup: number,  gm_general: number) {
    
    return {
        soles:  computeSubtotalConMargenRecursos(costs, gm_general).soles * markup, 
        igv: computeSubtotalConMargenRecursos(costs, gm_general).igv * markup, 
    };
}

// Cálculo del precio de cotización final
export function computeVentaRecursos(
    costs: RecursosCostsInput,
    markup: number, gm_general: number,
    tasa_cambio: number,
) {
    const subtotal = computeSubtotalRecursos(costs);
    const markUp = computeMarkUpRecursos(costs, markup, gm_general);
    return {
        ventaSoles: markUp.soles + subtotal.soles,
        ventaSolesIgv: markUp.igv + subtotal.igv,
        ventaDolares: markUp.soles + subtotal.soles / Number(tasa_cambio) || 1,
        ventaDolaresIgv: markUp.igv + subtotal.igv / Number(tasa_cambio) || 1,
    };
}

// -----------------
// VIÁTICOS
// -----------------


export function computeSubtotalViaticos(costs: ViaticosCostsInput) {
    return {
        soles: costs.eatingTotal + costs.travelingTotal + costs.courierTotal,
        igv: costs.eatingTotalIgv + costs.travelingTotalIgv + costs.courierTotalIgv,
    };
}

export function computeMargenRiesgoViaticos(costs: ViaticosCostsInput, gm_viaticos: number) {
    const subtotal = computeSubtotalViaticos(costs);
    return {
        soles: subtotal.soles * gm_viaticos,
        igv: subtotal.igv * gm_viaticos,
    };
}

export function computeVentaViaticos(
    costs: ViaticosCostsInput,
    gm_viaticos: number,
) {
    const subtotal = computeSubtotalViaticos(costs);
    return {
        ventaSoles: subtotal.soles * gm_viaticos + subtotal.soles,
        ventaSolesIgv: subtotal.igv * gm_viaticos + subtotal.igv,
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
    const tasa = Number(tasa_cambio) || 1;

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
    costs: RecursosCostsInput,
    markup: number, gm_general: number,
    tasa_cambio: number,
) {
    const ventaRecursos = computeVentaRecursos(costs, markup, gm_general, tasa_cambio).ventaSoles 
    const subtotalMargeRecursos = computeSubtotalConMargenRecursos(costs, gm_general).soles

    return{
        gm : (ventaRecursos - subtotalMargeRecursos)/ventaRecursos
    }
}