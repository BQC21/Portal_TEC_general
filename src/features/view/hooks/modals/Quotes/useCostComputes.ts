import { computeGrossMargin, computeMargenRiesgoRecursos, computeMargenRiesgoViaticos, 
    computeMarkUpRecursos, computePrecioFinal, computeSubtotalConMargenRecursos,
    computeSubtotalRecursos, computeSubtotalViaticos, 
    computeVentaRecursos, computeVentaViaticos } from "@/lib/utils/helpers/computes/quote_computes";
import { ManualCosts } from "@/lib/types/components/Quotes/manual_resources";
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join";
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join";
import { useMateriales } from "@/features/view/hooks/services/useRealtimeMateriales";
import { buildSortedConsumibles } from "@/lib/utils/helpers/sorting/consumiblesSort";
import { isReusableEpp } from "@/features/view/sub_components/M3/Tables/quotes/templates/Prices";
import { useMemo } from "react";

export function useCostComputes(
    projectEquipos: Project_Equipos[],
    projectMateriales: Project_Materiales[],
    manualCosts: ManualCosts,
    gm_general: number,
    markup: number,
    gm_viaticos: number,
    tasa_cambio: number,
    depre_tool: number,
) {
    const { materiales } = useMateriales();

    // -----------------
    // ALMACENAR CÁLCULOS EN LAS TABLAS SECUNDARIAS
    // -----------------

    ///// RECURSOS


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
    const consumibleRows = useMemo(
        () => buildSortedConsumibles(projectMateriales, manualCosts.Recursos.consumible, materiales),
        [projectMateriales, manualCosts.Recursos.consumible, materiales],
    );
    const consumiblesTotal = useMemo(() =>
        consumibleRows.reduce(
            (sum, item) => sum + Number(item.precio_soles) * Number(item.cantidad),
            0,
        ),
        [consumibleRows],
    );
    const consumiblesTotalIgv = useMemo(() =>
        consumibleRows.reduce(
            (sum, item) => sum + Number(item.precio_soles_igv) * Number(item.cantidad),
            0,
        ),
        [consumibleRows],
    );
    
    // EPPs (los reutilizables no entran a este costo)
    const considerarEppReutilizable = manualCosts.Recursos.considerar_epp_reutilizable !== false;
    const eppReusableTotal = useMemo(() =>
        considerarEppReutilizable
            ? manualCosts.Recursos.epp
                .filter((item) => isReusableEpp(item.descripcion))
                .reduce((sum, item) => sum + Number(item.cantidad) * Number(item.precio_unitario), 0)
            : 0,
        [manualCosts, considerarEppReutilizable],
    );
    const eppTotal = useMemo(() =>
        manualCosts.Recursos.epp
            .filter((item) => !isReusableEpp(item.descripcion))
            .reduce((sum, item) => sum + Number(item.cantidad) * Number(item.precio_unitario), 0),
        [manualCosts],
    );
    const eppTotalIgv = useMemo(() =>
        Number(eppTotal) * Number(1.18),
        [eppTotal],
    );

    // HERRAMIENTAS (incluye EPPs reutilizables y se deprecia)
    const depre = Number(depre_tool) || 1;
    const toolingTotal = useMemo(() =>
        (manualCosts.Recursos.tooling.reduce(
            (sum, item) => sum + Number(item.cantidad) * Number(item.precio_unitario),
            eppReusableTotal,
        )) / depre,
        [manualCosts, eppReusableTotal, depre],
    );
    const toolingTotalIgv = useMemo(() =>
        Number(toolingTotal) * Number(1.18),
        [toolingTotal],
    );

    // PERSONAL
    const personalTotal = useMemo(() =>
        manualCosts.Recursos.personal.reduce((sum, item) => sum + Number(item.dias) * Number(item.precio_dia), 0),
        [manualCosts],
    );
    const personalTotalIgv = useMemo(() =>
        Number(personalTotal) * Number(1.18),
        [personalTotal],
    );

    // SCTR
    const sctrTotal = useMemo(() =>
        manualCosts.Recursos.sctr.reduce((sum, item) => sum + Number(item.cantidad) * Number(item.precio_unitario), 0),
        [manualCosts],
    );
    const sctrTotalIgv = useMemo(() =>
        Number(sctrTotal) * Number(1.18),
        [sctrTotal],
    );

    ///// VIATICOS

    // // HOTEL
    // const hotelTotal = useMemo(() =>
    //     Number(manualCosts.Viaticos.hotel?.monto ?? 0) * Number(manualCosts.Viaticos.hotel?.personas ?? 0) * 
    //         Number(manualCosts.Viaticos.hotel?.dias ?? 0),
    //     [manualCosts],
    // );
    // // ALIMENTACIÓN
    // const eatingTotal = useMemo(() =>
    //     (manualCosts.Viaticos.eating ?? []).reduce(
    //         (sum, item) =>
    //             sum +
    //             Number(item.monto) * Number(item.personas) * Number(item.dias),
    //         0,
    //     ),
    //     [manualCosts],
    // );
    // // MOVILIDAD
    // const mobilityTotal = useMemo(() =>
    //     Number(manualCosts.Viaticos.mobility?.monto ?? 0) * 
    //     Number(manualCosts.Viaticos.mobility?.personas ?? 0) * 
    //     Number(manualCosts.Viaticos.mobility?.dias ?? 0),
    //     [manualCosts],
    // );

    // Gastos Viaje
    const gastos_viajeTotal = useMemo(() =>
        (manualCosts.Viaticos.gastos_viaje ?? []).reduce(
            (sum, item) =>
                sum +
                Number(item.monto) * Number(item.personas) * Number(item.dias),
            0,
        ),
        [manualCosts],
    );
    // COURIER
    const courierTotal = useMemo(() =>
        manualCosts.Viaticos.courier.reduce((sum, item) => sum + Number(item.cantidad) * Number(item.precio_unitario), 0),
        [manualCosts],
    );

    // -----------------
    // AGREGACIÓN DE COSTOS
    // -----------------

    // RECURSOS (solo ítems; el resumen se calcula después)
    const recursosCosts = useMemo(() => ({
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
        personal: {
            total: personalTotal,
            igv: personalTotalIgv,
        },
        sctr: {
            total: sctrTotal,
            igv: sctrTotalIgv,
        },
    }), [
        equiposPrincipalesTotal, equiposPrincipalesTotalIgv,
        estructurasTotal, estructurasTotalIgv,
        consumiblesTotal, consumiblesTotalIgv,
        eppTotal, eppTotalIgv,
        toolingTotal, toolingTotalIgv,
        personalTotal, personalTotalIgv,
        sctrTotal, sctrTotalIgv,
    ]);

    // VIÁTICOS (solo ítems; el resumen se calcula después)
    const viaticosCosts = useMemo(() => ({
        // eating: {
        //     total: eatingTotal,
        // },
        // mobility: {
        //     total: mobilityTotal,
        // },
        // hotel: {
        //     total: hotelTotal,
        // },
        gastos_viaje: {
            total: gastos_viajeTotal,
        },
        courier: {
            total: courierTotal,
        },
    }), [
        // eatingTotal,
        // mobilityTotal,
        // hotelTotal,
        gastos_viajeTotal,
        courierTotal,
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

        // Se registran en los totales de sus subtablas respectivas
        // los precios con IGV incluído
        viaticos: {
            // eating: {
            //     total: eatingTotal,
            // },
            // mobility: {
            //     total: mobilityTotal,
            // },
            // hotel: {
            //     total: hotelTotal,
            // },
            gastos_viaje: {
                total: gastos_viajeTotal,
            },
            courier: {
                total: courierTotal,
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
