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
    subtotal_recursos_soles: number;
    subtotal_recursos_igv: number;
    margenRiesgo_recursos_soles: number;
    margenRiesgo_recursos_igv: number;
    subtotalConMargenRiesgo_recursos_soles: number;
    subtotalConMargenRiesgo_recursos_igv: number;
    markUp_recursos_soles: number;
    markUp_recursos_igv: number;
    ventaSoles_recursos_soles: number;
    ventaSoles_recursos_igv: number;
    ventaDolares_recursos_soles: number;
    ventaDolares_recursos_igv: number;
};

export type ViaticosSubtotalInput = {
    subtotal_viaticos_soles: number;
    subtotal_viaticos_igv: number;
    margenRiesgo_viaticos_soles: number;
    margenRiesgo_viaticos_igv: number;
    ventaSoles_viaticos_soles: number;
    ventaSoles_viaticos_igv: number;
    ventaDolares_viaticos_soles: number;
    ventaDolares_viaticos_igv: number;
};