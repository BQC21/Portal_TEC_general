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

export type RecursosSubtotalInput = {
    subtotal_recursos: number;
    margenRiesgo_recursos: number;
    subtotalConMargenRiesgo_recursos: number;
    markUp_recursos: number;
    ventaSoles_recursos: number;
    ventaSolesIgv_recursos: number;
    ventaDolares_recursos: number;
    ventaDolaresIgv_recursos: number;
};

export type ViaticosSubtotalInput = {
    subtotal_viaticos: number;
    margenRiesgo_viaticos: number;
    subtotalConMargenRiesgo_viaticos: number;
    markUp_viaticos: number;
    ventaSoles_viaticos: number;
    ventaSolesIgv_viaticos: number;
    ventaDolares_viaticos: number;
    ventaDolaresIgv_viaticos: number;   
};

export type SummaryCostTable1_props = RecursosCostsInput & {
    gm_general: number;
    markup: number;
    tasa_cambio: number;
} & RecursosSubtotalInput;

export type SummaryCostTable2_props = ViaticosCostsInput & {
    gm_general: number;
    markup: number;
    tasa_cambio: number;
} & ViaticosSubtotalInput;