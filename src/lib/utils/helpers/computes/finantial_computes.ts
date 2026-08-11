import {
    EnergyRow,
    FinantialAnalysis,
    FinantialComputeInput,
    FlowRow,
} from "@/lib/types/components/Quotes/finantial_analysis";

const VAN_HORIZON = 20; // años futuros a considerar para el cálculo del VAN
const INVERTER_REPLACEMENT_YEAR = 10; // alis dibde se carga el costo de reposición de inversores
const OPEX_RATE = 0.015; // Porcentaje del CAPEX para calcular el OPEX

// Construcción de la energía
export function buildEnergyRows(input: {
    generacion: number;
    degra_1er: number;
    degra_2do: number;
    maxYear: number;
}): EnergyRow[] {
    const { generacion, degra_1er, degra_2do, maxYear } = input;
    if (generacion <= 0 || maxYear < 0) return [];

    const pctYear1 = 100 - degra_1er;
    if (pctYear1 <= 0) return [];

    const energyYear0 = generacion * (100 / pctYear1);
    const rows: EnergyRow[] = [];

    for (let year = 0; year <= maxYear; year++) {
        let degradation_pct: number;
        if (year === 0) {
            degradation_pct = 100;
        } else if (year === 1) {
            degradation_pct = pctYear1;
        } else {
            degradation_pct = pctYear1 - degra_2do * (year - 1);
        }

        const energy_mwh = energyYear0 * (degradation_pct / 100);
        rows.push({ year, energy_mwh, degradation_pct });
    }

    return rows;
}

// Arma la tabla para el flujo de caja
export function buildFlowRows(input: {
    capex: number;
    opex: number;
    tarifa_red: number;
    tarifa_crecimiento: number;
    energyRows: EnergyRow[];
    inverterReplacementCost: number;
}): FlowRow[] {
    const {
        capex,
        opex,
        tarifa_red,
        tarifa_crecimiento,
        energyRows,
        inverterReplacementCost,
    } = input;

    const growth = tarifa_crecimiento / 100;
    const rows: FlowRow[] = [];
    let previousCum = 0;

    for (const energyRow of energyRows) {
        const { year, energy_mwh } = energyRow;

        if (year === 0) {
            const equipamiento = capex;
            const flujo_total = -(equipamiento);
            const flujo_acumulado = flujo_total;
            previousCum = flujo_acumulado;
            rows.push({
                year,
                equipamiento,
                tarifa_cliente: null,
                om: null,
                energy_mwh: null,
                ahorro: null,
                flujo_total,
                flujo_acumulado,
            });
            continue;
        }

        const equipamiento =
            year === INVERTER_REPLACEMENT_YEAR ? inverterReplacementCost : 0;
        const tarifa_cliente =
            year === 1
                ? tarifa_red
                : tarifa_red * Math.pow(1 + growth, year - 1);
        const om =
            year === 1
                ? opex
                : opex * Math.pow(1 + growth, year - 1);
        const ahorro = tarifa_cliente * energy_mwh;
        // Costos restan, ahorro suma (equivalente económico a la hoja)
        const flujo_total = -equipamiento - om + ahorro;
        const flujo_acumulado = previousCum + flujo_total;
        previousCum = flujo_acumulado;

        rows.push({
            year,
            equipamiento,
            tarifa_cliente,
            om,
            energy_mwh,
            ahorro,
            flujo_total,
            flujo_acumulado,
        });
    }

    return rows;
}

// Cálculo del tiempo de recuperación
export function computePaybackYears(flowRows: FlowRow[]): number | null {
    const firstPositive = flowRows.find(
        (row) => row.year > 0 && row.flujo_acumulado >= 0
    );
    if (!firstPositive) return null;

    const t = firstPositive.year - 1;
    const rowT = flowRows.find((row) => row.year === t);
    const rowT1 = flowRows.find((row) => row.year === t + 1);
    if (!rowT || !rowT1 || rowT1.flujo_total === 0) return null;

    return t + Math.abs(rowT.flujo_acumulado) / rowT1.flujo_total;
}

// Cálculo del LCOE
export function computeLcoe(
    capexTotal: number,
    omTotal: number,
    energiaTotal: number
): number | null {
    if (energiaTotal <= 0) return null;
    return (capexTotal + omTotal) / energiaTotal;
}

// Cálculo del VAN
export function computeVan(
    tasaDescuentoPct: number,
    flowRows: FlowRow[]
): number | null {
    const rate = tasaDescuentoPct / 100;
    const flow0 = flowRows.find((row) => row.year === 0)?.flujo_total;
    if (flow0 === undefined) return null;

    let npvFuture = 0;
    for (let year = 1; year <= VAN_HORIZON; year++) {
        const row = flowRows.find((r) => r.year === year);
        if (!row) return null;
        npvFuture += row.flujo_total / Math.pow(1 + rate, year);
    }

    return npvFuture + flow0;
}

// Orquestación de todo el análisis
export function computeFinantialAnalysis(
    input: FinantialComputeInput
): FinantialAnalysis {
    const capex = input.precio_venta > 0 ? input.precio_venta : 0;
    const opex = capex * OPEX_RATE;

    const energyRows = buildEnergyRows({
        generacion: input.generacion,
        degra_1er: input.degra_1er,
        degra_2do: input.degra_2do,
        maxYear: input.maxYear,
    });

    const flowRows = buildFlowRows({
        capex,
        opex,
        tarifa_red: input.tarifa_red,
        tarifa_crecimiento: input.tarifa_crecimiento,
        energyRows,
        inverterReplacementCost: input.inverterReplacementCost,
    });

    const capex_total = flowRows.reduce((sum, row) => sum + row.equipamiento, 0);
    const om_total = flowRows.reduce((sum, row) => sum + (row.om ?? 0), 0);
    const energia_total = flowRows.reduce(
        (sum, row) => sum + (row.energy_mwh ?? 0),
        0
    );

    return {
        capex,
        opex,
        tiempo_retorno: computePaybackYears(flowRows),
        energyRows,
        flowRows,
        capex_total,
        om_total,
        energia_total,
        lcoe: computeLcoe(capex_total, om_total, energia_total),
        van: computeVan(input.tasa_descuento, flowRows),
    };
}

// Cálculo del reemplazo para el año 10
export function getInverterReplacementCost(
    projectEquipos: Array<{
        equipo_info?: {
            tipo_de_producto?: string;
            precio_dolares?: string | number;
        };
        cantidad?: string | number;
    }>
): number {
    return projectEquipos
        .filter(
            (item) =>
                item.equipo_info?.tipo_de_producto?.toUpperCase() === "INVERSOR"
        )
        .reduce(
            (sum, item) =>
                sum +
                Number(item.equipo_info?.precio_dolares ?? 0) *
                    Number(item.cantidad ?? 0),
            0
        );
}
