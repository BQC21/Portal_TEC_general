import { ManualCosts } from "@/lib/types/components/Quotes/manual_resources";
import {
    grossMargin as GrossMarginShape,
    precioFinal,
    recursos,
    viaticos,
} from "@/lib/types/components/Quotes/finantial_computes";
import { Materiales } from "@/lib/types/supabase/materiales-types";
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join";
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join";
import { isReusableEpp } from "@/features/view/sub_components/M3/Tables/quotes/templates/Prices";
import { buildSortedConsumibles } from "@/lib/utils/helpers/sorting/consumiblesSort";
import {
    computeGrossMargin,
    computeMargenRiesgoRecursos,
    computeMargenRiesgoViaticos,
    computeMarkUpRecursos,
    computePrecioFinal,
    computeSubtotalConMargenRecursos,
    computeSubtotalRecursos,
    computeSubtotalViaticos,
    computeVentaRecursos,
    computeVentaViaticos,
} from "@/lib/utils/helpers/computes/quote_computes";
import { EMPTY_GROSS_MARGIN, EMPTY_PRECIO_FINAL, EMPTY_RECURSOS, EMPTY_VIATICOS } from "../../empty";
import { addPair, addSoles, addVenta } from "../../normalization";

export type QuoteCostTotals = {
    recursos: recursos;
    viaticos: viaticos;
    precioFinal: precioFinal;
    grossMargin: { gm: GrossMarginShape };
};

