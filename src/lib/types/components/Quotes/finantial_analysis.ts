export type EnergyRow = {
    year: number;
    energy_mwh: number;
    degradation_pct: number;
};

export type FlowRow = {
    year: number;
    equipamiento: number;
    tarifa_cliente: number | null;
    om: number | null;
    energy_mwh: number | null;
    ahorro: number | null;
    flujo_total: number;
    flujo_acumulado: number;
};

export type FinantialAnalysis = {
    capex: number;
    opex: number;
    tiempo_retorno: string | null;
    energyRows: EnergyRow[];
    flowRows: FlowRow[];
    capex_total: number;
    om_total: number;
    energia_total: number;
    lcoe: number | null;
    van: number | null;
    inverterReplacementCost: number;
    batteryReplacementCost: number;
};

export type FinantialComputeInput = {
    precio_venta: number;
    generacion: number;
    tarifa_red: number;
    degra_1er: number;
    degra_2do: number;
    tarifa_crecimiento: number;
    tasa_descuento: number;
    maxYear: number;
    inverterReplacementCost: number;
    batteryReplacementCost: number;
    inverterReplacementYears: number[];
    batteryReplacementYears: number[];
};
