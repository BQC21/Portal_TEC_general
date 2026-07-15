import { computeGrossMargin, computeMargenRiesgoRecursos, computeMargenRiesgoViaticos, 
    computeMarkUpRecursos, computePrecioFinal, computeSubtotalConMargenRecursos,
    computeSubtotalRecursos, computeSubtotalViaticos, 
    computeVentaRecursos, computeVentaViaticos } from "@/lib/utils/helpers/computes/quote_computes";
import { recursos, viaticos, precioFinal, grossMargin } from "@/lib/types/components/Quotes/finantial_computes";
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
    const recursosCosts: recursos = useMemo(() => ({
        equiposPrincipales: {
            total: equiposPrincipalesTotal,
            igv: equiposPrincipalesTotalIgv,
        },
        estructuras: {
            total: estructurasTotal,
            igv: estructurasTotalIgv,
        },
        consumibles: {
            total: consumiblesTotal,
            igv: consumiblesTotalIgv,
        },
        epp: {
            total: eppTotal,
            igv: eppTotalIgv,
        },
        tooling: {
            total: toolingTotal,
            igv: toolingTotalIgv,
        },
        hotel: {
            total: hotelTotal,
            igv: hotelTotalIgv,
        },
        personal: {
            total: personalTotal,
            igv: personalTotalIgv,
        },
        sctr: {
            total: sctrTotal,
            igv: sctrTotalIgv,
        },
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
    }), [
        equiposPrincipalesTotal, equiposPrincipalesTotalIgv,
        estructurasTotal, estructurasTotalIgv,
        consumiblesTotal, consumiblesTotalIgv,
        eppTotal, eppTotalIgv,
        toolingTotal, toolingTotalIgv,
        hotelTotal, hotelTotalIgv,
        personalTotal, personalTotalIgv,
        sctrTotal, sctrTotalIgv,
        eatingTotal, eatingTotalIgv,
        travelingTotal, travelingTotalIgv,
    ]);

    // VIÁTICOS
    const viaticosCosts: viaticos = useMemo(() => ({
        eating: {
            total: eatingTotal,
            igv: eatingTotalIgv,
        },
        traveling: {
            total: travelingTotal,
            igv: travelingTotalIgv,
        },
        courier: {
            total: courierTotal,
            igv: courierTotalIgv,
        },
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
    }), [eatingTotal, eatingTotalIgv, 
        travelingTotal, travelingTotalIgv, 
        courierTotal, courierTotalIgv,
        tasa_cambio,
    ]);

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
        () => computeVentaViaticos(viaticosCosts, gm_viaticos, tasa_cambio),
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


    // -----------------
    // OUTPUT
    // -----------------

    return {
        recursos: {
            equiposPrincipales: {
                total: equiposPrincipalesTotal,
                igv: equiposPrincipalesTotalIgv,
            },
            estructuras: {
                total: estructurasTotal,
                igv: estructurasTotalIgv,
            },
            consumibles: {
                total: consumiblesTotal,
                igv: consumiblesTotalIgv,
            },
            epp: {
                total: eppTotal,
                igv: eppTotalIgv,
            },
            tooling: {
                total: toolingTotal,
                igv: toolingTotalIgv,
            },
            hotel: {
                total: hotelTotal,
                igv: hotelTotalIgv,
            },
            personal: {
                total: personalTotal,
                igv: personalTotalIgv,
            },
            sctr: {
                total: sctrTotal,
                igv: sctrTotalIgv,
            },

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
            eating: {
                total: eatingTotal,
                igv: eatingTotalIgv,
            },
            traveling: {
                total: travelingTotal,
                igv: travelingTotalIgv,
            },
            courier: {
                total: courierTotal,
                igv: courierTotalIgv,
            },

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
    }
}