export function computeQuoteCostTotals(params: {
    projectEquipos: Project_Equipos[];
    projectMateriales: Project_Materiales[];
    manualCosts: ManualCosts;
    gm_general: number;
    markup: number;
    gm_viaticos: number;
    tasa_cambio: number;
    depre_tool: number;
    materialesCatalog: Materiales[];
}): QuoteCostTotals {
    const {
        projectEquipos,
        projectMateriales,
        manualCosts,
        gm_general,
        markup,
        gm_viaticos,
        tasa_cambio,
        depre_tool,
        materialesCatalog,
    } = params;

    // -----------
    // Recursos total
    // -----------

    const equiposPrincipalesTotal = projectEquipos
        .filter((item) => item.equipo_info?.tipo_de_producto !== "ESTRUCTURA")
        .reduce(
            (sum, item) =>
                sum + Number(item.equipo_info?.precio_soles) * Number(item.cantidad),
            0,
        );
    const equiposPrincipalesTotalIgv = projectEquipos
        .filter((item) => item.equipo_info?.tipo_de_producto !== "ESTRUCTURA")
        .reduce(
            (sum, item) =>
                sum + Number(item.equipo_info?.precio_soles_igv) * Number(item.cantidad),
            0,
        );

    const estructurasTotal = projectEquipos
        .filter((item) => item.equipo_info?.tipo_de_producto === "ESTRUCTURA")
        .reduce(
            (sum, item) =>
                sum + Number(item.equipo_info?.precio_soles) * Number(item.cantidad),
            0,
        );
    const estructurasTotalIgv = projectEquipos
        .filter((item) => item.equipo_info?.tipo_de_producto === "ESTRUCTURA")
        .reduce(
            (sum, item) =>
                sum + Number(item.equipo_info?.precio_soles_igv) * Number(item.cantidad),
            0,
        );

    const consumibleRows = buildSortedConsumibles(
        projectMateriales,
        manualCosts.Recursos.consumible,
        materialesCatalog,
    );
    const consumiblesTotal = consumibleRows.reduce(
        (sum, item) => sum + Number(item.precio_soles) * Number(item.cantidad),
        0,
    );
    const consumiblesTotalIgv = consumibleRows.reduce(
        (sum, item) => sum + Number(item.precio_soles_igv) * Number(item.cantidad),
        0,
    );

    const considerarEppReutilizable = manualCosts.Recursos.considerar_epp_reutilizable !== false;
    const eppReusableTotal = considerarEppReutilizable
        ? manualCosts.Recursos.epp
            .filter((item) => isReusableEpp(item.descripcion))
            .reduce((sum, item) => sum + Number(item.cantidad) * Number(item.precio_unitario), 0)
        : 0;
    const eppTotal = manualCosts.Recursos.epp
        .filter((item) => !isReusableEpp(item.descripcion))
        .reduce((sum, item) => sum + Number(item.cantidad) * Number(item.precio_unitario), 0);
    const eppTotalIgv = Number(eppTotal) * Number(1.18);

    const depre = Number(depre_tool) || 1;
    const toolingTotal =
        (manualCosts.Recursos.tooling.reduce(
            (sum, item) => sum + Number(item.cantidad) * Number(item.precio_unitario),
            eppReusableTotal,
        )) / depre;
    const toolingTotalIgv = Number(toolingTotal) * Number(1.18);

    const personalTotal = manualCosts.Recursos.personal.reduce(
        (sum, item) => sum + Number(item.dias) * Number(item.precio_dia),
        0,
    );
    const personalTotalIgv = Number(personalTotal) * Number(1.18);

    const sctrTotal = manualCosts.Recursos.sctr.reduce(
        (sum, item) => sum + Number(item.cantidad) * Number(item.precio_unitario),
        0,
    );
    const sctrTotalIgv = Number(sctrTotal) * Number(1.18);

    // -----------
    // Viaticos total
    // -----------

    const gastosViajeItems = Array.isArray(manualCosts.Viaticos.gastos_viaje)
        ? manualCosts.Viaticos.gastos_viaje
        : [];
    const gastos_viajeTotal = gastosViajeItems.reduce(
        (sum, item) =>
            sum + Number(item.monto) * Number(item.personas) * Number(item.dias),
        0,
    );
    const courierTotal = manualCosts.Viaticos.courier.reduce(
        (sum, item) => sum + Number(item.cantidad) * Number(item.precio_unitario),
        0,
    );

    // --- ASOCICIÓN

    const recursosCosts = {
        equiposPrincipales: { total: equiposPrincipalesTotal, igv: equiposPrincipalesTotalIgv },
        estructuras: { total: estructurasTotal, igv: estructurasTotalIgv },
        consumibles: { total: consumiblesTotal, igv: consumiblesTotalIgv },
        epp: { total: eppTotal, igv: eppTotalIgv },
        tooling: { total: toolingTotal, igv: toolingTotalIgv },
        personal: { total: personalTotal, igv: personalTotalIgv },
        sctr: { total: sctrTotal, igv: sctrTotalIgv },
    };

    const viaticosCosts = {
        gastos_viaje: { total: gastos_viajeTotal },
        courier: { total: courierTotal },
    };

    // Cálculo de subtotales

    const subtotal_recursos = computeSubtotalRecursos(recursosCosts);
    const margenRiesgo_recursos = computeMargenRiesgoRecursos(recursosCosts, gm_general);
    const subtotalConMargenRiesgo_recursos = computeSubtotalConMargenRecursos(recursosCosts, gm_general);
    const markUp_recursos = computeMarkUpRecursos(recursosCosts, markup, gm_general);
    const ventaRecursos = computeVentaRecursos(recursosCosts, markup, gm_general, tasa_cambio);

    const subtotal_viaticos = computeSubtotalViaticos(viaticosCosts);
    const margenRiesgo_viaticos = computeMargenRiesgoViaticos(viaticosCosts, gm_viaticos);
    const ventaViaticos = computeVentaViaticos(viaticosCosts, gm_viaticos, tasa_cambio);

    const {
        precioFinal,
        precioFinalIgv,
        precioFinalDolares,
        precioFinalDolaresIgv,
    } = computePrecioFinal(ventaRecursos, ventaViaticos, tasa_cambio);

    // Cálculo del Gross Margin

    const GrossMargin = computeGrossMargin(recursosCosts, markup, gm_general, tasa_cambio);

    return {
        recursos: {
            ...recursosCosts,
            resumen: {
                subtotal: subtotal_recursos,
                margenRiesgo: margenRiesgo_recursos,
                subtotalConMargenRiesgo: subtotalConMargenRiesgo_recursos,
                markUp: markUp_recursos,
                ventaSoles: {
                    ventaSoles: ventaRecursos.ventaSoles,
                    ventaSolesIgv: ventaRecursos.ventaSolesIgv,
                    ventaDolares: ventaRecursos.ventaDolares,
                    ventaDolaresIgv: ventaRecursos.ventaDolaresIgv,
                },
            },
        },
        viaticos: {
            ...viaticosCosts,
            resumen: {
                subtotal: subtotal_viaticos,
                margenRiesgo: margenRiesgo_viaticos,
                ventaSoles: {
                    ventaSoles: ventaViaticos.ventaSoles,
                    ventaSolesIgv: ventaViaticos.ventaSolesIgv,
                    ventaDolares: ventaViaticos.ventaDolares,
                    ventaDolaresIgv: ventaViaticos.ventaDolaresIgv,
                },
            },
        },
        precioFinal: {
            soles: precioFinal,
            solesIgv: precioFinalIgv,
            dolares: precioFinalDolares,
            dolaresIgv: precioFinalDolaresIgv,
        },
        grossMargin: {
            gm: GrossMargin,
        },
    };
}

