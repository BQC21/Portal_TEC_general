import { computeGrossMargin, computeMargenRiesgoRecursos, computeMargenRiesgoViaticos, computeMarkUpRecursos, computePrecioFinal, computeSubtotalConMargenRecursos, computeSubtotalRecursos, computeSubtotalViaticos, computeVentaRecursos, computeVentaViaticos } from "@/lib/utils/helpers/computes/quote_computes";
import { RecursosCostsInput, ViaticosCostsInput } from "@/lib/types/components/Quotes/finantial_computes";
import { ManualResourceCosts } from "@/lib/types/components/Quotes/manual_resources";
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join";
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join";
import { useMemo } from "react";

export function useCostComputes(
    projectEquipos: Project_Equipos[],
    projectMateriales: Project_Materiales[],
    manualResourceCosts: ManualResourceCosts,
    gm_general: number,
    markup: number,
    gm_viaticos: number,
    tasa_cambio: number,
) {

    // -----------------
    // ALMACENAR CÁLCULOS EN LAS TABLAS SECUNDARIAS
    // -----------------

    // EQUIPOS PRINCIPALES
    const equiposPrincipalesTotal = useMemo(() =>
        projectEquipos
            .filter((item) => item.equipo_info?.tipo_de_producto !== "ESTRUCTURA")
            .reduce(
            (sum, item) =>
                sum + Number(item.equipo_info?.precio_soles) * Number(item.cantidad),
            0,
            ),
        [projectEquipos],
    );
    const equiposPrincipalesTotalIgv = useMemo(() =>
        projectEquipos
            .filter((item) => item.equipo_info?.tipo_de_producto !== "ESTRUCTURA")
            .reduce(
            (sum, item) =>
                sum + Number(item.equipo_info?.precio_soles_igv) * Number(item.cantidad),
            0,
            ),
        [projectEquipos],
    );
    
    // ESTRUCTURAS
    const estructurasTotal = useMemo(() =>
        projectEquipos
            .filter((item) => item.equipo_info?.tipo_de_producto === "ESTRUCTURA")
            .reduce(
            (sum, item) =>
                sum + Number(item.equipo_info?.precio_soles) * Number(item.cantidad),
            0,
            ),
        [projectEquipos],
    );
    const estructurasTotalIgv = useMemo(() =>
        projectEquipos
            .filter((item) => item.equipo_info?.tipo_de_producto === "ESTRUCTURA")
            .reduce(
            (sum, item) =>
                sum + Number(item.equipo_info?.precio_soles_igv) * Number(item.cantidad),
            0,
            ),
        [projectEquipos],
    );

    // CONSUMIBLES
    const consumiblesTotal = useMemo(() =>
        projectMateriales
            .reduce(
            (sum, item) =>
                sum + Number(item.material_info?.precio_soles) * Number(item.cantidad),
            0,
            ),
        [projectMateriales],
    );
    const consumiblesTotalIgv = useMemo(() =>
        projectMateriales
            .reduce(
            (sum, item) =>
                sum + Number(item.material_info?.precio_soles_igv) * Number(item.cantidad),
            0,
            ),
        [projectMateriales],
    );
    
    // EPPs
    const eppTotal = useMemo(() =>
        Number(manualResourceCosts.epp.cantidad) * Number(manualResourceCosts.epp.precio_unitario),
        [manualResourceCosts],
    );
    const eppTotalIgv = useMemo(() =>
        Number(eppTotal) * Number(1.18),
        [eppTotal],
    );

    // HERRAMIENTAS
    const toolingTotal = useMemo(() =>
        Number(manualResourceCosts.tooling.cantidad) * Number(manualResourceCosts.tooling.precio_unitario),
        [manualResourceCosts],
    );
    const toolingTotalIgv = useMemo(() =>
        Number(toolingTotal) * Number(1.18),
        [toolingTotal],
    );

    // HOTEL
    const hotelTotal = useMemo(() =>
        Number(manualResourceCosts.hotel.monto) * Number(manualResourceCosts.hotel.personas) * 
            Number(manualResourceCosts.hotel.dias),
        [manualResourceCosts],
    );
    const hotelTotalIgv = useMemo(() =>
        Number(hotelTotal) * Number(1.18),
        [hotelTotal],
    );

    // PERSONAL
    const personalTotal = useMemo(() =>
        Number(manualResourceCosts.personal.dias) * Number(manualResourceCosts.personal.precio_dia),
        [manualResourceCosts],
    );
    const personalTotalIgv = useMemo(() =>
        Number(personalTotal) * Number(1.18),
        [personalTotal],
    );

    // SCTR
    const sctrTotal = useMemo(() =>
        Number(manualResourceCosts.sctr.cantidad) * Number(manualResourceCosts.sctr.precio_unitario),
        [manualResourceCosts],
    );
    const sctrTotalIgv = useMemo(() =>
        Number(sctrTotal) * Number(1.18),
        [sctrTotal],
    );


    // ALIMENTACIÓN
    const eatingTotal = useMemo(() =>
        Number(manualResourceCosts.eating?.monto ?? 0) * 
        Number(manualResourceCosts.eating?.personas ?? 0) * 
        Number(manualResourceCosts.eating?.dias ?? 0),
        [manualResourceCosts],
    );
    const eatingTotalIgv = useMemo(() =>
        Number(eatingTotal) * Number(1.18),
        [eatingTotal],
    );

    // VIAJE Y MOVILIDAD
    const travelingTotal = useMemo(() =>
        Number(manualResourceCosts.traveling?.monto ?? 0) * 
        Number(manualResourceCosts.traveling?.personas ?? 0) * 
        Number(manualResourceCosts.traveling?.dias ?? 0),
        [manualResourceCosts],
    );
    const travelingTotalIgv = useMemo(() =>
        Number(travelingTotal) * Number(1.18),
        [travelingTotal],
    );

    // COURIER
    const courierTotal = useMemo(() =>
        Number(manualResourceCosts.courier.cantidad) * Number(manualResourceCosts.courier.precio_unitario),
        [manualResourceCosts],
    );
    const courierTotalIgv = useMemo(() =>
        Number(courierTotal) * Number(1.18),
        [courierTotal],
    );

    // -----------------
    // AGREGACIÓN DE COSTOS
    // -----------------

    // RECURSOS
    const recursosCosts: RecursosCostsInput = useMemo(() => ({
        equiposPrincipalesCost: equiposPrincipalesTotal,
        equiposPrincipalesCostIgv: equiposPrincipalesTotalIgv,
        estructurasCost: estructurasTotal,
        estructurasCostIgv: estructurasTotalIgv,
        consumiblesCost: consumiblesTotal,
        consumiblesCostIgv: consumiblesTotalIgv,
        eppCost: eppTotal,
        eppCostIgv: eppTotalIgv,
        toolingCost: toolingTotal,
        toolingCostIgv: toolingTotalIgv,
        hotelCost: hotelTotal,
        hotelCostIgv: hotelTotalIgv,
        personalCost: personalTotal,
        personalCostIgv: personalTotalIgv,
        sctrCost: sctrTotal,
        sctrCostIgv: sctrTotalIgv,
    }), [
        equiposPrincipalesTotal, equiposPrincipalesTotalIgv,
        estructurasTotal, estructurasTotalIgv,
        consumiblesTotal, consumiblesTotalIgv,
        eppTotal, eppTotalIgv,
        toolingTotal, toolingTotalIgv,
        hotelTotal, hotelTotalIgv,
        personalTotal, personalTotalIgv,
        sctrTotal, sctrTotalIgv,
    ]);

    // VIÁTICOS
    const viaticosCosts: ViaticosCostsInput = useMemo(() => ({
        eatingTotal,
        eatingTotalIgv,
        travelingTotal,
        travelingTotalIgv,
        courierTotal,
        courierTotalIgv,
    }), [eatingTotal, eatingTotalIgv, 
        travelingTotal, travelingTotalIgv, 
        courierTotal, courierTotalIgv]);

    // -----------------
    // ALMACENAR CÁLCULOS EN LAS TABLAS PRINCIPALES
    // -----------------

    // -------- RECURSOS
    const subtotal_recursos = useMemo(
        () => computeSubtotalRecursos(recursosCosts),
        [recursosCosts],
    );
    const margenRiesgo_recursos = useMemo(
        () => computeMargenRiesgoRecursos(recursosCosts, gm_general),
        [recursosCosts, gm_general],
    );
    const subtotalConMargenRiesgo_recursos = useMemo(
        () => computeSubtotalConMargenRecursos(recursosCosts, gm_general),
        [recursosCosts, gm_general],
    );
    const markUp_recursos = useMemo(
        () => computeMarkUpRecursos(recursosCosts, markup, gm_general),
        [recursosCosts, markup, gm_general],
    );
    const ventaRecursos = useMemo(
        () => computeVentaRecursos(recursosCosts, markup, gm_general, tasa_cambio),
        [recursosCosts, markup, gm_general, tasa_cambio],
    );
    // -------- VIÁTICOS
    const subtotal_viaticos = useMemo(
        () => computeSubtotalViaticos(viaticosCosts),
        [viaticosCosts],
    );
    const margenRiesgo_viaticos = useMemo(
        () => computeMargenRiesgoViaticos(viaticosCosts, gm_viaticos),
        [viaticosCosts, gm_viaticos],
    );
    const ventaViaticos = useMemo(
        () => computeVentaViaticos(viaticosCosts, gm_viaticos),
        [viaticosCosts, gm_viaticos],
    );
    // -------- TOTAL FINAL + GROSS MARGIN
    const {
        precioFinal,
        precioFinalIgv,
        precioFinalDolares,
        precioFinalDolaresIgv,
    } = useMemo(
        () => computePrecioFinal(ventaRecursos, ventaViaticos, tasa_cambio),
        [ventaRecursos, ventaViaticos, tasa_cambio],
    );
    const GrossMargin = useMemo(
        () => computeGrossMargin(recursosCosts, markup, gm_general, tasa_cambio),
        [recursosCosts, markup, gm_general, tasa_cambio],
    );

    // -------- Alias (compatibilidad con el return)
    const ventaSoles_recursos = ventaRecursos;
    const ventaSoles_viaticos = ventaViaticos;
    const ventaSolesIgv_recursos = ventaRecursos.ventaSolesIgv;
    const ventaDolares_recursos = ventaRecursos.ventaDolares;
    const ventaDolaresIgv_recursos = ventaRecursos.ventaDolaresIgv;
    const ventaSolesIgv_viaticos = ventaViaticos.ventaSolesIgv;
    const ventaDolares_viaticos = ventaViaticos.ventaSoles / tasa_cambio;
    const ventaDolaresIgv_viaticos = ventaViaticos.ventaSolesIgv / tasa_cambio;

    // -----------------
    // OUTPUT
    // -----------------

    return{
        // TOTALES RECURSOS
        equiposPrincipalesTotal,
        equiposPrincipalesTotalIgv,
        estructurasTotal,
        estructurasTotalIgv,
        consumiblesTotal,
        consumiblesTotalIgv,
        eppTotal,
        eppTotalIgv,
        toolingTotal,
        toolingTotalIgv,
        hotelTotal,
        hotelTotalIgv,
        personalTotal,
        personalTotalIgv,
        sctrTotal,
        sctrTotalIgv,
        // TOTALES VIÁTICOS
        eatingTotal,
        eatingTotalIgv,
        travelingTotal,
        travelingTotalIgv,
        courierTotal,
        courierTotalIgv,
        // TOTALES PRINCIPALES RECURSOS
        subtotal_recursos,
        margenRiesgo_recursos,
        subtotalConMargenRiesgo_recursos,
        markUp_recursos,
        ventaSoles_recursos,
        ventaSolesIgv_recursos,
        ventaDolares_recursos,
        ventaDolaresIgv_recursos,
        // TOTALES PRINCIPALES VIÁTICOS
        subtotal_viaticos,
        margenRiesgo_viaticos,
        ventaSoles_viaticos,
        ventaSolesIgv_viaticos,
        ventaDolares_viaticos,
        ventaDolaresIgv_viaticos,
        // TOTALES DEFINITIVOS
        precioFinal,
        precioFinalIgv,
        precioFinalDolares,
        precioFinalDolaresIgv,
        // Gross Margin
        GrossMargin
    }

    
}
