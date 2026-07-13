export type RecursosCostsInput = {
    equiposPrincipalesCost: number;
    equiposPrincipalesCostIgv: number;
    estructurasCost: number;
    estructurasCostIgv: number;
    consumiblesCost: number;
    consumiblesCostIgv: number;
    eppCost: number;
    eppCostIgv: number;
    toolingCost: number;
    toolingCostIgv: number;
    hotelCost: number;
    hotelCostIgv: number;
    personalCost: number;
    personalCostIgv: number;
    sctrCost: number;
    sctrCostIgv: number;
};

export type ViaticosCostsInput = {
    eatingTotal: number;
    eatingTotalIgv: number;
    travelingTotal: number;
    travelingTotalIgv: number;
    courierTotal: number;
    courierTotalIgv: number;
};

export type SummaryCostTable1_props = RecursosCostsInput & {
    gm_general: number;
    markup: number;
    tasa_cambio: number;
}