export function sumQuoteCostTotals(parts: QuoteCostTotals[]): QuoteCostTotals {
    if (parts.length === 0) {
        return {
            recursos: EMPTY_RECURSOS,
            viaticos: EMPTY_VIATICOS,
            precioFinal: EMPTY_PRECIO_FINAL,
            grossMargin: EMPTY_GROSS_MARGIN,
        };
    }

    // Total de costos de RECURSOS
    const recursosSum = parts.reduce<recursos>((acc, part) => ({
        equiposPrincipales: addPair(acc.equiposPrincipales, part.recursos.equiposPrincipales),
        estructuras: addPair(acc.estructuras, part.recursos.estructuras),
        consumibles: addPair(acc.consumibles, part.recursos.consumibles),
        epp: addPair(acc.epp, part.recursos.epp),
        tooling: addPair(acc.tooling, part.recursos.tooling),
        personal: addPair(acc.personal, part.recursos.personal),
        sctr: addPair(acc.sctr, part.recursos.sctr),
        resumen: {
            subtotal: addSoles(acc.resumen.subtotal, part.recursos.resumen.subtotal),
            margenRiesgo: addSoles(acc.resumen.margenRiesgo, part.recursos.resumen.margenRiesgo),
            subtotalConMargenRiesgo: addSoles(
                acc.resumen.subtotalConMargenRiesgo,
                part.recursos.resumen.subtotalConMargenRiesgo,
            ),
            markUp: addSoles(acc.resumen.markUp, part.recursos.resumen.markUp),
            ventaSoles: addVenta(acc.resumen.ventaSoles, part.recursos.resumen.ventaSoles),
        },
    }), EMPTY_RECURSOS);

    // Total de costos de VIÁTICOS
    const viaticosSum = parts.reduce<viaticos>((acc, part) => ({
        gastos_viaje: { total: acc.gastos_viaje.total + part.viaticos.gastos_viaje.total },
        courier: { total: acc.courier.total + part.viaticos.courier.total },
        resumen: {
            subtotal: addSoles(acc.resumen.subtotal, part.viaticos.resumen.subtotal),
            margenRiesgo: addSoles(acc.resumen.margenRiesgo, part.viaticos.resumen.margenRiesgo),
            ventaSoles: addVenta(acc.resumen.ventaSoles, part.viaticos.resumen.ventaSoles),
        },
    }), EMPTY_VIATICOS);

    // Total de costos TOTALES
    const precioFinalSum = parts.reduce<precioFinal>((acc, part) => ({
        soles: acc.soles + part.precioFinal.soles,
        solesIgv: acc.solesIgv + part.precioFinal.solesIgv,
        dolares: acc.dolares + part.precioFinal.dolares,
        dolaresIgv: acc.dolaresIgv + part.precioFinal.dolaresIgv,
    }), EMPTY_PRECIO_FINAL);

    // Gross Margin total
    const gmWeight = parts.reduce((sum, part) => {
        const gm = Number(part.grossMargin.gm.gm);
        const weight = Number(part.precioFinal.dolares);
        if (!Number.isFinite(gm) || !Number.isFinite(weight) || weight <= 0) return sum;
        return { num: sum.num + gm * weight, den: sum.den + weight };
    }, { num: 0, den: 0 });

    return {
        recursos: recursosSum,
        viaticos: viaticosSum,
        precioFinal: precioFinalSum,
        grossMargin: {
            gm: { gm: gmWeight.den > 0 ? gmWeight.num / gmWeight.den : 0 },
        },
    };
}
