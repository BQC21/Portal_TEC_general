import { computeGrossMargin, computePrecioFinal, computeVentaRecursos, computeVentaViaticos } from "@/lib/utils/helpers/computes/quote_computes";
import { RecursosCostsInput, ViaticosCostsInput } from "@/lib/types/components/finantial_computes";
import { ManualResourceCosts } from "@/lib/types/components/manual_resources";
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
        Number(manualResourceCosts.hotel.monto) * Number(manualResourceCosts.hotel.personas) * Number(manualResourceCosts.hotel.dias),
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
        Number(manualResourceCosts.eating?.monto ?? 0) * Number(manualResourceCosts.eating?.personas ?? 0) * Number(manualResourceCosts.eating?.dias ?? 0),
        [manualResourceCosts],
    );
    const eatingTotalIgv = useMemo(() =>
        Number(eatingTotal) * Number(1.18),
        [eatingTotal],
    );

    // VIAJE Y MOVILIDAD
    const travelingTotal = useMemo(() =>
        Number(manualResourceCosts.traveling?.monto ?? 0) * Number(manualResourceCosts.traveling?.personas ?? 0) * Number(manualResourceCosts.traveling?.dias ?? 0),
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
    // ENVÏO DE TOTALES A LA TABLA PRINCIPAL
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

    // subtotal
    const subtotal = useMemo(() =>
        recursosCosts.equiposPrincipalesCost + recursosCosts.estructurasCost + recursosCosts.consumiblesCost + recursosCosts.eppCost + recursosCosts.toolingCost + recursosCosts.hotelCost + recursosCosts.personalCost + recursosCosts.sctrCost + viaticosCosts.eatingTotal + viaticosCosts.travelingTotal + viaticosCosts.courierTotal,
        [recursosCosts, viaticosCosts],
    );

    // Margen de riesgo
    const margenRiesgo = useMemo(() =>
        subtotal * gm_general,
        [subtotal, gm_general],
    );

    // Subtotal con Margen de Riesgo
    const subtotalConMargenRiesgo = useMemo(() =>
        subtotal + margenRiesgo,
        [subtotal, margenRiesgo],
    );

    // MarkUp
    const markUp = useMemo(() =>
        subtotalConMargenRiesgo * markup,
        [subtotalConMargenRiesgo, markup],
    );

    // Venta (s/.)
    const ventaSoles = useMemo(() =>
        markUp,
        [subtotalConMargenRiesgo, markup],
    );
    const ventaSolesIgv = useMemo(() =>
        ventaSoles * 1.18,
        [ventaSoles],
    );

    // venta ($)
    const ventaDolares = useMemo(() =>
        ventaSoles / tasa_cambio,
        [ventaSoles, tasa_cambio],
    );

    // venta ($ IGV)
    const ventaDolaresIgv = useMemo(() =>
        ventaSoles / tasa_cambio,
        [ventaSoles, tasa_cambio],
    );

    // -----------------
    // ALMACENAR CÁLCULOS EN LAS TABLAS DEFINITIVA
    // -----------------

    const ventaRecursos = useMemo(
        () => computeVentaRecursos(recursosCosts, markup, tasa_cambio, gm_general),
        [recursosCosts, markup, tasa_cambio],
    );

    const ventaViaticos = useMemo(
        () => computeVentaViaticos(viaticosCosts, gm_viaticos),
        [viaticosCosts, gm_viaticos],
    );

    const {
        precioFinal,
        precioFinalIgv,
        precioFinalDolares,
        precioFinalDolaresIgv,
    } = useMemo(
        () => computePrecioFinal(ventaRecursos, ventaViaticos, tasa_cambio),
        [ventaRecursos, ventaViaticos, tasa_cambio],
    );

    // -----------------
    // ALMACENAR CÁLCULOS EN LAS TABLAS SECUNDARIAS
    // -----------------

    const GrossMargin = useMemo(() => 
        computeGrossMargin(recursosCosts, markup, gm_general, tasa_cambio),
        [recursosCosts, markup, gm_general, tasa_cambio]
    )

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
        // TOTALES PRINCIPALES
        subtotal,
        margenRiesgo,
        subtotalConMargenRiesgo,
        markUp,
        ventaSoles,
        ventaSolesIgv,
        ventaDolares,
        ventaDolaresIgv,
        // TOTALES DEFINITIVOS
        precioFinal,
        precioFinalIgv,
        precioFinalDolares,
        precioFinalDolaresIgv,
        // Gross Margin
        GrossMargin
    }

    
}
